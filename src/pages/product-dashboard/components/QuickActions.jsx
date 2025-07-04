import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Add New Product',
      description: 'Create a new product entry',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => navigate('/add-product')
    },
    {
      id: 2,
      title: 'Import Products',
      description: 'Bulk import from CSV/Excel',
      icon: 'Upload',
      variant: 'secondary',
      onClick: () => {
        // Mock import functionality
        alert('Import functionality would be implemented here');
      }
    },
    {
      id: 3,
      title: 'Export Data',
      description: 'Download product catalog',
      icon: 'Download',
      variant: 'outline',
      onClick: () => {
        // Mock export functionality
        alert('Export functionality would be implemented here');
      }
    },
    {
      id: 4,
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: 'FileText',
      variant: 'ghost',
      onClick: () => {
        // Mock report generation
        alert('Report generation would be implemented here');
      }
    }
  ];

  return (
    <div className="bg-background border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
        <p className="text-sm text-text-secondary mt-1">
          Frequently used operations
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="group">
            <Button
              variant={action.variant}
              iconName={action.icon}
              iconPosition="left"
              onClick={action.onClick}
              fullWidth
              className="justify-start text-left p-4 h-auto"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{action.title}</span>
                <span className="text-sm opacity-75 mt-1">
                  {action.description}
                </span>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;