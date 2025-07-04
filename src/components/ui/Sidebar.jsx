import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const translations = {
    en: {
      dashboard: 'Dashboard',
      products: 'Products',
      productList: 'Product List',
      addProduct: 'Add Product',
      account: 'Account',
      register: 'Register'
    },
    es: {
      dashboard: 'Panel',
      products: 'Productos',
      productList: 'Lista de Productos',
      addProduct: 'Agregar Producto',
      account: 'Cuenta',
      register: 'Registrar'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const navigationItems = [
    {
      label: t.dashboard,
      path: '/product-dashboard',
      icon: 'LayoutDashboard',
      active: location.pathname === '/product-dashboard'
    },
    {
      label: t.products,
      icon: 'Package',
      children: [
        {
          label: t.productList,
          path: '/product-list',
          icon: 'List',
          active: ['/product-list', '/product-details', '/edit-product'].includes(location.pathname)
        },
        {
          label: t.addProduct,
          path: '/add-product',
          icon: 'Plus',
          active: location.pathname === '/add-product'
        }
      ]
    },
    {
      label: t.account,
      path: '/register',
      icon: 'UserCircle',
      active: location.pathname === '/register'
    }
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
          <Icon name="Package" size={24} color="white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text-primary font-heading">
            Product Manager
          </h1>
          <p className="text-xs text-text-muted">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              // Parent with children
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary">
                  <Icon name={item.icon} size={20} className="mr-3" />
                  {item.label}
                </div>
                <div className="ml-6 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <button
                      key={childIndex}
                      onClick={() => handleNavigation(child.path)}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-all duration-150 hover:shadow-hover ${
                        child.active
                          ? 'bg-primary text-primary-foreground shadow-elevation-1'
                          : 'text-text-primary hover:bg-surface hover:text-text-primary'
                      }`}
                    >
                      <Icon 
                        name={child.icon} 
                        size={16} 
                        className="mr-3" 
                        color={child.active ? 'currentColor' : undefined}
                      />
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Single item
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-hover ${
                  item.active
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-text-primary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className="mr-3" 
                  color={item.active ? 'currentColor' : undefined}
                />
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-text-muted text-center">
          © 2024 Product Manager
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-1100 p-2 md:hidden bg-background border border-border rounded-lg shadow-elevation-1"
      >
        <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
      </Button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-60 bg-background border-r border-border shadow-elevation-1 z-1000">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-1100 md:hidden"
            onClick={closeMobileMenu}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-80 bg-background shadow-elevation-3 z-1200 md:hidden animate-slide-in">
            <SidebarContent isMobile={true} />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;