import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductToolbar = ({ 
  selectedProducts, 
  onBulkAction, 
  viewMode, 
  onViewModeChange, 
  searchQuery, 
  onSearchChange,
  totalProducts,
  filteredProducts 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      addProduct: 'Add Product',
      bulkActions: 'Bulk Actions',
      delete: 'Delete Selected',
      export: 'Export Selected',
      updateStatus: 'Update Status',
      activate: 'Activate',
      deactivate: 'Deactivate',
      searchProducts: 'Search products...',
      tableView: 'Table View',
      gridView: 'Grid View',
      exportAll: 'Export All',
      exportFiltered: 'Export Filtered',
      exportCSV: 'Export as CSV',
      exportJSON: 'Export as JSON',
      exportPDF: 'Export as PDF',
      showing: 'Showing',
      of: 'of',
      products: 'products',
      selected: 'selected'
    },
    es: {
      addProduct: 'Agregar Producto',
      bulkActions: 'Acciones Masivas',
      delete: 'Eliminar Seleccionados',
      export: 'Exportar Seleccionados',
      updateStatus: 'Actualizar Estado',
      activate: 'Activar',
      deactivate: 'Desactivar',
      searchProducts: 'Buscar productos...',
      tableView: 'Vista de Tabla',
      gridView: 'Vista de Cuadrícula',
      exportAll: 'Exportar Todo',
      exportFiltered: 'Exportar Filtrados',
      exportCSV: 'Exportar como CSV',
      exportJSON: 'Exportar como JSON',
      exportPDF: 'Exportar como PDF',
      showing: 'Mostrando',
      of: 'de',
      products: 'productos',
      selected: 'seleccionados'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleBulkAction = (action) => {
    onBulkAction(action, selectedProducts);
    setBulkMenuOpen(false);
  };

  const handleExport = (format, scope = 'selected') => {
    onBulkAction('export', selectedProducts, { format, scope });
    setExportMenuOpen(false);
  };

  const bulkActions = [
    {
      label: t.delete,
      action: 'delete',
      icon: 'Trash2',
      className: 'text-error hover:bg-error-50'
    },
    {
      label: t.activate,
      action: 'activate',
      icon: 'CheckCircle',
      className: 'text-success hover:bg-success-50'
    },
    {
      label: t.deactivate,
      action: 'deactivate',
      icon: 'XCircle',
      className: 'text-warning hover:bg-warning-50'
    }
  ];

  const exportOptions = [
    { label: t.exportCSV, format: 'csv', icon: 'FileText' },
    { label: t.exportJSON, format: 'json', icon: 'Code' },
    { label: t.exportPDF, format: 'pdf', icon: 'FileDown' }
  ];

  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Search and Results Count */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          
          <div className="text-sm text-text-secondary">
            {t.showing} <span className="font-medium text-text-primary">{filteredProducts}</span> {t.of} <span className="font-medium text-text-primary">{totalProducts}</span> {t.products}
            {selectedProducts.length > 0 && (
              <span className="ml-2">
                (<span className="font-medium text-primary">{selectedProducts.length}</span> {t.selected})
              </span>
            )}
          </div>
        </div>

        {/* Right Section - Actions and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
                iconName="ChevronDown"
                iconPosition="right"
              >
                {t.bulkActions} ({selectedProducts.length})
              </Button>
              
              {bulkMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-1100" 
                    onClick={() => setBulkMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-elevation-3 z-1200">
                    <div className="py-2">
                      {bulkActions.map((action) => (
                        <button
                          key={action.action}
                          onClick={() => handleBulkAction(action.action)}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-150 ${action.className}`}
                        >
                          <Icon name={action.icon} size={16} className="mr-3" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Export Menu */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              iconName="Download"
              iconPosition="left"
            >
              {t.export}
            </Button>
            
            {exportMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-1100" 
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-elevation-3 z-1200">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                      {selectedProducts.length > 0 ? t.exportSelected : t.exportAll}
                    </div>
                    {exportOptions.map((option) => (
                      <button
                        key={option.format}
                        onClick={() => handleExport(option.format, selectedProducts.length > 0 ? 'selected' : 'all')}
                        className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors duration-150"
                      >
                        <Icon name={option.icon} size={16} className="mr-3" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              onClick={() => onViewModeChange('table')}
              className="p-2"
              title={t.tableView}
            >
              <Icon name="Table" size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className="p-2"
              title={t.gridView}
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
          </div>

          {/* Add Product Button */}
          <Button
            variant="primary"
            onClick={handleAddProduct}
            iconName="Plus"
            iconPosition="left"
          >
            {t.addProduct}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;