
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";

const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar sua produção de conteúdo?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de criadores que já estão economizando tempo e criando conteúdo de maior qualidade.
        </p>
        <Button 
          size="lg"
          variant="secondary" 
          onClick={() => navigate(ROUTES.REGISTER)}
          className="text-lg px-8 bg-white text-blue-600 hover:bg-blue-50"
        >
          Começar agora
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
