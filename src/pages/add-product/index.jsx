import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProductForm from './components/ProductForm';
import ImageUpload from './components/ImageUpload';
import ProductPreview from './components/ProductPreview';
import { LoadingOverlay } from '../../components/ui/LoadingStates';
import Icon from '../../components/AppIcon';

const AddProduct = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    brand: '',
    tags: '',
    costPrice: '',
    retailPrice: '',
    salePrice: '',
    quantity: '',
    lowStockThreshold: '',
    weight: '',
    dimensions: '',
    status: 'draft'
  });
  const [productImages, setProductImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      addProduct: 'Add New Product',
      productForm: 'Product Information',
      productImages: 'Product Images',
      preview: 'Preview',
      savingProduct: 'Saving product...',
      productSaved: 'Product saved successfully!',
      productPublished: 'Product published successfully!',
      errorSaving: 'Error saving product. Please try again.',
      backToList: 'Back to Product List'
    },
    es: {
      addProduct: 'Agregar Nuevo Producto',
      productForm: 'Información del Producto',
      productImages: 'Imágenes del Producto',
      preview: 'Vista Previa',
      savingProduct: 'Guardando producto...',
      productSaved: '¡Producto guardado exitosamente!',
      productPublished: '¡Producto publicado exitosamente!',
      errorSaving: 'Error al guardar el producto. Por favor intenta de nuevo.',
      backToList: 'Volver a la Lista de Productos'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  // Mock product data for preview updates
  const mockProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
      sku: "WBH-001",
      category: "electronics",
      brand: "AudioTech",
      tags: "wireless,bluetooth,headphones,audio",
      costPrice: 45.00,
      retailPrice: 89.99,
      salePrice: 79.99,
      quantity: 150,
      lowStockThreshold: 20,
      weight: 0.25,
      dimensions: "18 x 15 x 8 cm",
      status: "published"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity.",
      sku: "SFW-002",
      category: "electronics",
      brand: "FitTech",
      tags: "fitness,watch,smart,health",
      costPrice: 120.00,
      retailPrice: 249.99,
      salePrice: null,
      quantity: 75,
      lowStockThreshold: 15,
      weight: 0.05,
      dimensions: "4.5 x 4.5 x 1.2 cm",
      status: "published"
    }
  ];

  const handleProductSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new product object
      const newProduct = {
        id: Date.now(),
        ...formData,
        images: productImages,
        primaryImageIndex: primaryImageIndex,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call to save the product
      console.log('Saving product:', newProduct);
      
      // Show success message
      const message = formData.status === 'published' ? t.productPublished : t.productSaved;
      alert(message);
      
      // Navigate back to product list
      navigate('/product-list');
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert(t.errorSaving);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesChange = (images, primaryIndex = 0) => {
    setProductImages(images);
    setPrimaryImageIndex(primaryIndex);
  };

  // Update product data for preview (this would normally come from form state)
  const updateProductData = (data) => {
    setProductData(data);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar />
      
      <main className="md:ml-60 pt-16">
        <Breadcrumb />
        
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {t.addProduct}
                </h1>
                <p className="text-text-secondary">
                  Create a new product with detailed information and images
                </p>
              </div>
              
              <button
                onClick={() => navigate('/product-list')}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg border border-border transition-colors duration-150"
              >
                <Icon name="ArrowLeft" size={16} />
                <span className="hidden sm:inline">{t.backToList}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Form and Images */}
            <div className="xl:col-span-8 space-y-8">
              {/* Product Form */}
              <ProductForm 
                onSubmit={handleProductSubmit}
                isLoading={isLoading}
              />
              
              {/* Image Upload */}
              <ImageUpload 
                onImagesChange={handleImagesChange}
                maxImages={5}
              />
            </div>

            {/* Right Column - Preview */}
            <div className="xl:col-span-4">
              <ProductPreview 
                productData={productData}
                images={productImages}
                primaryImageIndex={primaryImageIndex}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading}
        message={t.savingProduct}
      />
    </div>
  );
};

export default AddProduct;