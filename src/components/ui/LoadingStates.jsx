import React from 'react';
import Icon from '../AppIcon';

// Skeleton component for loading states
const Skeleton = ({ className = '', width, height }) => (
  <div 
    className={`animate-pulse bg-secondary-200 rounded ${className}`}
    style={{ width, height }}
  />
);

// Loading spinner component
const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <div 
      className="animate-spin rounded-full border-2 border-secondary-300 border-t-primary"
      style={{ width: size, height: size }}
    />
  </div>
);

// Navigation loading skeleton
const NavigationSkeleton = () => (
  <div className="space-y-2 p-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-4 flex-1 max-w-32" />
      </div>
    ))}
  </div>
);

// Table loading skeleton
const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {/* Header skeleton */}
    <div className="flex space-x-4 p-4 border-b border-border">
      {[...Array(columns)].map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1" />
      ))}
    </div>
    
    {/* Rows skeleton */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 p-4 border-b border-border-light">
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

// Card loading skeleton
const CardSkeleton = ({ showImage = false }) => (
  <div className="bg-background border border-border rounded-lg p-6 space-y-4">
    {showImage && <Skeleton className="w-full h-48 rounded-lg" />}
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex space-x-2 pt-2">
      <Skeleton className="h-8 w-20 rounded" />
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

// Form loading skeleton
const FormSkeleton = () => (
  <div className="space-y-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <div className="flex space-x-3 pt-4">
      <Skeleton className="h-10 w-24 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

// Loading overlay for actions
const LoadingOverlay = ({ message = 'Loading...', isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1300">
      <div className="bg-background rounded-lg p-6 shadow-elevation-3 flex items-center space-x-4 min-w-48">
        <LoadingSpinner size={24} />
        <span className="text-text-primary font-medium">{message}</span>
      </div>
    </div>
  );
};

// Button loading state
const ButtonLoading = ({ children, isLoading = false, ...props }) => (
  <button 
    {...props}
    disabled={isLoading || props.disabled}
    className={`${props.className} ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
  >
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size={16} />
        <span>Loading...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

// Page loading component
const PageLoading = ({ message = 'Loading page...' }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center space-y-4">
      <LoadingSpinner size={32} />
      <p className="text-text-secondary">{message}</p>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  showRetry = true 
}) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center space-y-4 max-w-md">
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto">
        <Icon name="AlertCircle" size={32} className="text-error" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-text-secondary">{message}</p>
      </div>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700 transition-colors duration-150"
        >
          <Icon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  icon = 'Inbox'
}) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center space-y-4 max-w-md">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
        <Icon name={icon} size={32} className="text-secondary-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>
        <p className="text-text-secondary">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700 transition-colors duration-150"
        >
          <Icon name="Plus" size={16} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  </div>
);

export {
  Skeleton,
  LoadingSpinner,
  NavigationSkeleton,
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  LoadingOverlay,
  ButtonLoading,
  PageLoading,
  ErrorState,
  EmptyState
};