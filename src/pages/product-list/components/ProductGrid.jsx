import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductGrid = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onViewDetails 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      edit: 'Edit',
      duplicate: 'Duplicate',
      delete: 'Delete',
      view: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
      noProducts: 'No products found',
      noProductsDesc: 'Try adjusting your filters or search criteria',
      stock: 'Stock',
      lastModified: 'Last Modified'
    },
    es: {
      edit: 'Editar',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
      view: 'Ver Detalles',
      inStock: 'En Stock',
      outOfStock: 'Sin Stock',
      lowStock: 'Stock Bajo',
      noProducts: 'No se encontraron productos',
      noProductsDesc: 'Intenta ajustar tus filtros o criterios de búsqueda',
      stock: 'Stock',
      lastModified: 'Última Modificación'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const getStatusBadge = (status, stock) => {
    let statusText = '';
    let statusClass = '';

    if (status === 'active') {
      if (stock > 10) {
        statusText = t.inStock;
        statusClass = 'bg-success-100 text-success-600';
      } else if (stock > 0) {
        statusText = t.lowStock;
        statusClass = 'bg-warning-100 text-warning-600';
      } else {
        statusText = t.outOfStock;
        statusClass = 'bg-error-100 text-error-600';
      }
    } else {
      statusText = 'Inactive';
      statusClass = 'bg-secondary-100 text-secondary-600';
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={32} className="text-secondary-500" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">{t.noProducts}</h3>
          <p className="text-text-secondary">{t.noProductsDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-background border border-border rounded-lg overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-shadow duration-150"
        >
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 bg-surface">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => onProductSelect(product.id)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 bg-background"
              />
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex space-x-1">
              <Button
                variant="ghost"
                onClick={() => onViewDetails(product.id)}
                className="p-1 bg-background bg-opacity-90 hover:bg-opacity-100"
                title={t.view}
              >
                <Icon name="Eye" size={16} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => onEdit(product.id)}
                className="p-1 bg-background bg-opacity-90 hover:bg-opacity-100"
                title={t.edit}
              >
                <Icon name="Edit" size={16} />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <button
                onClick={() => onViewDetails(product.id)}
                className="text-left flex-1 mr-2"
              >
                <h3 className="text-sm font-semibold text-text-primary hover:text-primary line-clamp-2">
                  {product.name}
                </h3>
              </button>
              {getStatusBadge(product.status, product.stock)}
            </div>

            <p className="text-xs text-text-muted mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">SKU:</span>
                <span className="text-xs font-mono text-text-primary">{product.sku}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Category:</span>
                <span className="text-xs text-text-primary capitalize">{product.category}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{t.stock}:</span>
                <span className="text-xs text-text-primary">{product.stock}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">{t.lastModified}:</span>
                <span className="text-xs text-text-primary">{formatDate(product.lastModified)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text-primary">
                {formatPrice(product.price)}
              </span>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  onClick={() => onDuplicate(product.id)}
                  className="p-1"
                  title={t.duplicate}
                >
                  <Icon name="Copy" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(product.id)}
                  className="p-1 text-error hover:text-error hover:bg-error-50"
                  title={t.delete}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;