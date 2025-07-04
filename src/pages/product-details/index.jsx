import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductActions from './components/ProductActions';
import ProductTabs from './components/ProductTabs';
import RecentActivity from './components/RecentActivity';
import { PageLoading, ErrorState } from '../../components/ui/LoadingStates';

const ProductDetails = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    // Simulate loading product data
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Get product ID from URL params or location state
        const urlParams = new URLSearchParams(location.search);
        const productId = urlParams.get('id') || location.state?.productId;
        
        if (!productId) {
          // Mock product data if no ID provided
          const mockProduct = {
            id: "PROD-001",
            name: "Premium Wireless Bluetooth Headphones",
            description: `Experience superior sound quality with our premium wireless Bluetooth headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear audio for music, calls, and multimedia content.\n\nDesigned for comfort during extended use, they include premium memory foam ear cushions and an adjustable headband. The long-lasting battery provides up to 30 hours of continuous playback, while quick charge technology gives you 3 hours of playback with just 15 minutes of charging.\n\nPerfect for professionals, students, and music enthusiasts who demand the best in audio technology.`,
            price: 249.99,
            category: "Electronics",
            stock: 45,
            image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
            createdAt: new Date(Date.now() - 86400000 * 30),
            updatedAt: new Date(Date.now() - 86400000 * 2)
          };
          setProduct(mockProduct);
        } else {
          // In a real app, fetch product by ID
          // For now, use mock data
          const mockProduct = {
            id: productId,
            name: "Premium Wireless Bluetooth Headphones",
            description: `Experience superior sound quality with our premium wireless Bluetooth headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear audio for music, calls, and multimedia content.\n\nDesigned for comfort during extended use, they include premium memory foam ear cushions and an adjustable headband. The long-lasting battery provides up to 30 hours of continuous playback, while quick charge technology gives you 3 hours of playback with just 15 minutes of charging.\n\nPerfect for professionals, students, and music enthusiasts who demand the best in audio technology.`,
            price: 249.99,
            category: "Electronics",
            stock: 45,
            image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
            createdAt: new Date(Date.now() - 86400000 * 30),
            updatedAt: new Date(Date.now() - 86400000 * 2)
          };
          setProduct(mockProduct);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadProduct();
  }, [location]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Reload the page or retry the data fetch
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <Sidebar />
        <main className="md:ml-60 pt-16">
          <PageLoading message="Loading product details..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <Sidebar />
        <main className="md:ml-60 pt-16">
          <ErrorState 
            message={error} 
            onRetry={handleRetry}
          />
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface">
        <Header />
        <Sidebar />
        <main className="md:ml-60 pt-16">
          <ErrorState 
            message="Product not found" 
            onRetry={() => navigate('/product-list')}
            showRetry={true}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar />
      
      <main className="md:ml-60 pt-16">
        <Breadcrumb />
        
        <div className="p-6 space-y-6">
          {/* Main Product Information Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Product Image Gallery - Left Column (3 columns) */}
            <div className="lg:col-span-3">
              <ProductImageGallery product={product} />
            </div>

            {/* Product Information - Center Column (6 columns) */}
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>

            {/* Product Actions - Right Column (3 columns) */}
            <div className="lg:col-span-3">
              <ProductActions product={product} />
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ProductTabs product={product} />
            </div>
            
            {/* Recent Activity Sidebar */}
            <div className="xl:col-span-1">
              <RecentActivity product={product} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;