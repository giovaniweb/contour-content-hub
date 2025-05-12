
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import { FluidaInput } from "@/components/ui/fluida-input";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(ROUTES.DASHBOARD, { state: { query: inputValue } });
    }
  };
  
  const animatedPlaceholders = [
    "Crie estratégias para Instagram...",
    "Como criar conteúdo sobre emagrecimento...",
    "Roteiro para vídeo de 3 minutos...",
    "Ideias para campanha de lançamento...",
  ];
  
  return (
    <section className="relative bg-gradient-to-b from-purple-900 to-blue-900 py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fluida-blue rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-fluida-pink rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Transforme suas <span className="text-gradient">ideias</span> em conteúdo <br className="hidden md:block" />
          com o poder da <span className="text-gradient">Inteligência Artificial</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
          Crie roteiros, estratégias e materiais para suas redes sociais em minutos.
          Economize tempo e potencialize seus resultados.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative">
          <FluidaInput 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            animatedPlaceholder={animatedPlaceholders}
            className="py-6 px-6 text-lg shadow-xl"
            iconRight={
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-10 w-10 p-0 rounded-full bg-fluida-pink hover:bg-fluida-pink/80 text-white"
                onClick={handleSubmit}
              >
                <Send className="h-5 w-5" />
              </Button>
            }
          />
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
