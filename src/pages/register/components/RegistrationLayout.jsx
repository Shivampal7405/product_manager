import React from 'react';

const RegistrationLayout = ({ children, header }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface-100">
      <div className="min-h-screen flex">
        {/* Left Panel - Header/Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-background border-r border-border">
          <div className="flex items-center justify-center w-full p-12">
            <div className="max-w-md">
              {header}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 lg:w-1/2 xl:w-3/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8">
              {header}
            </div>
            
            {/* Form Content */}
            <div className="bg-background rounded-2xl shadow-elevation-3 p-8 border border-border">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent opacity-5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default RegistrationLayout;