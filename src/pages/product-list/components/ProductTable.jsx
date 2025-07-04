import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  onSelectAll, 
  onSort, 
  sortConfig, 
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
      selectAll: 'Select All',
      image: 'Image',
      name: 'Name',
      sku: 'SKU',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      lastModified: 'Last Modified',
      actions: 'Actions',
      edit: 'Edit',
      duplicate: 'Duplicate',
      delete: 'Delete',
      view: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
      noProducts: 'No products found',
      noProductsDesc: 'Try adjusting your filters or search criteria'
    },
    es: {
      selectAll: 'Seleccionar Todo',
      image: 'Imagen',
      name: 'Nombre',
      sku: 'SKU',
      category: 'Categoría',
      price: 'Precio',
      stock: 'Stock',
      status: 'Estado',
      lastModified: 'Última Modificación',
      actions: 'Acciones',
      edit: 'Editar',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
      view: 'Ver Detalles',
      inStock: 'En Stock',
      outOfStock: 'Sin Stock',
      lowStock: 'Stock Bajo',
      noProducts: 'No se encontraron productos',
      noProductsDesc: 'Intenta ajustar tus filtros o criterios de búsqueda'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) {
      return <Icon name="ArrowUpDown" size={16} className="text-text-muted" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-primary" />
      : <Icon name="ArrowDown" size={16} className="text-primary" />;
  };

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
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.image}
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.name}</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.sku}</span>
                  {getSortIcon('sku')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.category}</span>
                  {getSortIcon('category')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.price}</span>
                  {getSortIcon('price')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.stock}</span>
                  {getSortIcon('stock')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.status}
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('lastModified')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>{t.lastModified}</span>
                  {getSortIcon('lastModified')}
                </button>
              </th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border-light">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-surface transition-colors duration-150">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onProductSelect(product.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <button
                      onClick={() => onViewDetails(product.id)}
                      className="text-sm font-medium text-text-primary hover:text-primary text-left"
                    >
                      {product.name}
                    </button>
                    <p className="text-xs text-text-muted mt-1 truncate max-w-48">
                      {product.description}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary font-mono">{product.sku}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary capitalize">{product.category}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-text-primary">
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{product.stock}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(product.status, product.stock)}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-text-secondary">
                    {formatDate(product.lastModified)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetails(product.id)}
                      className="p-1"
                      title={t.view}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(product.id)}
                      className="p-1"
                      title={t.edit}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;