
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import AuroraCommandPalette from "@/components/AuroraCommandPalette";
import NeonTextEffect from "./NeonTextEffect";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCommandSubmit = (command: string) => {
    navigate(ROUTES.DASHBOARD, { state: { query: command } });
  };
  
  return (
    <section className="bg-lavender-gradient py-24 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fluida-blue rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-fluida-pink rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto text-center px-4">
        <h1 className="font-light text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-800 tracking-wide">
          Seu <span className="neon-highlight">estúdio criativo</span> em um clique
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600 leading-relaxed">
          Crie roteiros, estratégias e conteúdos para mídias digitais com inteligência artificial
        </p>
        
        <div className="max-w-2xl mx-auto hover-glow">
          <AuroraCommandPalette 
            onSubmit={handleCommandSubmit}
            suggestions={[
              "Crie roteiro para vídeo sobre rejuvenescimento facial",
              "Estratégias para Instagram sobre estética avançada",
              "Conteúdo para profissionais da medicina estética",
              "Ideias para promover tratamento de criolipólise",
              "Como criar conteúdo para atrair clientes de procedimentos estéticos",
            ]}
            showHistory={false}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
