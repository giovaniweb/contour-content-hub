
import React from 'react';

interface FluidaLogoProps {
  logoUrl?: string;
  size?: number;
}

const FluidaLogo: React.FC<FluidaLogoProps> = ({ logoUrl, size = 36 }) => {
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt="Fluida Logo" 
        style={{ width: size, height: size }}
        className="object-contain"
      />
    );
  }

  return (
    <div 
      style={{ width: size, height: size }}
      className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"
    >
      <span className="text-white font-bold text-lg">F</span>
    </div>
  );
};

export default FluidaLogo;
