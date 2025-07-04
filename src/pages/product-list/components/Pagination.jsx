import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      showing: 'Showing',
      to: 'to',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      itemsPerPage: 'Items per page'
    },
    es: {
      showing: 'Mostrando',
      to: 'a',
      of: 'de',
      results: 'resultados',
      previous: 'Anterior',
      next: 'Siguiente',
      page: 'Página',
      itemsPerPage: 'Elementos por página'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const itemsPerPageOptions = [10, 25, 50, 100];

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-background border-t border-border px-4 py-3 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Results Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-text-secondary">
            {t.showing} <span className="font-medium text-text-primary">{startItem}</span> {t.to} <span className="font-medium text-text-primary">{endItem}</span> {t.of} <span className="font-medium text-text-primary">{totalItems}</span> {t.results}
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-text-secondary">{t.itemsPerPage}:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-border rounded px-2 py-1 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2"
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            <span className="hidden sm:inline">{t.previous}</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-text-muted">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'primary' : 'ghost'}
                    onClick={() => onPageChange(page)}
                    className="w-10 h-10 p-0 text-sm"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2"
          >
            <span className="hidden sm:inline">{t.next}</span>
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Mobile Page Info */}
      <div className="sm:hidden mt-3 text-center">
        <span className="text-sm text-text-secondary">
          {t.page} {currentPage} {t.of} {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;