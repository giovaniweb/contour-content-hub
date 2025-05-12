
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
    <section className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white hero-neon-text">
          Seu estúdio criativo em um clique
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white hero-neon-text">
          Crie roteiros, estratégias e conteúdos para mídias digitais com inteligência artificial
        </p>
        
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
    </section>
  );
};

export default HeroSection;
