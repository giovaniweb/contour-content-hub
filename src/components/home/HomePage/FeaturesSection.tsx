
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import GlassContainer from "@/components/ui/GlassContainer";
import { FileText, Video, BarChart3 } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, path }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <GlassContainer className="h-full">
        <div className="flex flex-col gap-2 p-4">
          <div className="text-4xl mb-3 text-primary flex items-center">
            {icon}
          </div>
          <h3 className="text-xl font-medium mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Gerador de Roteiros",
      description: "Crie roteiros profissionais para seus vídeos em minutos, com sugestões inteligentes baseadas no seu objetivo.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      path: ROUTES.CONTENT.SCRIPTS.GENERATOR
    },
    {
      title: "Biblioteca de Vídeos",
      description: "Organize e acesse facilmente todos os seus vídeos e materiais de referência em um só lugar.",
      icon: <Video className="h-8 w-8 text-primary" />,
      path: ROUTES.VIDEOS.ROOT
    },
    {
      title: "Estratégia de Conteúdo",
      description: "Desenvolva estratégias completas de conteúdo com sugestões personalizadas para seu público.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      path: ROUTES.CONTENT.STRATEGY
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-16 tracking-wide text-gray-800">
          Recursos poderosos para criadores de conteúdo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
