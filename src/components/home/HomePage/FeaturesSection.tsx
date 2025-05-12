
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-sm hover:shadow-[0_0_15px_rgba(0,148,251,0.15)] transition-all hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
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
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recursos poderosos para criadores de conteúdo</h2>
        
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
