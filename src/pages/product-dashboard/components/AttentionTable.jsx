import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttentionTable = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      sku: 'APL-IP15PM-256-SB',
      issue: 'Low Stock',
      priority: 'high',
      stock: 2,
      lastUpdated: '2024-01-15',
      action: 'Restock',
      category: 'Smartphones'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SAM-GS24U-512-TI',
      issue: 'Price Update Required',
      priority: 'medium',
      stock: 15,
      lastUpdated: '2024-01-14',
      action: 'Update Price',
      category: 'Smartphones'
    },
    {
      id: 3,
      name: 'MacBook Pro 14" M3',
      sku: 'APL-MBP14-M3-SG',
      issue: 'Missing Images',
      priority: 'medium',
      stock: 8,
      lastUpdated: '2024-01-13',
      action: 'Add Images',
      category: 'Laptops'
    },
    {
      id: 4,
      name: 'Dell XPS 13 Plus',
      sku: 'DEL-XPS13P-I7-SL',
      issue: 'Pending Approval',
      priority: 'low',
      stock: 12,
      lastUpdated: '2024-01-12',
      action: 'Review',
      category: 'Laptops'
    },
    {
      id: 5,
      name: 'Sony WH-1000XM5',
      sku: 'SNY-WH1000XM5-BK',
      issue: 'Description Incomplete',
      priority: 'low',
      stock: 25,
      lastUpdated: '2024-01-11',
      action: 'Update Info',
      category: 'Audio'
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-error-50 text-error-700 border-error-200',
      medium: 'bg-warning-50 text-warning-700 border-warning-200',
      low: 'bg-success-50 text-success-700 border-success-200'
    };
    return colors[priority] || colors.low;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: 'AlertCircle',
      medium: 'AlertTriangle',
      low: 'Info'
    };
    return icons[priority] || icons.low;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleProductAction = (product) => {
    if (product.action === 'Restock' || product.action === 'Update Price' || product.action === 'Add Images' || product.action === 'Update Info') {
      navigate(`/edit-product?id=${product.id}`);
    } else if (product.action === 'Review') {
      navigate(`/product-details?id=${product.id}`);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[a.priority];
      bValue = priorityOrder[b.priority];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="bg-background border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Products Requiring Attention
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Items that need updates, approvals, or restocking
            </p>
          </div>
          <Button
            variant="outline"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => navigate('/product-list')}
          >
            View All Products
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Product</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('issue')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Issue</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Priority</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Stock</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Last Updated</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-surface transition-colors duration-150">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-text-primary">
                      {product.name}
                    </div>
                    <div className="text-sm text-text-muted">
                      SKU: {product.sku}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-primary">
                    {product.issue}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(product.priority)}`}>
                    <Icon 
                      name={getPriorityIcon(product.priority)} 
                      size={12} 
                      className="mr-1"
                    />
                    {product.priority.charAt(0).toUpperCase() + product.priority.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-error-600' : 'text-text-primary'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-muted">
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductAction(product)}
                  >
                    {product.action}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttentionTable;