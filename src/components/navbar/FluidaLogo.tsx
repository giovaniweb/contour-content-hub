
import React from "react";

interface FluidaLogoProps {
  logoUrl?: string;
  size?: number;
}

const FluidaLogo: React.FC<FluidaLogoProps> = ({ logoUrl, size = 34 }) => {
  // Se houver URL, mostra a logo. Senão, mostra fallback (ícone ou texto).
  return logoUrl ? (
    <img
      src={logoUrl}
      alt="Logo Fluida"
      style={{ width: size, height: size, borderRadius: 8, objectFit: "contain" }}
      className="bg-white shadow-md"
    />
  ) : (
    <div
      className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl"
      style={{ width: size, height: size, borderRadius: 8 }}
    >
      F
    </div>
  );
};

export default FluidaLogo;
