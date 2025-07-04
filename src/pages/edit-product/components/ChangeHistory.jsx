import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChangeHistory = ({ productId }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      changeHistory: 'Change History',
      viewHistory: 'View History',
      hideHistory: 'Hide History',
      noChanges: 'No changes recorded yet',
      viewDetails: 'View Details',
      hideDetails: 'Hide Details',
      fieldChanged: 'Field Changed',
      oldValue: 'Old Value',
      newValue: 'New Value',
      changedBy: 'Changed By',
      changeDate: 'Change Date',
      created: 'Created',
      updated: 'Updated',
      priceChanged: 'Price Changed',
      stockUpdated: 'Stock Updated',
      statusChanged: 'Status Changed',
      imageAdded: 'Image Added',
      imageRemoved: 'Image Removed'
    },
    es: {
      changeHistory: 'Historial de Cambios',
      viewHistory: 'Ver Historial',
      hideHistory: 'Ocultar Historial',
      noChanges: 'No se han registrado cambios aún',
      viewDetails: 'Ver Detalles',
      hideDetails: 'Ocultar Detalles',
      fieldChanged: 'Campo Cambiado',
      oldValue: 'Valor Anterior',
      newValue: 'Valor Nuevo',
      changedBy: 'Cambiado Por',
      changeDate: 'Fecha de Cambio',
      created: 'Creado',
      updated: 'Actualizado',
      priceChanged: 'Precio Cambiado',
      stockUpdated: 'Stock Actualizado',
      statusChanged: 'Estado Cambiado',
      imageAdded: 'Imagen Agregada',
      imageRemoved: 'Imagen Eliminada'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  // Mock change history data
  const changeHistory = [
    {
      id: 1,
      type: 'price_change',
      title: t.priceChanged,
      user: 'John Smith',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      changes: [
        {
          field: 'price',
          fieldLabel: 'Price',
          oldValue: '$199.99',
          newValue: '$179.99'
        },
        {
          field: 'comparePrice',
          fieldLabel: 'Compare Price',
          oldValue: '$249.99',
          newValue: '$229.99'
        }
      ]
    },
    {
      id: 2,
      type: 'stock_update',
      title: t.stockUpdated,
      user: 'Sarah Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      changes: [
        {
          field: 'quantity',
          fieldLabel: 'Quantity',
          oldValue: '45',
          newValue: '32'
        }
      ]
    },
    {
      id: 3,
      type: 'status_change',
      title: t.statusChanged,
      user: 'Mike Davis',
      userAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      changes: [
        {
          field: 'status',
          fieldLabel: 'Status',
          oldValue: 'Draft',
          newValue: 'Active'
        }
      ]
    },
    {
      id: 4,
      type: 'image_added',
      title: t.imageAdded,
      user: 'Emma Wilson',
      userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      changes: [
        {
          field: 'images',
          fieldLabel: 'Product Images',
          oldValue: '2 images',
          newValue: '3 images'
        }
      ]
    },
    {
      id: 5,
      type: 'created',
      title: t.created,
      user: 'Admin User',
      userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      changes: [
        {
          field: 'product',
          fieldLabel: 'Product',
          oldValue: '',
          newValue: 'Product created'
        }
      ]
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'price_change':
        return 'DollarSign';
      case 'stock_update':
        return 'Package';
      case 'status_change':
        return 'Settings';
      case 'image_added':
        return 'Image';
      case 'image_removed':
        return 'ImageMinus';
      case 'created':
        return 'Plus';
      default:
        return 'Edit';
    }
  };

  const getChangeColor = (type) => {
    switch (type) {
      case 'price_change':
        return 'text-warning-600';
      case 'stock_update':
        return 'text-primary';
      case 'status_change':
        return 'text-success-600';
      case 'image_added':
        return 'text-accent-600';
      case 'image_removed':
        return 'text-error';
      case 'created':
        return 'text-success-600';
      default:
        return 'text-text-muted';
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleChangeDetails = (changeId) => {
    setSelectedChange(selectedChange === changeId ? null : changeId);
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="History" size={20} className="mr-2 text-primary" />
          {t.changeHistory}
        </h3>
        
        <Button
          variant="ghost"
          onClick={toggleExpanded}
          className="text-sm"
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="mr-2" 
          />
          {isExpanded ? t.hideHistory : t.viewHistory}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {changeHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="History" size={24} className="text-text-muted" />
              </div>
              <p className="text-text-muted">{t.noChanges}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {changeHistory.map((change) => (
                <div
                  key={change.id}
                  className="border border-border rounded-lg p-4 hover:bg-surface transition-colors duration-150"
                >
                  <div className="flex items-start space-x-4">
                    {/* Change Icon */}
                    <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0 ${getChangeColor(change.type)}`}>
                      <Icon name={getChangeIcon(change.type)} size={16} />
                    </div>
                    
                    {/* Change Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-text-primary">
                          {change.title}
                        </h4>
                        <span className="text-xs text-text-muted">
                          {formatTimestamp(change.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img
                            src={change.userAvatar}
                            alt={change.user}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-text-secondary">
                          {change.user}
                        </span>
                      </div>
                      
                      {/* Quick Summary */}
                      <div className="text-sm text-text-muted mb-3">
                        {change.changes.length === 1 ? (
                          <span>
                            {change.changes[0].fieldLabel}: {change.changes[0].oldValue} → {change.changes[0].newValue}
                          </span>
                        ) : (
                          <span>
                            {change.changes.length} fields changed
                          </span>
                        )}
                      </div>
                      
                      {/* Toggle Details Button */}
                      <Button
                        variant="ghost"
                        onClick={() => toggleChangeDetails(change.id)}
                        className="text-xs p-1 h-auto"
                      >
                        <Icon 
                          name={selectedChange === change.id ? "ChevronUp" : "ChevronDown"} 
                          size={14} 
                          className="mr-1" 
                        />
                        {selectedChange === change.id ? t.hideDetails : t.viewDetails}
                      </Button>
                      
                      {/* Detailed Changes */}
                      {selectedChange === change.id && (
                        <div className="mt-4 space-y-3 border-t border-border pt-4">
                          {change.changes.map((fieldChange, index) => (
                            <div key={index} className="bg-surface rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-text-primary">
                                    {t.fieldChanged}:
                                  </span>
                                  <p className="text-text-secondary">
                                    {fieldChange.fieldLabel}
                                  </p>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-text-primary">
                                    {t.oldValue}:
                                  </span>
                                  <p className="text-error">
                                    {fieldChange.oldValue || '-'}
                                  </p>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-text-primary">
                                    {t.newValue}:
                                  </span>
                                  <p className="text-success-600">
                                    {fieldChange.newValue}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeHistory;