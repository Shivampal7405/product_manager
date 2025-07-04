import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { LoadingSpinner, PageLoading } from '../../components/ui/LoadingStates';
import ProductForm from './components/ProductForm';
import ProductImages from './components/ProductImages';
import ChangeHistory from './components/ChangeHistory';
import UnsavedChangesModal from './components/UnsavedChangesModal';
import DuplicateProductModal from './components/DuplicateProductModal';

const EditProduct = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productData, setProductData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedFields, setChangedFields] = useState(new Set());
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') || '1';

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const translations = {
    en: {
      editProduct: 'Edit Product',
      loading: 'Loading product...',
      saving: 'Saving changes...',
      productNotFound: 'Product not found',
      saveChanges: 'Save Changes',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
      duplicate: 'Duplicate',
      delete: 'Delete',
      productSaved: 'Product saved successfully',
      productDeleted: 'Product deleted successfully',
      errorSaving: 'Error saving product',
      errorLoading: 'Error loading product',
      confirmDelete: 'Are you sure you want to delete this product?',
      deleteWarning: 'This action cannot be undone.',
      unsavedChanges: 'You have unsaved changes',
      productDuplicated: 'Product duplicated successfully'
    },
    es: {
      editProduct: 'Editar Producto',
      loading: 'Cargando producto...',
      saving: 'Guardando cambios...',
      productNotFound: 'Producto no encontrado',
      saveChanges: 'Guardar Cambios',
      saveAsDraft: 'Guardar como Borrador',
      cancel: 'Cancelar',
      duplicate: 'Duplicar',
      delete: 'Eliminar',
      productSaved: 'Producto guardado exitosamente',
      productDeleted: 'Producto eliminado exitosamente',
      errorSaving: 'Error al guardar producto',
      errorLoading: 'Error al cargar producto',
      confirmDelete: '¿Estás seguro de que quieres eliminar este producto?',
      deleteWarning: 'Esta acción no se puede deshacer.',
      unsavedChanges: 'Tienes cambios no guardados',
      productDuplicated: 'Producto duplicado exitosamente'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  // Mock product data
  const loadProductData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProduct = {
        id: productId,
        name: "Premium Wireless Headphones",
        description: `Experience superior sound quality with our premium wireless headphones.\n\nFeatures:\n• Active noise cancellation\n• 30-hour battery life\n• Premium leather comfort\n• Hi-Res audio support\n• Quick charge technology`,
        price: "179.99",
        comparePrice: "229.99",
        costPrice: "89.50",
        sku: "PWH-001",
        barcode: "1234567890123",
        quantity: "32",
        lowStockThreshold: "5",
        category: "Electronics",
        brand: "Sony",
        tags: "wireless, headphones, premium, noise-cancelling",
        weight: "0.3",
        dimensions: "20 x 18 x 8",
        status: "active",
        images: [
          {
            id: 1,
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            alt: "Premium wireless headphones main view",
            isPrimary: true
          },
          {
            id: 2,
            url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
            alt: "Headphones side view",
            isPrimary: false
          },
          {
            id: 3,
            url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
            alt: "Headphones detail view",
            isPrimary: false
          }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      };
      
      setProductData(mockProduct);
    } catch (error) {
      showNotification(t.errorLoading, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (formData, changedFieldsSet) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProductData(prev => ({ ...prev, ...formData }));
      setHasUnsavedChanges(false);
      setChangedFields(new Set());
      
      showNotification(t.productSaved, 'success');
    } catch (error) {
      showNotification(t.errorSaving, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation('/product-list');
      setShowUnsavedModal(true);
    } else {
      navigate('/product-list');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`${t.confirmDelete}\n\n${t.deleteWarning}`)) {
      setIsSaving(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showNotification(t.productDeleted, 'success');
        setTimeout(() => navigate('/product-list'), 1000);
      } catch (error) {
        showNotification(t.errorSaving, 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDuplicate = async (duplicateData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification(t.productDuplicated, 'success');
      setShowDuplicateModal(false);
      
      // Navigate to the new duplicated product (mock ID)
      setTimeout(() => navigate(`/edit-product?id=${Date.now()}`), 1000);
    } catch (error) {
      showNotification(t.errorSaving, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImagesChange = (images) => {
    setProductData(prev => ({ ...prev, images }));
    setHasUnsavedChanges(true);
  };

  const handleUnsavedModalSave = () => {
    setShowUnsavedModal(false);
    // Trigger save and then navigate
    handleSave(productData, changedFields).then(() => {
      if (pendingNavigation) {
        navigate(pendingNavigation);
      }
    });
  };

  const handleUnsavedModalDiscard = () => {
    setShowUnsavedModal(false);
    setHasUnsavedChanges(false);
    setChangedFields(new Set());
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  // Track form changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = t.unsavedChanges;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, t.unsavedChanges]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <PageLoading message={t.loading} />
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Icon name="Package" size={48} className="text-text-muted mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                {t.productNotFound}
              </h2>
              <Button variant="primary" onClick={() => navigate('/product-list')}>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar />
      
      <div className="md:ml-60 pt-16">
        <Breadcrumb />
        
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {t.editProduct}
              </h1>
              <p className="text-text-secondary">
                {productData.name}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDuplicateModal(true)}
                disabled={isSaving}
              >
                <Icon name="Copy" size={16} className="mr-2" />
                {t.duplicate}
              </Button>
              
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isSaving}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                {t.delete}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Form */}
            <div className="xl:col-span-8 space-y-8">
              <ProductForm
                productData={productData}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isSaving}
              />
            </div>

            {/* Right Column - Images & History */}
            <div className="xl:col-span-4 space-y-8">
              <ProductImages
                productData={productData}
                onImagesChange={handleImagesChange}
              />
              
              <ChangeHistory productId={productId} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onSave={handleUnsavedModalSave}
        onDiscard={handleUnsavedModalDiscard}
        changedFields={changedFields}
      />

      <DuplicateProductModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onDuplicate={handleDuplicate}
        productData={productData}
      />

      {/* Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1300">
          <div className="bg-background rounded-lg p-6 shadow-elevation-3 flex items-center space-x-4 min-w-48">
            <LoadingSpinner size={24} />
            <span className="text-text-primary font-medium">{t.saving}</span>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-1200 animate-fade-in">
          <div className={`rounded-lg p-4 shadow-elevation-3 flex items-center space-x-3 ${
            notification.type === 'success' ?'bg-success-50 border border-success-200' :'bg-error-50 border border-error-200'
          }`}>
            <Icon 
              name={notification.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
              size={20} 
              className={notification.type === 'success' ? 'text-success-600' : 'text-error'} 
            />
            <span className={`font-medium ${
              notification.type === 'success' ? 'text-success-700' : 'text-error'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;