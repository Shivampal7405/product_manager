import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductForm = ({ onSubmit, isLoading }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      basicInfo: 'Basic Information',
      productName: 'Product Name',
      productNamePlaceholder: 'Enter product name',
      description: 'Description',
      descriptionPlaceholder: 'Enter product description',
      sku: 'SKU',
      skuPlaceholder: 'Enter SKU code',
      category: 'Category',
      categoryPlaceholder: 'Select category',
      brand: 'Brand',
      brandPlaceholder: 'Enter brand name',
      tags: 'Tags',
      tagsPlaceholder: 'Enter tags separated by commas',
      pricingInfo: 'Pricing Information',
      costPrice: 'Cost Price',
      costPricePlaceholder: 'Enter cost price',
      retailPrice: 'Retail Price',
      retailPricePlaceholder: 'Enter retail price',
      salePrice: 'Sale Price',
      salePricePlaceholder: 'Enter sale price (optional)',
      inventoryInfo: 'Inventory Information',
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      lowStockThreshold: 'Low Stock Threshold',
      lowStockPlaceholder: 'Enter threshold',
      moreOptions: 'More Options',
      weight: 'Weight (kg)',
      weightPlaceholder: 'Enter weight',
      dimensions: 'Dimensions (L x W x H)',
      dimensionsPlaceholder: 'Enter dimensions',
      saveAsDraft: 'Save as Draft',
      publishProduct: 'Publish Product',
      required: 'This field is required',
      invalidPrice: 'Please enter a valid price',
      invalidQuantity: 'Please enter a valid quantity'
    },
    es: {
      basicInfo: 'Información Básica',
      productName: 'Nombre del Producto',
      productNamePlaceholder: 'Ingrese el nombre del producto',
      description: 'Descripción',
      descriptionPlaceholder: 'Ingrese la descripción del producto',
      sku: 'SKU',
      skuPlaceholder: 'Ingrese el código SKU',
      category: 'Categoría',
      categoryPlaceholder: 'Seleccione categoría',
      brand: 'Marca',
      brandPlaceholder: 'Ingrese el nombre de la marca',
      tags: 'Etiquetas',
      tagsPlaceholder: 'Ingrese etiquetas separadas por comas',
      pricingInfo: 'Información de Precios',
      costPrice: 'Precio de Costo',
      costPricePlaceholder: 'Ingrese el precio de costo',
      retailPrice: 'Precio de Venta',
      retailPricePlaceholder: 'Ingrese el precio de venta',
      salePrice: 'Precio de Oferta',
      salePricePlaceholder: 'Ingrese el precio de oferta (opcional)',
      inventoryInfo: 'Información de Inventario',
      quantity: 'Cantidad',
      quantityPlaceholder: 'Ingrese la cantidad',
      lowStockThreshold: 'Umbral de Stock Bajo',
      lowStockPlaceholder: 'Ingrese el umbral',
      moreOptions: 'Más Opciones',
      weight: 'Peso (kg)',
      weightPlaceholder: 'Ingrese el peso',
      dimensions: 'Dimensiones (L x A x H)',
      dimensionsPlaceholder: 'Ingrese las dimensiones',
      saveAsDraft: 'Guardar como Borrador',
      publishProduct: 'Publicar Producto',
      required: 'Este campo es obligatorio',
      invalidPrice: 'Por favor ingrese un precio válido',
      invalidQuantity: 'Por favor ingrese una cantidad válida'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.description.trim()) {
      newErrors.description = t.required;
    }

    if (!formData.sku.trim()) {
      newErrors.sku = t.required;
    }

    if (!formData.category) {
      newErrors.category = t.required;
    }

    if (!formData.costPrice || isNaN(parseFloat(formData.costPrice))) {
      newErrors.costPrice = t.invalidPrice;
    }

    if (!formData.retailPrice || isNaN(parseFloat(formData.retailPrice))) {
      newErrors.retailPrice = t.invalidPrice;
    }

    if (!formData.quantity || isNaN(parseInt(formData.quantity))) {
      newErrors.quantity = t.invalidQuantity;
    }

    if (!formData.lowStockThreshold || isNaN(parseInt(formData.lowStockThreshold))) {
      newErrors.lowStockThreshold = t.invalidQuantity;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status) => {
    if (validateForm()) {
      const productData = {
        ...formData,
        status,
        costPrice: parseFloat(formData.costPrice),
        retailPrice: parseFloat(formData.retailPrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        quantity: parseInt(formData.quantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      onSubmit(productData);
    }
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Info" size={20} className="mr-2 text-primary" />
          {t.basicInfo}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.productName} *
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t.productNamePlaceholder}
              className={errors.name ? 'border-error' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.description} *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ${
                errors.description ? 'border-error' : 'border-border'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.sku} *
            </label>
            <Input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder={t.skuPlaceholder}
              className={errors.sku ? 'border-error' : ''}
            />
            {errors.sku && (
              <p className="mt-1 text-sm text-error">{errors.sku}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.category} *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150 ${
                errors.category ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">{t.categoryPlaceholder}</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.brand}
            </label>
            <Input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder={t.brandPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.tags}
            </label>
            <Input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder={t.tagsPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="DollarSign" size={20} className="mr-2 text-primary" />
          {t.pricingInfo}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.costPrice} *
            </label>
            <Input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleInputChange}
              placeholder={t.costPricePlaceholder}
              min="0"
              step="0.01"
              className={errors.costPrice ? 'border-error' : ''}
            />
            {errors.costPrice && (
              <p className="mt-1 text-sm text-error">{errors.costPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.retailPrice} *
            </label>
            <Input
              type="number"
              name="retailPrice"
              value={formData.retailPrice}
              onChange={handleInputChange}
              placeholder={t.retailPricePlaceholder}
              min="0"
              step="0.01"
              className={errors.retailPrice ? 'border-error' : ''}
            />
            {errors.retailPrice && (
              <p className="mt-1 text-sm text-error">{errors.retailPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.salePrice}
            </label>
            <Input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              placeholder={t.salePricePlaceholder}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Inventory Information */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
          <Icon name="Package" size={20} className="mr-2 text-primary" />
          {t.inventoryInfo}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.quantity} *
            </label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder={t.quantityPlaceholder}
              min="0"
              className={errors.quantity ? 'border-error' : ''}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-error">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.lowStockThreshold} *
            </label>
            <Input
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleInputChange}
              placeholder={t.lowStockPlaceholder}
              min="0"
              className={errors.lowStockThreshold ? 'border-error' : ''}
            />
            {errors.lowStockThreshold && (
              <p className="mt-1 text-sm text-error">{errors.lowStockThreshold}</p>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-background border border-border rounded-lg">
        <button
          type="button"
          onClick={toggleAdvanced}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-surface transition-colors duration-150"
        >
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Settings" size={20} className="mr-2 text-primary" />
            {t.moreOptions}
          </h3>
          <Icon 
            name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-text-muted" 
          />
        </button>
        
        {showAdvanced && (
          <div className="px-6 pb-6 border-t border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t.weight}
                </label>
                <Input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder={t.weightPlaceholder}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t.dimensions}
                </label>
                <Input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder={t.dimensionsPlaceholder}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
          iconName="Save"
          iconPosition="left"
        >
          {t.saveAsDraft}
        </Button>
        
        <Button
          variant="primary"
          onClick={() => handleSubmit('published')}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
          iconName="Upload"
          iconPosition="left"
        >
          {t.publishProduct}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;