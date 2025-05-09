
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const CustomGpt: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionar para a página do gerador de roteiros moderna
    navigate("/script-generator");
  }, [navigate]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-fluida-blue animate-spin" />
        <p className="text-lg text-gray-600">Redirecionando para o gerador de roteiros...</p>
      </div>
    </div>
  );
};

export default CustomGpt;
