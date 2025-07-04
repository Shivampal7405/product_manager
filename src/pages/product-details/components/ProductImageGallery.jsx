import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductImageGallery = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = [
    product.image,
    "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg?auto=compress&cs=tinysrgb&w=800",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
  ];

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-surface rounded-lg overflow-hidden border border-border">
        <div className={`relative ${isZoomed ? 'h-96' : 'h-80'} transition-all duration-300`}>
          <Image
            src={images[selectedImageIndex]}
            alt={`${product.name} - Image ${selectedImageIndex + 1}`}
            className={`w-full h-full object-cover cursor-pointer transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={handleZoomToggle}
          />
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>

          {/* Zoom Button */}
          <Button
            variant="ghost"
            onClick={handleZoomToggle}
            className="absolute top-2 right-2 w-10 h-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full"
          >
            <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={20} />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
              selectedImageIndex === index
                ? 'border-primary shadow-elevation-2'
                : 'border-border hover:border-secondary-400'
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;