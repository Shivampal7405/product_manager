import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      dashboard: 'Dashboard',
      products: 'Products',
      productList: 'Product List',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      productDetails: 'Product Details',
      register: 'Register',
      account: 'Account'
    },
    es: {
      dashboard: 'Panel',
      products: 'Productos',
      productList: 'Lista de Productos',
      addProduct: 'Agregar Producto',
      editProduct: 'Editar Producto',
      productDetails: 'Detalles del Producto',
      register: 'Registrar',
      account: 'Cuenta'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const routeMap = {
    '/product-dashboard': { label: t.dashboard, icon: 'LayoutDashboard' },
    '/product-list': { label: t.productList, icon: 'List', parent: '/product-dashboard' },
    '/add-product': { label: t.addProduct, icon: 'Plus', parent: '/product-list' },
    '/edit-product': { label: t.editProduct, icon: 'Edit', parent: '/product-list' },
    '/product-details': { label: t.productDetails, icon: 'Eye', parent: '/product-list' },
    '/register': { label: t.register, icon: 'UserCircle' }
  };

  const generateBreadcrumbs = () => {
    const currentRoute = routeMap[location.pathname];
    if (!currentRoute) return [];

    const breadcrumbs = [];
    let current = currentRoute;
    let currentPath = location.pathname;

    // Build breadcrumb chain
    while (current) {
      breadcrumbs.unshift({
        label: current.label,
        path: currentPath,
        icon: current.icon,
        isActive: currentPath === location.pathname
      });

      if (current.parent) {
        currentPath = current.parent;
        current = routeMap[current.parent];
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 py-4 px-6 bg-surface border-b border-border-light">
      {/* Desktop Breadcrumbs */}
      <div className="hidden md:flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-text-muted" 
              />
            )}
            <button
              onClick={() => handleBreadcrumbClick(crumb.path)}
              disabled={crumb.isActive}
              className={`flex items-center space-x-2 px-2 py-1 rounded-md text-sm transition-colors duration-150 ${
                crumb.isActive
                  ? 'text-text-primary font-medium cursor-default' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <Icon 
                name={crumb.icon} 
                size={16} 
                className={crumb.isActive ? 'text-primary' : 'text-text-muted'} 
              />
              <span>{crumb.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Breadcrumbs */}
      <div className="flex md:hidden items-center space-x-2 w-full">
        {!isExpanded ? (
          <>
            {/* Show only current and parent */}
            {breadcrumbs.length > 1 && (
              <>
                <button
                  onClick={() => handleBreadcrumbClick(breadcrumbs[breadcrumbs.length - 2].path)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-background transition-colors duration-150"
                >
                  <Icon 
                    name={breadcrumbs[breadcrumbs.length - 2].icon} 
                    size={16} 
                    className="text-text-muted" 
                  />
                  <span className="truncate max-w-24">
                    {breadcrumbs[breadcrumbs.length - 2].label}
                  </span>
                </button>
                <Icon name="ChevronRight" size={16} className="text-text-muted" />
              </>
            )}
            
            <div className="flex items-center space-x-2 text-text-primary font-medium">
              <Icon 
                name={breadcrumbs[breadcrumbs.length - 1].icon} 
                size={16} 
                className="text-primary" 
              />
              <span className="truncate">
                {breadcrumbs[breadcrumbs.length - 1].label}
              </span>
            </div>

            {breadcrumbs.length > 2 && (
              <Button
                variant="ghost"
                onClick={toggleExpanded}
                className="ml-auto p-1"
              >
                <Icon name="MoreHorizontal" size={16} />
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Show full breadcrumb path */}
            <div className="flex flex-col space-y-1 w-full">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 w-full">
                    {index > 0 && (
                      <div className="w-4 flex justify-center">
                        <div className="w-px h-4 bg-border" />
                      </div>
                    )}
                    <button
                      onClick={() => handleBreadcrumbClick(crumb.path)}
                      disabled={crumb.isActive}
                      className={`flex items-center space-x-2 px-2 py-1 rounded-md text-sm transition-colors duration-150 ${
                        crumb.isActive
                          ? 'text-text-primary font-medium cursor-default' :'text-text-secondary hover:text-text-primary hover:bg-background'
                      }`}
                    >
                      <Icon 
                        name={crumb.icon} 
                        size={16} 
                        className={crumb.isActive ? 'text-primary' : 'text-text-muted'} 
                      />
                      <span>{crumb.label}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              variant="ghost"
              onClick={toggleExpanded}
              className="ml-auto p-1 self-start"
            >
              <Icon name="X" size={16} />
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Breadcrumb;