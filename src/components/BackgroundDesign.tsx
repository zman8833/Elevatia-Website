import React from 'react';

const BackgroundDesign = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
      
      {/* Abstract geometric shapes */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gray-400/10 rounded-full blur-3xl" />
      
      {/* Floating elements */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-lg transform rotate-12 blur-xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-lg transform -rotate-12 blur-xl" />
      
      {/* Cornerstone Cross */}
      <div className="absolute bottom-8 right-8 w-24 h-24 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 49.9%, #000 50%, transparent 50.1%),
            linear-gradient(0deg, transparent 49.9%, #000 50%, transparent 50.1%)
          `,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center'
        }} />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export default BackgroundDesign; 