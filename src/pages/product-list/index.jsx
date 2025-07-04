import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import productService from '../../utils/productService';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterPanel from './components/FilterPanel';
import ProductToolbar from './components/ProductToolbar';
import ProductTable from './components/ProductTable';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { PageLoading, ErrorState } from '../../components/ui/LoadingStates';

const ProductList = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ column: 'name', direction: 'asc' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productIds: [], productNames: [] });
  
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    stockStatus: '',
    brand: '',
    dateRange: '',
    customDateFrom: '',
    customDateTo: ''
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await productService.getProducts(
          { ...filters, searchQuery },
          sortConfig
        );
        
        if (result?.success) {
          setProducts(result.data || []);
        } else {
          setError(result?.error || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
        console.log('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      initializeData();
    }
  }, [filters, searchQuery, sortConfig, authLoading]);

  // Handle URL search params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Filter and sort products (client-side filtering for additional refinement)
  const processedProducts = useMemo(() => {
    let filtered = [...products];

    // Products are already filtered from the server, but we can add client-side pagination
    return filtered;
  }, [products]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  // Event handlers
  const handleFiltersChange = async (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    // Update URL params
    if (query.trim()) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleSort = async (config) => {
    setSortConfig(config);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(product => product.id));
    }
  };

  const handleBulkAction = async (action, productIds, options = {}) => {
    switch (action) {
      case 'delete':
        const productsToDelete = products.filter(p => productIds.includes(p.id));
        setDeleteModal({
          isOpen: true,
          productIds,
          productNames: productsToDelete.map(p => p.name)
        });
        break;
      case 'export':
        console.log('Exporting products:', { productIds, format: options.format, scope: options.scope });
        break;
      case 'activate': case'deactivate':
        console.log(`${action} products:`, productIds);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      
      if (deleteModal.productIds.length === 1) {
        await productService.deleteProduct(deleteModal.productIds[0]);
      } else {
        await productService.deleteProducts(deleteModal.productIds);
      }
      
      // Refresh products list
      const result = await productService.getProducts(
        { ...filters, searchQuery },
        sortConfig
      );
      
      if (result?.success) {
        setProducts(result.data || []);
      }
      
      setSelectedProducts([]);
      setDeleteModal({ isOpen: false, productIds: [], productNames: [] });
    } catch (error) {
      console.log('Delete failed:', error);
      setError('Failed to delete products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product?id=${productId}`);
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p.id === productId);
    setDeleteModal({
      isOpen: true,
      productIds: [productId],
      productNames: [product?.name || '']
    });
  };

  const handleDuplicate = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      if (product) {
        const duplicatedProduct = {
          ...product,
          name: `${product.name} (Copy)`,
          sku: `${product.sku}-COPY-${Date.now()}`,
        };
        
        const result = await productService.createProduct(duplicatedProduct);
        
        if (result?.success) {
          // Refresh products list
          const refreshResult = await productService.getProducts(
            { ...filters, searchQuery },
            sortConfig
          );
          
          if (refreshResult?.success) {
            setProducts(refreshResult.data || []);
          }
        }
      }
    } catch (error) {
      console.log('Duplicate failed:', error);
      setError('Failed to duplicate product');
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product-details?id=${productId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view products.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <PageLoading message="Loading products..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="md:ml-60 pt-16">
          <ErrorState 
            message={error} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <div className="md:ml-60 pt-16">
        <Breadcrumb />
        
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isCollapsed={isFilterCollapsed}
            onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <ProductToolbar
              selectedProducts={selectedProducts}
              onBulkAction={handleBulkAction}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              totalProducts={products.length}
              filteredProducts={processedProducts.length}
            />
            
            {/* Products Display */}
            <div className="flex-1 overflow-auto p-6">
              {viewMode === 'table' ? (
                <ProductTable
                  products={paginatedProducts}
                  selectedProducts={selectedProducts}
                  onProductSelect={handleProductSelect}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <ProductGrid
                  products={paginatedProducts}
                  selectedProducts={selectedProducts}
                  onProductSelect={handleProductSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
            
            {/* Pagination */}
            {processedProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={processedProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productIds: [], productNames: [] })}
        onConfirm={handleDeleteConfirm}
        productCount={deleteModal.productIds.length}
        productNames={deleteModal.productNames}
      />
    </div>
  );
};

export default ProductList;