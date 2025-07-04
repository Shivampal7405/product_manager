import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SummaryCard from './components/SummaryCard';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import AttentionTable from './components/AttentionTable';

const ProductDashboard = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      pageTitle: 'Product Dashboard',
      totalProducts: 'Total Products',
      lowStockAlerts: 'Low Stock Alerts',
      recentAdditions: 'Recent Additions',
      totalRevenue: 'Total Revenue'
    },
    es: {
      pageTitle: 'Panel de Productos',
      totalProducts: 'Total de Productos',
      lowStockAlerts: 'Alertas de Stock Bajo',
      recentAdditions: 'Adiciones Recientes',
      totalRevenue: 'Ingresos Totales'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const summaryData = [
    {
      title: t.totalProducts,
      value: '1,247',
      subtitle: 'Active products in catalog',
      icon: 'Package',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    {
      title: t.lowStockAlerts,
      value: '23',
      subtitle: 'Products need restocking',
      icon: 'AlertTriangle',
      trend: 'down',
      trendValue: '-8%',
      color: 'warning'
    },
    {
      title: t.recentAdditions,
      value: '45',
      subtitle: 'Added this month',
      icon: 'Plus',
      trend: 'up',
      trendValue: '+25%',
      color: 'success'
    },
    {
      title: t.totalRevenue,
      value: '$124,567',
      subtitle: 'From product sales',
      icon: 'DollarSign',
      trend: 'up',
      trendValue: '+18%',
      color: 'primary'
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar />
      
      <main className="md:ml-60 pt-16">
        <Breadcrumb />
        
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-2">
              {t.pageTitle}
            </h1>
            <p className="text-text-secondary">
              Overview of your product inventory and management tools
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {summaryData.map((card, index) => (
              <SummaryCard
                key={index}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                trend={card.trend}
                trendValue={card.trendValue}
                color={card.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <RecentActivity />
            </div>
            
            {/* Quick Actions - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Products Requiring Attention Table */}
          <div className="mb-8">
            <AttentionTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDashboard;