import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'product_added',
      title: 'New product added',
      description: 'iPhone 15 Pro Max 256GB Space Black added to inventory',
      user: 'Sarah Johnson',
      timestamp: '2 minutes ago',
      icon: 'Plus',
      color: 'success'
    },
    {
      id: 2,
      type: 'stock_low',
      title: 'Low stock alert',
      description: 'Samsung Galaxy S24 Ultra - Only 3 units remaining',
      user: 'System',
      timestamp: '15 minutes ago',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 3,
      type: 'product_updated',
      title: 'Product updated',
      description: 'MacBook Pro 14" M3 - Price updated from $1,999 to $1,899',
      user: 'Mike Chen',
      timestamp: '1 hour ago',
      icon: 'Edit',
      color: 'primary'
    },
    {
      id: 4,
      type: 'product_deleted',
      title: 'Product removed',
      description: 'iPhone 12 Mini 64GB Purple removed from catalog',
      user: 'Admin',
      timestamp: '2 hours ago',
      icon: 'Trash2',
      color: 'error'
    },
    {
      id: 5,
      type: 'bulk_import',
      title: 'Bulk import completed',
      description: '45 new products imported from supplier catalog',
      user: 'System',
      timestamp: '3 hours ago',
      icon: 'Upload',
      color: 'primary'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      success: 'text-success-600',
      warning: 'text-warning-600',
      primary: 'text-primary-600',
      error: 'text-error-600'
    };
    return colors[color] || 'text-text-muted';
  };

  const getBgColor = (color) => {
    const colors = {
      success: 'bg-success-50',
      warning: 'bg-warning-50',
      primary: 'bg-primary-50',
      error: 'bg-error-50'
    };
    return colors[color] || 'bg-secondary-50';
  };

  return (
    <div className="bg-background border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-surface transition-colors duration-150">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${getBgColor(activity.color)}`}>
                <Icon 
                  name={activity.icon} 
                  size={16} 
                  className={getIconColor(activity.color)}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-text-primary">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-text-muted">
                    {activity.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-text-secondary mb-1">
                  {activity.description}
                </p>
                
                <p className="text-xs text-text-muted">
                  by {activity.user}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;