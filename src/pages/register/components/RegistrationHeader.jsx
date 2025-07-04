import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      welcome: 'Welcome to Product Manager',
      subtitle: 'Create your account to get started with comprehensive product management',
      features: [
        'Manage your product catalog efficiently',
        'Track inventory and product details',
        'Collaborate with your team seamlessly',
        'Generate reports and analytics'
      ]
    },
    es: {
      welcome: 'Bienvenido a Product Manager',
      subtitle: 'Crea tu cuenta para comenzar con la gestión integral de productos',
      features: [
        'Gestiona tu catálogo de productos eficientemente',
        'Rastrea inventario y detalles de productos',
        'Colabora con tu equipo sin problemas',
        'Genera reportes y análisis'
      ]
    }
  };

  const t = translations[currentLanguage] || translations.en;

  return (
    <div className="text-center lg:text-left">
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl shadow-elevation-2">
          <Icon name="Package" size={28} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Product Manager
          </h1>
          <p className="text-sm text-text-muted">Business Solution</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4 font-heading">
          {t.welcome}
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {t.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-6 h-6 bg-success-100 rounded-full">
              <Icon name="Check" size={16} className="text-success" />
            </div>
            <span className="text-text-primary">{feature}</span>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="hidden lg:block mt-12">
        <div className="grid grid-cols-3 gap-4 opacity-10">
          <div className="h-20 bg-primary rounded-lg" />
          <div className="h-20 bg-accent rounded-lg" />
          <div className="h-20 bg-success rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default RegistrationHeader;