
import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      whileHover={{ y: -5 }}
    >
      <div className="text-4xl mb-5 group-hover:animate-bounce-light transform transition-all duration-300 ease-in-out">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Gerador de Roteiros",
      description: "Crie roteiros profissionais para seus vídeos em minutos, com sugestões inteligentes baseadas no seu objetivo.",
      icon: "✍️"
    },
    {
      title: "Biblioteca de Vídeos",
      description: "Organize e acesse facilmente todos os seus vídeos e materiais de referência em um só lugar.",
      icon: "🎬"
    },
    {
      title: "Estratégia de Conteúdo",
      description: "Desenvolva estratégias completas de conteúdo com sugestões personalizadas para seu público.",
      icon: "📊"
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
