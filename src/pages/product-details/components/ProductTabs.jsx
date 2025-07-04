import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      inventory: 'Inventory History',
      pricing: 'Price Changes',
      reviews: 'Customer Reviews',
      related: 'Related Products',
      activity: 'Recent Activity',
      date: 'Date',
      action: 'Action',
      quantity: 'Quantity',
      user: 'User',
      oldPrice: 'Old Price',
      newPrice: 'New Price',
      reason: 'Reason',
      customer: 'Customer',
      rating: 'Rating',
      comment: 'Comment',
      viewAll: 'View All',
      noData: 'No data available',
      stockAdded: 'Stock Added',
      stockRemoved: 'Stock Removed',
      priceUpdate: 'Price Update',
      productCreated: 'Product Created',
      productUpdated: 'Product Updated'
    },
    es: {
      inventory: 'Historial de Inventario',
      pricing: 'Cambios de Precio',
      reviews: 'Reseñas de Clientes',
      related: 'Productos Relacionados',
      activity: 'Actividad Reciente',
      date: 'Fecha',
      action: 'Acción',
      quantity: 'Cantidad',
      user: 'Usuario',
      oldPrice: 'Precio Anterior',
      newPrice: 'Precio Nuevo',
      reason: 'Razón',
      customer: 'Cliente',
      rating: 'Calificación',
      comment: 'Comentario',
      viewAll: 'Ver Todo',
      noData: 'No hay datos disponibles',
      stockAdded: 'Stock Agregado',
      stockRemoved: 'Stock Removido',
      priceUpdate: 'Actualización de Precio',
      productCreated: 'Producto Creado',
      productUpdated: 'Producto Actualizado'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const tabs = [
    { id: 'inventory', label: t.inventory, icon: 'Package' },
    { id: 'pricing', label: t.pricing, icon: 'DollarSign' },
    { id: 'reviews', label: t.reviews, icon: 'Star' },
    { id: 'related', label: t.related, icon: 'Grid3X3' }
  ];

  const mockInventoryHistory = [
    {
      id: 1,
      date: new Date(Date.now() - 86400000 * 2),
      action: t.stockAdded,
      quantity: '+50',
      user: 'John Smith',
      reason: 'New shipment received'
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000 * 5),
      action: t.stockRemoved,
      quantity: '-25',
      user: 'Sales System',
      reason: 'Customer orders'
    },
    {
      id: 3,
      date: new Date(Date.now() - 86400000 * 10),
      action: t.stockAdded,
      quantity: '+100',
      user: 'Admin',
      reason: 'Initial stock'
    }
  ];

  const mockPriceHistory = [
    {
      id: 1,
      date: new Date(Date.now() - 86400000 * 7),
      oldPrice: 299.99,
      newPrice: 249.99,
      reason: 'Seasonal discount',
      user: 'Marketing Team'
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000 * 30),
      oldPrice: 279.99,
      newPrice: 299.99,
      reason: 'Price adjustment',
      user: 'Admin'
    }
  ];

  const mockReviews = [
    {
      id: 1,
      customer: 'Alice Johnson',
      rating: 5,
      comment: 'Excellent product! Great quality and fast delivery. Highly recommended for anyone looking for reliable tech equipment.',
      date: new Date(Date.now() - 86400000 * 3)
    },
    {
      id: 2,
      customer: 'Mike Chen',
      rating: 4,
      comment: 'Good value for money. The product works as expected, though the packaging could be improved.',
      date: new Date(Date.now() - 86400000 * 7)
    },
    {
      id: 3,
      customer: 'Sarah Williams',
      rating: 5,
      comment: 'Outstanding quality and excellent customer service. Will definitely buy again!',
      date: new Date(Date.now() - 86400000 * 12)
    }
  ];

  const mockRelatedProducts = [
    {
      id: 'related-1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Electronics'
    },
    {
      id: 'related-2',
      name: 'Smart Fitness Tracker',
      price: 149.99,
      image: 'https://images.pixabay.com/photo/2016/12/09/11/33/smartphone-1894723_1280.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'Wearables'
    },
    {
      id: 'related-3',
      name: 'Portable Power Bank',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1609592806596-4d8b5b2b7e4c?auto=format&fit=crop&w=400&q=80',
      category: 'Accessories'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning-500 fill-current' : 'text-secondary-300'}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return (
          <div className="space-y-4">
            {mockInventoryHistory.map((item) => (
              <div key={item.id} className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.quantity.startsWith('+') ? 'bg-success-50' : 'bg-error-50'
                    }`}>
                      <Icon 
                        name={item.quantity.startsWith('+') ? 'Plus' : 'Minus'} 
                        size={16} 
                        className={item.quantity.startsWith('+') ? 'text-success-600' : 'text-error-600'}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{item.action}</h4>
                      <p className="text-sm text-text-muted">{item.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      item.quantity.startsWith('+') ? 'text-success-600' : 'text-error-600'
                    }`}>
                      {item.quantity}
                    </div>
                    <div className="text-sm text-text-muted">
                      {item.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{item.reason}</p>
              </div>
            ))}
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            {mockPriceHistory.map((item) => (
              <div key={item.id} className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                      <Icon name="DollarSign" size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{t.priceUpdate}</h4>
                      <p className="text-sm text-text-muted">{item.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-muted line-through">${item.oldPrice}</div>
                    <div className="font-semibold text-primary">${item.newPrice}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{item.reason}</span>
                  <span className="text-text-muted">{item.date.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {review.customer.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{review.customer}</h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-text-muted">
                    {review.date.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-text-secondary">{review.comment}</p>
              </div>
            ))}
            <Button variant="outline" fullWidth>
              {t.viewAll}
            </Button>
          </div>
        );

      case 'related':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRelatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-elevation-2 transition-shadow duration-150">
                <div className="h-32 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-text-primary mb-1 truncate">
                    {relatedProduct.name}
                  </h4>
                  <p className="text-sm text-text-muted mb-2">{relatedProduct.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">${relatedProduct.price}</span>
                    <Button variant="outline" size="sm">
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-center text-text-muted py-8">{t.noData}</div>;
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;