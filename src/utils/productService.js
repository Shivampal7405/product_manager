import supabase from './supabase';

const productService = {
  // Get all products with filters and sorting
  async getProducts(filters = {}, sortConfig = { column: 'created_at', direction: 'desc' }) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          brand:brands(id, name),
          created_by:user_profiles(id, full_name)
        `);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.brand) {
        query = query.eq('brand_id', filters.brand);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.searchQuery) {
        query = query.or(`
          name.ilike.%${filters.searchQuery}%,
          sku.ilike.%${filters.searchQuery}%,
          description.ilike.%${filters.searchQuery}%
        `);
      }

      if (filters.priceMin) {
        query = query.gte('price', filters.priceMin);
      }

      if (filters.priceMax) {
        query = query.lte('price', filters.priceMax);
      }

      // Apply stock status filter
      if (filters.stockStatus) {
        if (filters.stockStatus === 'in_stock') {
          query = query.gt('stock', 10);
        } else if (filters.stockStatus === 'low_stock') {
          query = query.gte('stock', 1).lte('stock', 10);
        } else if (filters.stockStatus === 'out_of_stock') {
          query = query.eq('stock', 0);
        }
      }

      // Apply date range filter
      if (filters.dateRange) {
        const now = new Date();
        const daysAgo = new Date(now.getTime() - (filters.dateRange * 24 * 60 * 60 * 1000));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      if (filters.customDateFrom && filters.customDateTo) {
        query = query.gte('created_at', filters.customDateFrom)
                     .lte('created_at', filters.customDateTo);
      }

      // Apply sorting
      if (sortConfig.column && sortConfig.direction) {
        query = query.order(sortConfig.column, { ascending: sortConfig.direction === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Transform data to match expected format
      const transformedData = data?.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: parseFloat(product.price),
        stock: product.stock,
        status: product.status,
        category: product.category?.name || '',
        brand: product.brand?.name || '',
        image: product.image_url,
        lastModified: product.updated_at,
        createdBy: product.created_by?.full_name || ''
      })) || [];

      return { success: true, data: transformedData };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { success: false, error: 'Failed to load products' };
    }
  },

  // Get single product by ID
  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          brand:brands(id, name),
          created_by:user_profiles(id, full_name),
          product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Transform data
      const transformedData = {
        id: data.id,
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: parseFloat(data.price),
        stock: data.stock,
        status: data.status,
        category: data.category?.name || '',
        brand: data.brand?.name || '',
        image: data.image_url,
        images: data.product_images || [],
        lastModified: data.updated_at,
        createdBy: data.created_by?.full_name || ''
      };

      return { success: true, data: transformedData };
    } catch (error) {
      return { success: false, error: 'Failed to load product' };
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category_id: productData.categoryId,
          brand_id: productData.brandId,
          status: productData.status || 'active',
          image_url: productData.imageUrl,
          created_by: (await supabase.auth.getUser()).data?.user?.id
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to create product' };
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          category_id: productData.categoryId,
          brand_id: productData.brandId,
          status: productData.status,
          image_url: productData.imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update product' };
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete product' };
    }
  },

  // Delete multiple products
  async deleteProducts(ids) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete products' };
    }
  },

  // Get categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to load categories' };
    }
  },

  // Get brands
  async getBrands() {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: 'Failed to load brands' };
    }
  },

  // Get product statistics
  async getProductStats() {
    try {
      const { data: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('id', { count: 'exact' });

      const { data: activeProducts, error: activeError } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('status', 'active');

      const { data: lowStockProducts, error: lowStockError } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .lte('stock', 10)
        .gt('stock', 0);

      const { data: outOfStockProducts, error: outOfStockError } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('stock', 0);

      if (totalError || activeError || lowStockError || outOfStockError) {
        return { success: false, error: 'Failed to load statistics' };
      }

      return {
        success: true,
        data: {
          total: totalProducts?.length || 0,
          active: activeProducts?.length || 0,
          lowStock: lowStockProducts?.length || 0,
          outOfStock: outOfStockProducts?.length || 0
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to load statistics' };
    }
  }
};

export default productService;