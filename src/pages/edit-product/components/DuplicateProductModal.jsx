import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DuplicateProductModal = ({ isOpen, onClose, onDuplicate, productData }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [duplicateName, setDuplicateName] = useState('');
  const [duplicateOptions, setDuplicateOptions] = useState({
    includeImages: true,
    includePricing: true,
    includeInventory: false,
    includeDescription: true
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (isOpen && productData) {
      setDuplicateName(`${productData.name} - Copy`);
    }
  }, [isOpen, productData]);

  const translations = {
    en: {
      duplicateProduct: 'Duplicate Product',
      newProductName: 'New Product Name',
      duplicateOptions: 'Duplicate Options',
      includeImages: 'Include Images',
      includePricing: 'Include Pricing',
      includeInventory: 'Include Inventory',
      includeDescription: 'Include Description',
      createDuplicate: 'Create Duplicate',
      cancel: 'Cancel',
      nameRequired: 'Product name is required',
      duplicateNote: 'This will create a new product with the selected information from the current product.'
    },
    es: {
      duplicateProduct: 'Duplicar Producto',
      newProductName: 'Nombre del Nuevo Producto',
      duplicateOptions: 'Opciones de Duplicación',
      includeImages: 'Incluir Imágenes',
      includePricing: 'Incluir Precios',
      includeInventory: 'Incluir Inventario',
      includeDescription: 'Incluir Descripción',
      createDuplicate: 'Crear Duplicado',
      cancel: 'Cancelar',
      nameRequired: 'El nombre del producto es obligatorio',
      duplicateNote: 'Esto creará un nuevo producto con la información seleccionada del producto actual.'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleOptionChange = (option) => {
    setDuplicateOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleDuplicate = () => {
    if (!duplicateName.trim()) {
      return;
    }

    const duplicateData = {
      name: duplicateName,
      options: duplicateOptions
    };

    onDuplicate(duplicateData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-1400 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-elevation-3 max-w-lg w-full mx-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="Copy" size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t.duplicateProduct}
              </h3>
            </div>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.newProductName} *
              </label>
              <Input
                type="text"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Enter new product name"
                className="w-full"
              />
              {!duplicateName.trim() && (
                <p className="text-error text-sm mt-1">{t.nameRequired}</p>
              )}
            </div>
            
            {/* Duplicate Options */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-4">
                {t.duplicateOptions}
              </h4>
              
              <div className="space-y-3">
                {[
                  { key: 'includeImages', label: t.includeImages, icon: 'Image' },
                  { key: 'includePricing', label: t.includePricing, icon: 'DollarSign' },
                  { key: 'includeInventory', label: t.includeInventory, icon: 'Package' },
                  { key: 'includeDescription', label: t.includeDescription, icon: 'FileText' }
                ].map(option => (
                  <label
                    key={option.key}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-surface transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={duplicateOptions[option.key]}
                      onChange={() => handleOptionChange(option.key)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <Icon name={option.icon} size={16} className="text-text-muted" />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Note */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <p className="text-sm text-text-secondary">
                  {t.duplicateNote}
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border">
            <Button
              variant="primary"
              onClick={handleDuplicate}
              disabled={!duplicateName.trim()}
              className="flex-1"
            >
              <Icon name="Copy" size={16} className="mr-2" />
              {t.createDuplicate}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DuplicateProductModal;