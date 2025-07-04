import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductImages = ({ productData, onImagesChange }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [images, setImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (productData && productData.images) {
      setImages(productData.images);
    } else {
      // Mock existing images
      setImages([
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          alt: "Product main image",
          isPrimary: true
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
          alt: "Product side view",
          isPrimary: false
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
          alt: "Product detail view",
          isPrimary: false
        }
      ]);
    }
  }, [productData]);

  const translations = {
    en: {
      productImages: 'Product Images',
      addImages: 'Add Images',
      dragDrop: 'Drag and drop images here or click to browse',
      setPrimary: 'Set as Primary',
      removeImage: 'Remove Image',
      reorderImages: 'Drag to reorder images',
      primaryImage: 'Primary Image',
      supportedFormats: 'Supported formats: JPG, PNG, WebP (Max 5MB each)',
      maxImages: 'Maximum 10 images allowed'
    },
    es: {
      productImages: 'Imágenes del Producto',
      addImages: 'Agregar Imágenes',
      dragDrop: 'Arrastra y suelta imágenes aquí o haz clic para explorar',
      setPrimary: 'Establecer como Principal',
      removeImage: 'Eliminar Imagen',
      reorderImages: 'Arrastra para reordenar imágenes',
      primaryImage: 'Imagen Principal',
      supportedFormats: 'Formatos soportados: JPG, PNG, WebP (Máx 5MB cada una)',
      maxImages: 'Máximo 10 imágenes permitidas'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/') && images.length < 10) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + index,
            url: e.target.result,
            alt: file.name,
            isPrimary: images.length === 0,
            file: file
          };
          
          setImages(prev => {
            const updated = [...prev, newImage];
            onImagesChange && onImagesChange(updated);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      
      newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      
      setImages(newImages);
      onImagesChange && onImagesChange(newImages);
    }
    
    setDraggedIndex(null);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const event = { target: { files: imageFiles } };
      handleFileUpload(event);
    }
  };

  const setPrimaryImage = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    
    setImages(updatedImages);
    onImagesChange && onImagesChange(updatedImages);
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // If we removed the primary image, set the first remaining image as primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    
    setImages(updatedImages);
    onImagesChange && onImagesChange(updatedImages);
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="Image" size={20} className="mr-2 text-primary" />
        {t.productImages}
      </h3>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors duration-200 ${
          isDragOver 
            ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-surface'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={24} className="text-text-muted" />
          </div>
          
          <div>
            <p className="text-text-primary font-medium mb-2">
              {t.dragDrop}
            </p>
            <p className="text-sm text-text-muted mb-4">
              {t.supportedFormats}
            </p>
            <p className="text-xs text-text-muted">
              {t.maxImages}
            </p>
          </div>
          
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              disabled={images.length >= 10}
            />
            <label htmlFor="image-upload">
              <Button
                variant="primary"
                disabled={images.length >= 10}
                className="cursor-pointer"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                {t.addImages}
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {t.reorderImages}
            </p>
            <span className="text-sm text-text-muted">
              {images.length}/10 images
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative group bg-surface border border-border rounded-lg overflow-hidden cursor-move transition-all duration-200 hover:shadow-elevation-2 ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {t.primaryImage}
                    </span>
                  </div>
                )}
                
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {!image.isPrimary && (
                      <Button
                        variant="secondary"
                        onClick={() => setPrimaryImage(image.id)}
                        className="text-xs px-2 py-1"
                      >
                        <Icon name="Star" size={14} className="mr-1" />
                        {t.setPrimary}
                      </Button>
                    )}
                    
                    <Button
                      variant="danger"
                      onClick={() => removeImage(image.id)}
                      className="text-xs px-2 py-1"
                    >
                      <Icon name="Trash2" size={14} className="mr-1" />
                      {t.removeImage}
                    </Button>
                  </div>
                </div>
                
                {/* Drag Handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-background bg-opacity-80 rounded p-1">
                    <Icon name="GripVertical" size={16} className="text-text-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;