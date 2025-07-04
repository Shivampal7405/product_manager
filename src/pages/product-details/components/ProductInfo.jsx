import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const ProductInfo = ({ product }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      description: 'Description',
      specifications: 'Specifications',
      pricing: 'Pricing Information',
      inventory: 'Inventory Status',
      category: 'Category',
      brand: 'Brand',
      sku: 'SKU',
      weight: 'Weight',
      dimensions: 'Dimensions',
      material: 'Material',
      color: 'Color',
      warranty: 'Warranty',
      currentPrice: 'Current Price',
      originalPrice: 'Original Price',
      discount: 'Discount',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      units: 'units available',
      lastUpdated: 'Last Updated'
    },
    es: {
      description: 'Descripción',
      specifications: 'Especificaciones',
      pricing: 'Información de Precios',
      inventory: 'Estado del Inventario',
      category: 'Categoría',
      brand: 'Marca',
      sku: 'SKU',
      weight: 'Peso',
      dimensions: 'Dimensiones',
      material: 'Material',
      color: 'Color',
      warranty: 'Garantía',
      currentPrice: 'Precio Actual',
      originalPrice: 'Precio Original',
      discount: 'Descuento',
      inStock: 'En Stock',
      lowStock: 'Stock Bajo',
      outOfStock: 'Agotado',
      units: 'unidades disponibles',
      lastUpdated: 'Última Actualización'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const getStockStatus = () => {
    if (product.stock === 0) return { label: t.outOfStock, color: 'text-error', bg: 'bg-error-50' };
    if (product.stock < 10) return { label: t.lowStock, color: 'text-warning-600', bg: 'bg-warning-50' };
    return { label: t.inStock, color: 'text-success-600', bg: 'bg-success-50' };
  };

  const stockStatus = getStockStatus();

  const specifications = [
    { label: t.category, value: product.category },
    { label: t.brand, value: "TechCorp" },
    { label: t.sku, value: product.id },
    { label: t.weight, value: "2.5 kg" },
    { label: t.dimensions, value: "30 x 20 x 15 cm" },
    { label: t.material, value: "Premium Aluminum" },
    { label: t.color, value: "Space Gray" },
    { label: t.warranty, value: "2 Years" }
  ];

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
            {stockStatus.label}
          </div>
          <span className="text-text-muted text-sm">
            {product.stock} {t.units}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-3">{t.pricing}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{t.currentPrice}:</span>
            <span className="text-2xl font-bold text-primary">${product.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{t.originalPrice}:</span>
            <span className="text-text-muted line-through">${(product.price * 1.2).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{t.discount}:</span>
            <span className="text-success-600 font-medium">20% OFF</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">{t.description}</h3>
        <p className="text-text-secondary leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">{t.specifications}</h3>
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-4 py-3 ${
                index !== specifications.length - 1 ? 'border-b border-border-light' : ''
              }`}
            >
              <span className="text-text-secondary font-medium">{spec.label}:</span>
              <span className="text-text-primary">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center space-x-2 text-sm text-text-muted">
        <Icon name="Clock" size={16} />
        <span>{t.lastUpdated}: {new Date(product.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ProductInfo;