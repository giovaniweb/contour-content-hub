
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Carregando Fluida...", 
  submessage = "Tô tirando do forno..." 
}) => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-contourline-lightGray to-white"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="relative" role="status">
          <div className="h-20 w-20 border-4 border-contourline-mediumBlue border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-contourline-lightBlue/30 rounded-full animate-pulse" aria-hidden="true"></div>
          </div>
          <span className="sr-only">Carregando...</span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-contourline-darkBlue font-heading font-medium text-xl">{message}</p>
          <p className="text-contourline-mediumBlue text-sm animate-pulse">{submessage}</p>
        </div>
      </div>
    </div>
  );
};
