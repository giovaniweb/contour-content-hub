
import React from 'react';
import QuickAccessCard from './QuickAccessCard';
import { FileText, Video, ListTodo, Settings, CalendarDays, Film, Lightbulb } from 'lucide-react';

const QuickAccessGrid: React.FC = () => {
  const quickAccessItems = [
    {
      title: 'Roteiros',
      description: 'Crie e gerencie roteiros personalizados para seus vídeos',
      icon: FileText,
      iconColor: 'text-blue-500',
      linkTo: '/custom-gpt',
      linkText: 'Acessar Roteiros'
    },
    {
      title: 'Biblioteca de Vídeos',
      description: 'Acesse sua coleção de vídeos e gerencie seu conteúdo',
      icon: Video,
      iconColor: 'text-purple-500',
      linkTo: '/video-storage',
      linkText: 'Acessar Vídeos'
    },
    {
      title: 'Estratégia de Conteúdo',
      description: 'Planeje e organize suas estratégias de marketing',
      icon: ListTodo,
      iconColor: 'text-green-500',
      linkTo: '/content-strategy',
      linkText: 'Acessar Estratégias'
    },
    {
      title: 'Equipamentos',
      description: 'Gerencie seus equipamentos e tecnologias',
      icon: Settings,
      iconColor: 'text-amber-500',
      linkTo: '/equipments',
      linkText: 'Gerenciar Equipamentos'
    },
    {
      title: 'Agenda',
      description: 'Gerencie seu calendário e agendamentos',
      icon: CalendarDays,
      iconColor: 'text-red-500',
      linkTo: '/calendar',
      linkText: 'Acessar Agenda'
    },
    {
      title: 'Mídia',
      description: 'Gerencie sua biblioteca de mídia e arquivos',
      icon: Film,
      iconColor: 'text-indigo-500',
      linkTo: '/media',
      linkText: 'Acessar Mídia'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-amber-500" />
        Acesso rápido
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
