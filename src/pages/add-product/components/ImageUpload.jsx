import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUpload = ({ onImagesChange, maxImages = 5 }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      productImages: 'Product Images',
      dragDropText: 'Drag & drop images here, or click to select',
      supportedFormats: 'Supported formats: JPG, PNG, WebP (Max 5MB each)',
      selectFiles: 'Select Files',
      primary: 'Primary',
      setPrimary: 'Set as Primary',
      remove: 'Remove',
      maxImagesReached: `Maximum ${maxImages} images allowed`,
      fileTooLarge: 'File size must be less than 5MB',
      invalidFormat: 'Invalid file format. Please use JPG, PNG, or WebP',
      uploadSuccess: 'Images uploaded successfully'
    },
    es: {
      productImages: 'Imágenes del Producto',
      dragDropText: 'Arrastra y suelta imágenes aquí, o haz clic para seleccionar',
      supportedFormats: 'Formatos soportados: JPG, PNG, WebP (Máx 5MB cada una)',
      selectFiles: 'Seleccionar Archivos',
      primary: 'Principal',
      setPrimary: 'Establecer como Principal',
      remove: 'Eliminar',
      maxImagesReached: `Máximo ${maxImages} imágenes permitidas`,
      fileTooLarge: 'El tamaño del archivo debe ser menor a 5MB',
      invalidFormat: 'Formato de archivo inválido. Por favor usa JPG, PNG, o WebP',
      uploadSuccess: 'Imágenes subidas exitosamente'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      alert(t.maxImagesReached);
      return;
    }

    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    fileArray.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(t.invalidFormat);
        return;
      }
      
      if (file.size > maxSize) {
        alert(t.fileTooLarge);
        return;
      }
      
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        id: Date.now() + Math.random()
      }));
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    // Adjust primary image index if needed
    if (primaryImageIndex >= updatedImages.length) {
      setPrimaryImageIndex(Math.max(0, updatedImages.length - 1));
    } else if (primaryImageIndex === indexToRemove && updatedImages.length > 0) {
      setPrimaryImageIndex(0);
    }
  };

  const setPrimaryImage = (index) => {
    setPrimaryImageIndex(index);
    // Notify parent component about primary image change
    const updatedImages = [...images];
    onImagesChange(updatedImages, index);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="Image" size={20} className="mr-2 text-primary" />
        {t.productImages}
      </h3>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-surface'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={24} className="text-text-muted" />
          </div>
          
          <div>
            <p className="text-text-primary font-medium mb-2">
              {t.dragDropText}
            </p>
            <p className="text-sm text-text-muted mb-4">
              {t.supportedFormats}
            </p>
            
            <Button
              variant="primary"
              onClick={openFileDialog}
              iconName="FolderOpen"
              iconPosition="left"
            >
              {t.selectFiles}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === primaryImageIndex 
                    ? 'border-primary shadow-elevation-2' 
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="aspect-square">
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Primary Badge */}
                {index === primaryImageIndex && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    {t.primary}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                  {index !== primaryImageIndex && (
                    <Button
                      variant="secondary"
                      onClick={() => setPrimaryImage(index)}
                      className="text-xs px-2 py-1"
                      iconName="Star"
                      iconPosition="left"
                    >
                      {t.setPrimary}
                    </Button>
                  )}
                  
                  <Button
                    variant="danger"
                    onClick={() => removeImage(index)}
                    className="text-xs px-2 py-1"
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    {t.remove}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Upload More Button */}
          {images.length < maxImages && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={openFileDialog}
                iconName="Plus"
                iconPosition="left"
              >
                Add More Images ({images.length}/{maxImages})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;