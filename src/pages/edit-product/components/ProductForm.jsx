import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductForm = ({ productData, onSave, onCancel, isLoading }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    quantity: '',
    lowStockThreshold: '',
    category: '',
    brand: '',
    tags: '',
    weight: '',
    dimensions: '',
    status: 'active'
  });
  const [changedFields, setChangedFields] = useState(new Set());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || '',
        comparePrice: productData.comparePrice || '',
        costPrice: productData.costPrice || '',
        sku: productData.sku || '',
        barcode: productData.barcode || '',
        quantity: productData.quantity || '',
        lowStockThreshold: productData.lowStockThreshold || '',
        category: productData.category || '',
        brand: productData.brand || '',
        tags: productData.tags || '',
        weight: productData.weight || '',
        dimensions: productData.dimensions || '',
        status: productData.status || 'active'
      });
    }
  }, [productData]);

  const translations = {
    en: {
      basicDetails: 'Basic Details',
      productName: 'Product Name',
      description: 'Description',
      pricing: 'Pricing',
      price: 'Price',
      comparePrice: 'Compare at Price',
      costPrice: 'Cost per Item',
      inventory: 'Inventory',
      sku: 'SKU',
      barcode: 'Barcode',
      quantity: 'Quantity',
      lowStockThreshold: 'Low Stock Threshold',
      organization: 'Organization',
      category: 'Category',
      brand: 'Brand',
      tags: 'Tags',
      shipping: 'Shipping',
      weight: 'Weight',
      dimensions: 'Dimensions',
      status: 'Status',
      active: 'Active',
      draft: 'Draft',
      archived: 'Archived',
      saveChanges: 'Save Changes',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
      required: 'This field is required',
      invalidPrice: 'Please enter a valid price',
      invalidQuantity: 'Please enter a valid quantity'
    },
    es: {
      basicDetails: 'Detalles Básicos',
      productName: 'Nombre del Producto',
      description: 'Descripción',
      pricing: 'Precios',
      price: 'Precio',
      comparePrice: 'Comparar Precio',
      costPrice: 'Costo por Artículo',
      inventory: 'Inventario',
      sku: 'SKU',
      barcode: 'Código de Barras',
      quantity: 'Cantidad',
      lowStockThreshold: 'Umbral de Stock Bajo',
      organization: 'Organización',
      category: 'Categoría',
      brand: 'Marca',
      tags: 'Etiquetas',
      shipping: 'Envío',
      weight: 'Peso',
      dimensions: 'Dimensiones',
      status: 'Estado',
      active: 'Activo',
      draft: 'Borrador',
      archived: 'Archivado',
      saveChanges: 'Guardar Cambios',
      saveAsDraft: 'Guardar como Borrador',
      cancel: 'Cancelar',
      required: 'Este campo es obligatorio',
      invalidPrice: 'Por favor ingrese un precio válido',
      invalidQuantity: 'Por favor ingrese una cantidad válida'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Track changed fields
    if (productData && productData[field] !== value) {
      setChangedFields(prev => new Set([...prev, field]));
    } else {
      setChangedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      newErrors.price = t.invalidPrice;
    }

    if (!formData.quantity || isNaN(parseInt(formData.quantity))) {
      newErrors.quantity = t.invalidQuantity;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    const updatedData = {
      ...formData,
      status: isDraft ? 'draft' : formData.status
    };

    onSave(updatedData, changedFields);
  };

  const categories = [
    "Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"
  ];

  const brands = [
    "Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Canon", "Dell"
  ];

  return (
    <div className="space-y-8">
      {/* Basic Details */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Info" size={20} className="mr-2 text-primary" />
          {t.basicDetails}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.productName} *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              className={`${changedFields.has('name') ? 'ring-2 ring-accent-500' : ''} ${errors.name ? 'border-error' : ''}`}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.description}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className={`w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${changedFields.has('description') ? 'ring-2 ring-accent-500' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="DollarSign" size={20} className="mr-2 text-primary" />
          {t.pricing}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.price} *
            </label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`${changedFields.has('price') ? 'ring-2 ring-accent-500' : ''} ${errors.price ? 'border-error' : ''}`}
            />
            {errors.price && (
              <p className="text-error text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.comparePrice}
            </label>
            <Input
              type="number"
              value={formData.comparePrice}
              onChange={(e) => handleInputChange('comparePrice', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={changedFields.has('comparePrice') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.costPrice}
            </label>
            <Input
              type="number"
              value={formData.costPrice}
              onChange={(e) => handleInputChange('costPrice', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={changedFields.has('costPrice') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Package" size={20} className="mr-2 text-primary" />
          {t.inventory}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.sku}
            </label>
            <Input
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              placeholder="SKU-001"
              className={changedFields.has('sku') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.barcode}
            </label>
            <Input
              type="text"
              value={formData.barcode}
              onChange={(e) => handleInputChange('barcode', e.target.value)}
              placeholder="123456789"
              className={changedFields.has('barcode') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.quantity} *
            </label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="0"
              min="0"
              className={`${changedFields.has('quantity') ? 'ring-2 ring-accent-500' : ''} ${errors.quantity ? 'border-error' : ''}`}
            />
            {errors.quantity && (
              <p className="text-error text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.lowStockThreshold}
            </label>
            <Input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
              placeholder="5"
              min="0"
              className={changedFields.has('lowStockThreshold') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Tag" size={20} className="mr-2 text-primary" />
          {t.organization}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.category}
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${changedFields.has('category') ? 'ring-2 ring-accent-500' : ''}`}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.brand}
            </label>
            <select
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className={`w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${changedFields.has('brand') ? 'ring-2 ring-accent-500' : ''}`}
            >
              <option value="">Select brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.tags}
            </label>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="tag1, tag2, tag3"
              className={changedFields.has('tags') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Truck" size={20} className="mr-2 text-primary" />
          {t.shipping}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.weight} (kg)
            </label>
            <Input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="0.0"
              min="0"
              step="0.1"
              className={changedFields.has('weight') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.dimensions} (L x W x H cm)
            </label>
            <Input
              type="text"
              value={formData.dimensions}
              onChange={(e) => handleInputChange('dimensions', e.target.value)}
              placeholder="10 x 5 x 2"
              className={changedFields.has('dimensions') ? 'ring-2 ring-accent-500' : ''}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Settings" size={20} className="mr-2 text-primary" />
          {t.status}
        </h3>
        
        <div className="space-y-3">
          {['active', 'draft', 'archived'].map(status => (
            <label key={status} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-text-primary capitalize">
                {t[status]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
        <Button
          variant="primary"
          onClick={() => handleSave(false)}
          disabled={isLoading}
          loading={isLoading}
          className="flex-1 sm:flex-none"
        >
          {t.saveChanges}
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => handleSave(true)}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {t.saveAsDraft}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {t.cancel}
        </Button>
      </div>

      {/* Changed Fields Indicator */}
      {changedFields.size > 0 && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-accent-600" />
            <span className="text-sm text-accent-700">
              {changedFields.size} field{changedFields.size > 1 ? 's' : ''} modified
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;