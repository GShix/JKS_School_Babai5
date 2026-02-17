import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div className="absolute w-32 h-32 border-8 border-gray-200 border-t-[#035CB0] border-r-[#035CB0] rounded-full animate-spin"></div>
        
        {/* School logo in the center */}
        <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg">
          <img 
            src="/img/jkss_logo.png" 
            alt="Loading..." 
            className="w-20 h-20 object-contain rounded-full"
          />
        </div>
      </div>
      
      {/* Optional loading text */}
      <div className="absolute mt-48 text-[#035CB0] font-semibold text-lg animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;
