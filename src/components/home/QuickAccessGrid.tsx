
import React from 'react';
import { FileVideo, BookOpen, BookOpenCheck, FileText, Images } from 'lucide-react';
import QuickAccessCard from './QuickAccessCard';
import { layouts } from '@/lib/design-system';

const QuickAccessGrid: React.FC = () => {
  const quickAccessItems = [
    {
      title: "Biblioteca de Vídeos",
      description: "Acesse demonstrações, tutoriais e casos reais de tratamentos",
      icon: FileVideo,
      iconColor: "text-blue-600",
      linkTo: "/videos",
      linkText: "Ver Vídeos"
    },
    {
      title: "Artigos Científicos",
      description: "Estudos, papers e evidências sobre tratamentos e tecnologias",
      icon: BookOpenCheck,
      iconColor: "text-green-600",
      linkTo: "/articles",
      linkText: "Ler Artigos"
    },
    {
      title: "Gerador de Roteiros",
      description: "Crie facilmente roteiros para seus vídeos de conteúdo",
      icon: FileText,
      iconColor: "text-purple-600",
      linkTo: "/script-generator",
      linkText: "Criar Roteiro"
    },
    {
      title: "Banco de Imagens",
      description: "Imagens profissionais para usar em suas publicações",
      icon: Images,
      iconColor: "text-amber-600",
      linkTo: "/media-library",
      linkText: "Explorar Imagens"
    }
  ];

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
      <div className={layouts.cardGrid}>
        {quickAccessItems.map((item, index) => (
          <QuickAccessCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            iconColor={item.iconColor}
            linkTo={item.linkTo}
            linkText={item.linkText}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
