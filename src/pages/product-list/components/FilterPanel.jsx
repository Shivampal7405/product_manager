import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const translations = {
    en: {
      filters: 'Filters',
      category: 'Category',
      priceRange: 'Price Range',
      stockStatus: 'Stock Status',
      brand: 'Brand',
      dateCreated: 'Date Created',
      clearAll: 'Clear All',
      apply: 'Apply',
      allCategories: 'All Categories',
      electronics: 'Electronics',
      clothing: 'Clothing',
      books: 'Books',
      home: 'Home & Garden',
      sports: 'Sports',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
      allBrands: 'All Brands',
      from: 'From',
      to: 'To',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      customRange: 'Custom Range'
    },
    es: {
      filters: 'Filtros',
      category: 'Categoría',
      priceRange: 'Rango de Precio',
      stockStatus: 'Estado de Stock',
      brand: 'Marca',
      dateCreated: 'Fecha de Creación',
      clearAll: 'Limpiar Todo',
      apply: 'Aplicar',
      allCategories: 'Todas las Categorías',
      electronics: 'Electrónicos',
      clothing: 'Ropa',
      books: 'Libros',
      home: 'Hogar y Jardín',
      sports: 'Deportes',
      inStock: 'En Stock',
      outOfStock: 'Sin Stock',
      lowStock: 'Stock Bajo',
      allBrands: 'Todas las Marcas',
      from: 'Desde',
      to: 'Hasta',
      last7Days: 'Últimos 7 Días',
      last30Days: 'Últimos 30 Días',
      last90Days: 'Últimos 90 Días',
      customRange: 'Rango Personalizado'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const categories = [
    { value: '', label: t.allCategories },
    { value: 'electronics', label: t.electronics },
    { value: 'clothing', label: t.clothing },
    { value: 'books', label: t.books },
    { value: 'home', label: t.home },
    { value: 'sports', label: t.sports }
  ];

  const stockStatuses = [
    { value: '', label: 'All' },
    { value: 'in-stock', label: t.inStock },
    { value: 'out-of-stock', label: t.outOfStock },
    { value: 'low-stock', label: t.lowStock }
  ];

  const brands = [
    { value: '', label: t.allBrands },
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'nike', label: 'Nike' },
    { value: 'adidas', label: 'Adidas' },
    { value: 'sony', label: 'Sony' }
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: '7', label: t.last7Days },
    { value: '30', label: t.last30Days },
    { value: '90', label: t.last90Days },
    { value: 'custom', label: t.customRange }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      category: '',
      priceMin: '',
      priceMax: '',
      stockStatus: '',
      brand: '',
      dateRange: '',
      customDateFrom: '',
      customDateTo: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div className="border-b border-border-light pb-4 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-text-muted" 
          />
        </button>
        {isOpen && <div className="space-y-3">{children}</div>}
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-surface border-r border-border p-2">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full p-2"
        >
          <Icon name="Filter" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">{t.filters}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="text"
            onClick={handleClearAll}
            className="text-sm text-text-muted hover:text-text-primary"
          >
            {t.clearAll}
          </Button>
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            className="p-1"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <FilterSection title={t.category}>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={localFilters.category === category.value}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-text-primary">{category.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title={t.priceRange}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-text-muted mb-1">{t.from}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={localFilters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">{t.to}</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={localFilters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Stock Status Filter */}
        <FilterSection title={t.stockStatus}>
          <div className="space-y-2">
            {stockStatuses.map((status) => (
              <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="stockStatus"
                  value={status.value}
                  checked={localFilters.stockStatus === status.value}
                  onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-text-primary">{status.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title={t.brand}>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value={brand.value}
                  checked={localFilters.brand === brand.value}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-text-primary">{brand.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Date Created Filter */}
        <FilterSection title={t.dateCreated}>
          <div className="space-y-3">
            <div className="space-y-2">
              {dateRanges.map((range) => (
                <label key={range.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    value={range.value}
                    checked={localFilters.dateRange === range.value}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-text-primary">{range.label}</span>
                </label>
              ))}
            </div>
            
            {localFilters.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">{t.from}</label>
                  <Input
                    type="date"
                    value={localFilters.customDateFrom}
                    onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">{t.to}</label>
                  <Input
                    type="date"
                    value={localFilters.customDateTo}
                    onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterPanel;