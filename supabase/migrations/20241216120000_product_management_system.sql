-- Location: supabase/migrations/20241216120000_product_management_system.sql
-- Product Management System with Authentication

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'discontinued');
CREATE TYPE public.stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock');

-- 2. User Profiles Table (Intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Brands Table  
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    status public.product_status DEFAULT 'active'::public.product_status,
    image_url TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Images Table (For multiple images)
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_created_by ON public.products(created_by);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);

-- 8. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 9. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'manager')
)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_product(product_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.user_profiles up ON p.created_by = up.id
    WHERE p.id = product_uuid AND (
        up.id = auth.uid() OR
        public.is_manager_or_admin()
    )
)
$$;

-- 10. RLS Policies
-- User Profiles
CREATE POLICY "users_view_own_profile" ON public.user_profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_profile" ON public.user_profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- Categories (Public read, admin manage)
CREATE POLICY "public_view_categories" ON public.categories
FOR SELECT TO public
USING (true);

CREATE POLICY "admin_manage_categories" ON public.categories
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Brands (Public read, admin manage)
CREATE POLICY "public_view_brands" ON public.brands
FOR SELECT TO public
USING (true);

CREATE POLICY "admin_manage_brands" ON public.brands
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Products (Public read, authenticated users create, owners/managers edit)
CREATE POLICY "public_view_products" ON public.products
FOR SELECT TO public
USING (true);

CREATE POLICY "authenticated_create_products" ON public.products
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "owners_managers_update_products" ON public.products
FOR UPDATE TO authenticated
USING (public.can_manage_product(id))
WITH CHECK (public.can_manage_product(id));

CREATE POLICY "owners_managers_delete_products" ON public.products
FOR DELETE TO authenticated
USING (public.can_manage_product(id));

-- Product Images (Follow product permissions)
CREATE POLICY "public_view_product_images" ON public.product_images
FOR SELECT TO public
USING (true);

CREATE POLICY "authenticated_manage_product_images" ON public.product_images
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_id AND public.can_manage_product(p.id)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_id AND public.can_manage_product(p.id)
    )
);

-- 11. Automatic profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Updated timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    member_uuid UUID := gen_random_uuid();
    electronics_uuid UUID := gen_random_uuid();
    sports_uuid UUID := gen_random_uuid();
    clothing_uuid UUID := gen_random_uuid();
    books_uuid UUID := gen_random_uuid();
    home_uuid UUID := gen_random_uuid();
    apple_uuid UUID := gen_random_uuid();
    samsung_uuid UUID := gen_random_uuid();
    nike_uuid UUID := gen_random_uuid();
    adidas_uuid UUID := gen_random_uuid();
    sony_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    product3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@productmanager.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Product Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@productmanager.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Product Manager", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (member_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'member@productmanager.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Team Member", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert categories
    INSERT INTO public.categories (id, name, description) VALUES
        (electronics_uuid, 'electronics', 'Electronic devices and gadgets'),
        (sports_uuid, 'sports', 'Sports and fitness equipment'),
        (clothing_uuid, 'clothing', 'Apparel and fashion items'),
        (books_uuid, 'books', 'Books and educational materials'),
        (home_uuid, 'home', 'Home and garden products');

    -- Insert brands
    INSERT INTO public.brands (id, name, description) VALUES
        (apple_uuid, 'apple', 'Technology and consumer electronics'),
        (samsung_uuid, 'samsung', 'Electronics and mobile devices'),
        (nike_uuid, 'nike', 'Athletic footwear and apparel'),
        (adidas_uuid, 'adidas', 'Sports equipment and clothing'),
        (sony_uuid, 'sony', 'Consumer and professional electronics');

    -- Insert products
    INSERT INTO public.products (id, name, sku, description, price, stock, category_id, brand_id, status, image_url, created_by) VALUES
        (product1_uuid, 'iPhone 15 Pro Max', 'IPH15PM-256-TB', 'Latest iPhone with titanium build and advanced camera system', 1199.99, 25, electronics_uuid, apple_uuid, 'active'::public.product_status, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', admin_uuid),
        (product2_uuid, 'Samsung Galaxy S24 Ultra', 'SGS24U-512-BK', 'Premium Android smartphone with S Pen and AI features', 1299.99, 18, electronics_uuid, samsung_uuid, 'active'::public.product_status, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', manager_uuid),
        (product3_uuid, 'Nike Air Max 270', 'NAM270-10-WH', 'Comfortable running shoes with Max Air cushioning', 150.00, 45, sports_uuid, nike_uuid, 'active'::public.product_status, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', member_uuid),
        (gen_random_uuid(), 'Sony WH-1000XM5', 'SWH1000XM5-BK', 'Premium noise-canceling wireless headphones', 399.99, 8, electronics_uuid, sony_uuid, 'active'::public.product_status, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', admin_uuid),
        (gen_random_uuid(), 'Adidas Ultraboost 22', 'AUB22-9-BK', 'High-performance running shoes with Boost technology', 180.00, 32, sports_uuid, adidas_uuid, 'active'::public.product_status, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop', manager_uuid);

    -- Insert additional product images
    INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
        (product1_uuid, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', 'iPhone 15 Pro Max front view', true, 1),
        (product2_uuid, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', 'Galaxy S24 Ultra front view', true, 1),
        (product3_uuid, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', 'Nike Air Max 270 side view', true, 1);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 14. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs for test accounts
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@productmanager.com';

    -- Delete in dependency order (children first)
    DELETE FROM public.product_images WHERE product_id IN (
        SELECT id FROM public.products WHERE created_by = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.products WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;