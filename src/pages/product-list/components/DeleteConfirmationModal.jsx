import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productCount = 1, 
  productNames = [] 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      deleteProduct: 'Delete Product',
      deleteProducts: 'Delete Products',
      confirmDelete: 'Are you sure you want to delete this product?',
      confirmDeleteMultiple: 'Are you sure you want to delete these products?',
      thisAction: 'This action cannot be undone.',
      willDelete: 'This will permanently delete',
      product: 'product',
      products: 'products',
      andRemove: 'and remove all associated data.',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...'
    },
    es: {
      deleteProduct: 'Eliminar Producto',
      deleteProducts: 'Eliminar Productos',
      confirmDelete: '¿Estás seguro de que quieres eliminar este producto?',
      confirmDeleteMultiple: '¿Estás seguro de que quieres eliminar estos productos?',
      thisAction: 'Esta acción no se puede deshacer.',
      willDelete: 'Esto eliminará permanentemente',
      product: 'producto',
      products: 'productos',
      andRemove: 'y eliminará todos los datos asociados.',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      deleting: 'Eliminando...'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isMultiple = productCount > 1;
  const displayNames = productNames.slice(0, 3);
  const remainingCount = productCount - displayNames.length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-1400 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-elevation-3 max-w-md w-full mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                <Icon name="Trash2" size={20} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {isMultiple ? t.deleteProducts : t.deleteProduct}
              </h3>
            </div>
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isDeleting}
              className="p-1"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-text-primary mb-4">
              {isMultiple ? t.confirmDeleteMultiple : t.confirmDelete}
            </p>
            
            {/* Product Names */}
            {displayNames.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-4 mb-4">
                <div className="space-y-2">
                  {displayNames.map((name, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Package" size={16} className="text-text-muted" />
                      <span className="text-sm text-text-primary">{name}</span>
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div className="flex items-center space-x-2">
                      <Icon name="MoreHorizontal" size={16} className="text-text-muted" />
                      <span className="text-sm text-text-muted">
                        and {remainingCount} more {remainingCount === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                <div>
                  <p className="text-sm text-error font-medium mb-1">
                    {t.thisAction}
                  </p>
                  <p className="text-sm text-error">
                    {t.willDelete} {productCount} {productCount === 1 ? t.product : t.products} {t.andRemove}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              {t.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={isDeleting}
              loading={isDeleting}
            >
              {isDeleting ? t.deleting : t.delete}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;