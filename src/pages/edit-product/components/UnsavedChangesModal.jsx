import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UnsavedChangesModal = ({ isOpen, onClose, onSave, onDiscard, changedFields }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const translations = {
    en: {
      unsavedChanges: 'Unsaved Changes',
      confirmMessage: 'You have unsaved changes. What would you like to do?',
      changesWillBeLost: 'If you leave without saving, your changes will be lost.',
      saveChanges: 'Save Changes',
      discardChanges: 'Discard Changes',
      cancel: 'Cancel',
      fieldsModified: 'fields modified'
    },
    es: {
      unsavedChanges: 'Cambios No Guardados',
      confirmMessage: '¿Tienes cambios no guardados. ¿Qué te gustaría hacer?',
      changesWillBeLost: 'Si sales sin guardar, tus cambios se perderán.',
      saveChanges: 'Guardar Cambios',
      discardChanges: 'Descartar Cambios',
      cancel: 'Cancelar',
      fieldsModified: 'campos modificados'
    }
  };

  const t = translations[currentLanguage] || translations.en;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-1400 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-elevation-3 max-w-md w-full mx-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t.unsavedChanges}
              </h3>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-text-primary">
              {t.confirmMessage}
            </p>
            
            <p className="text-text-secondary text-sm">
              {t.changesWillBeLost}
            </p>
            
            {/* Changed Fields Summary */}
            {changedFields && changedFields.size > 0 && (
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="Edit" size={16} className="text-warning-600" />
                  <span className="text-sm text-warning-700">
                    {changedFields.size} {t.fieldsModified}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border">
            <Button
              variant="primary"
              onClick={onSave}
              className="flex-1"
            >
              <Icon name="Save" size={16} className="mr-2" />
              {t.saveChanges}
            </Button>
            
            <Button
              variant="danger"
              onClick={onDiscard}
              className="flex-1"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              {t.discardChanges}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnsavedChangesModal;