import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductPreview = ({ productData, images, primaryImageIndex = 0 }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      preview: 'Preview',
      productPreview: 'Product Preview',
      noImageAvailable: 'No image available',
      price: 'Price',
      salePrice: 'Sale Price',
      sku: 'SKU',
      category: 'Category',
      brand: 'Brand',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      weight: 'Weight',
      dimensions: 'Dimensions',
      tags: 'Tags',
      status: 'Status',
      draft: 'Draft',
      published: 'Published',
      kg: 'kg'
    },
    es: {
      preview: 'Vista Previa',
      productPreview: 'Vista Previa del Producto',
      noImageAvailable: 'No hay imagen disponible',
      price: 'Precio',
      salePrice: 'Precio de Oferta',
      sku: 'SKU',
      category: 'Categoría',
      brand: 'Marca',
      inStock: 'En Stock',
      lowStock: 'Stock Bajo',
      outOfStock: 'Sin Stock',
      quantity: 'Cantidad',
      weight: 'Peso',
      dimensions: 'Dimensiones',
      tags: 'Etiquetas',
      status: 'Estado',
      draft: 'Borrador',
      published: 'Publicado',
      kg: 'kg'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const getStockStatus = () => {
    const quantity = parseInt(productData.quantity) || 0;
    const threshold = parseInt(productData.lowStockThreshold) || 0;
    
    if (quantity === 0) {
      return { status: t.outOfStock, color: 'text-error', bgColor: 'bg-error-50' };
    } else if (quantity <= threshold) {
      return { status: t.lowStock, color: 'text-warning-600', bgColor: 'bg-warning-50' };
    } else {
      return { status: t.inStock, color: 'text-success-600', bgColor: 'bg-success-50' };
    }
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const stockStatus = getStockStatus();
  const primaryImage = images && images[primaryImageIndex];

  return (
    <div className="bg-background border border-border rounded-lg p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="Eye" size={20} className="mr-2 text-primary" />
        {t.productPreview}
      </h3>

      <div className="space-y-6">
        {/* Product Image */}
        <div className="aspect-square bg-surface rounded-lg overflow-hidden border border-border-light">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={productData.name || 'Product preview'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Icon name="Image" size={48} className="text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">{t.noImageAvailable}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <h4 className="text-xl font-semibold text-text-primary">
              {productData.name || 'Product Name'}
            </h4>
            {productData.brand && (
              <p className="text-sm text-text-muted mt-1">
                {t.brand}: {productData.brand}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              productData.status === 'published' ?'bg-success-50 text-success-600' :'bg-secondary-100 text-secondary-600'
            }`}>
              <Icon 
                name={productData.status === 'published' ? 'CheckCircle' : 'Clock'} 
                size={12} 
                className="mr-1" 
              />
              {productData.status === 'published' ? t.published : t.draft}
            </span>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
              <Icon name="Package" size={12} className="mr-1" />
              {stockStatus.status}
            </span>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{t.price}:</span>
              <span className="font-semibold text-text-primary">
                {formatPrice(productData.retailPrice)}
              </span>
            </div>
            
            {productData.salePrice && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.salePrice}:</span>
                <span className="font-semibold text-success-600">
                  {formatPrice(productData.salePrice)}
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3 pt-4 border-t border-border-light">
            {productData.sku && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.sku}:</span>
                <span className="text-sm text-text-primary font-mono">
                  {productData.sku}
                </span>
              </div>
            )}
            
            {productData.category && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.category}:</span>
                <span className="text-sm text-text-primary capitalize">
                  {productData.category.replace('-', ' ')}
                </span>
              </div>
            )}
            
            {productData.quantity && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.quantity}:</span>
                <span className="text-sm text-text-primary">
                  {productData.quantity}
                </span>
              </div>
            )}
            
            {productData.weight && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.weight}:</span>
                <span className="text-sm text-text-primary">
                  {productData.weight} {t.kg}
                </span>
              </div>
            )}
            
            {productData.dimensions && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{t.dimensions}:</span>
                <span className="text-sm text-text-primary">
                  {productData.dimensions}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {productData.description && (
            <div className="pt-4 border-t border-border-light">
              <p className="text-sm text-text-secondary leading-relaxed">
                {productData.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {productData.tags && (
            <div className="pt-4 border-t border-border-light">
              <p className="text-sm text-text-muted mb-2">{t.tags}:</p>
              <div className="flex flex-wrap gap-2">
                {productData.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-50 text-primary-600"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;