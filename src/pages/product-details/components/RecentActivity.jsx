import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ product }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      recentActivity: 'Recent Activity',
      viewedBy: 'viewed by',
      editedBy: 'edited by',
      duplicatedBy: 'duplicated by',
      sharedBy: 'shared by',
      exportedBy: 'exported by',
      createdBy: 'created by',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
      viewAll: 'View All Activity'
    },
    es: {
      recentActivity: 'Actividad Reciente',
      viewedBy: 'visto por',
      editedBy: 'editado por',
      duplicatedBy: 'duplicado por',
      sharedBy: 'compartido por',
      exportedBy: 'exportado por',
      createdBy: 'creado por',
      minutes: 'minutos atrás',
      hours: 'horas atrás',
      days: 'días atrás',
      viewAll: 'Ver Toda la Actividad'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const mockActivities = [
    {
      id: 1,
      type: 'view',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      icon: 'Eye',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'edit',
      user: 'Mike Chen',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      icon: 'Edit',
      color: 'text-warning-600'
    },
    {
      id: 3,
      type: 'share',
      user: 'Alex Rodriguez',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'Share',
      color: 'text-success-600'
    },
    {
      id: 4,
      type: 'view',
      user: 'Emma Wilson',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'Eye',
      color: 'text-primary'
    },
    {
      id: 5,
      type: 'export',
      user: 'David Kim',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      icon: 'Download',
      color: 'text-accent'
    },
    {
      id: 6,
      type: 'duplicate',
      user: 'Lisa Brown',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      icon: 'Copy',
      color: 'text-secondary-600'
    }
  ];

  const getActivityText = (type) => {
    switch (type) {
      case 'view': return t.viewedBy;
      case 'edit': return t.editedBy;
      case 'duplicate': return t.duplicatedBy;
      case 'share': return t.sharedBy;
      case 'export': return t.exportedBy;
      case 'create': return t.createdBy;
      default: return t.viewedBy;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t.minutes}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${t.hours}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${t.days}`;
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{t.recentActivity}</h3>
        <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-150">
          {t.viewAll}
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-surface rounded-lg transition-colors duration-150">
            <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center ${activity.color}`}>
              <Icon name={activity.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">
                <span className="font-medium">{product.name}</span>
                {' '}
                <span className="text-text-secondary">{getActivityText(activity.type)}</span>
                {' '}
                <span className="font-medium">{activity.user}</span>
              </p>
              <p className="text-xs text-text-muted">{getTimeAgo(activity.timestamp)}</p>
            </div>

            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-border-light">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">24</div>
            <div className="text-xs text-text-muted">Views Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-600">3</div>
            <div className="text-xs text-text-muted">Edits This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning-600">7</div>
            <div className="text-xs text-text-muted">Shares This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;