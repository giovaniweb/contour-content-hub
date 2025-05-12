
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import { motion } from "framer-motion";

const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-lavender-gradient text-gray-800 py-24">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-light mb-6">
          Pronto para transformar sua produção de conteúdo?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600">
          Junte-se a milhares de criadores que já estão economizando tempo e criando conteúdo de maior qualidade.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg"
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-lg px-10 py-6 bg-fluida-blue hover:bg-fluida-blueDark text-white shadow-md hover:shadow-lg"
          >
            Começar agora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
