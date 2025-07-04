import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductActions = ({ product }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      actions: 'Quick Actions',
      editProduct: 'Edit Product',
      duplicate: 'Duplicate',
      delete: 'Delete',
      exportData: 'Export Data',
      shareProduct: 'Share Product',
      generateQR: 'Generate QR Code',
      quickStats: 'Quick Stats',
      totalViews: 'Total Views',
      salesThisMonth: 'Sales This Month',
      stockAlert: 'Stock Alert',
      confirmDelete: 'Confirm Delete',
      deleteWarning: 'Are you sure you want to delete this product? This action cannot be undone.',
      cancel: 'Cancel',
      confirmDeleteBtn: 'Delete Product',
      qrCodeTitle: 'QR Code for Product',
      copyLink: 'Copy Link',
      linkCopied: 'Link copied to clipboard!'
    },
    es: {
      actions: 'Acciones Rápidas',
      editProduct: 'Editar Producto',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
      exportData: 'Exportar Datos',
      shareProduct: 'Compartir Producto',
      generateQR: 'Generar Código QR',
      quickStats: 'Estadísticas Rápidas',
      totalViews: 'Vistas Totales',
      salesThisMonth: 'Ventas Este Mes',
      stockAlert: 'Alerta de Stock',
      confirmDelete: 'Confirmar Eliminación',
      deleteWarning: '¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.',
      cancel: 'Cancelar',
      confirmDeleteBtn: 'Eliminar Producto',
      qrCodeTitle: 'Código QR para Producto',
      copyLink: 'Copiar Enlace',
      linkCopied: '¡Enlace copiado al portapapeles!'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleEdit = () => {
    navigate('/edit-product', { state: { product } });
  };

  const handleDuplicate = () => {
    navigate('/add-product', { state: { duplicateFrom: product } });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Mock delete operation
    console.log('Product deleted:', product.id);
    setShowDeleteConfirm(false);
    navigate('/product-list');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(product, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `product-${product.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCopyLink = () => {
    const productUrl = `${window.location.origin}/product-details?id=${product.id}`;
    navigator.clipboard.writeText(productUrl).then(() => {
      alert(t.linkCopied);
    });
  };

  const mockStats = {
    views: 1247,
    sales: 89,
    stockAlert: product.stock < 10
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t.actions}</h3>
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={handleEdit}
            iconName="Edit"
            iconPosition="left"
            fullWidth
          >
            {t.editProduct}
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleDuplicate}
            iconName="Copy"
            iconPosition="left"
            fullWidth
          >
            {t.duplicate}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            {t.exportData}
          </Button>
          
          <Button
            variant="danger"
            onClick={handleDelete}
            iconName="Trash2"
            iconPosition="left"
            fullWidth
          >
            {t.delete}
          </Button>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t.shareProduct}</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            iconName="Link"
            iconPosition="left"
            fullWidth
          >
            {t.copyLink}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowQRCode(true)}
            iconName="QrCode"
            iconPosition="left"
            fullWidth
          >
            {t.generateQR}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t.quickStats}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-text-muted" />
              <span className="text-text-secondary">{t.totalViews}</span>
            </div>
            <span className="font-semibold text-text-primary">{mockStats.views.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-text-muted" />
              <span className="text-text-secondary">{t.salesThisMonth}</span>
            </div>
            <span className="font-semibold text-success-600">{mockStats.sales}</span>
          </div>
          
          {mockStats.stockAlert && (
            <div className="flex items-center space-x-2 p-3 bg-warning-50 rounded-lg">
              <Icon name="AlertTriangle" size={16} className="text-warning-600" />
              <span className="text-warning-600 text-sm font-medium">{t.stockAlert}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-1100" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-1200 p-4">
            <div className="bg-background rounded-lg shadow-elevation-3 max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error-50 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{t.confirmDelete}</h3>
              </div>
              
              <p className="text-text-secondary mb-6">{t.deleteWarning}</p>
              
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  fullWidth
                >
                  {t.cancel}
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  fullWidth
                >
                  {t.confirmDeleteBtn}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-1100" onClick={() => setShowQRCode(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-1200 p-4">
            <div className="bg-background rounded-lg shadow-elevation-3 max-w-sm w-full p-6 text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-4">{t.qrCodeTitle}</h3>
              
              <div className="bg-surface p-4 rounded-lg mb-4">
                <div className="w-48 h-48 mx-auto bg-white border border-border rounded-lg flex items-center justify-center">
                  <Icon name="QrCode" size={120} className="text-text-muted" />
                </div>
              </div>
              
              <Button
                variant="primary"
                onClick={() => setShowQRCode(false)}
                fullWidth
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductActions;