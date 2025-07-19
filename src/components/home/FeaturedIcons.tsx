
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Video, Image, Pen, FileImage, Users, BarChart2, Import } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { usePermissions } from '@/hooks/use-permissions';

const FeaturedIcons: React.FC = () => {
  const { user, isLoading } = useUser();
  const { isAdmin } = usePermissions();
  
  // Define an interface for our icon items to ensure type safety
  interface IconItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    link: string;
    isAdmin?: boolean;
  }
  
  // Ícones principais disponíveis para todos os usuários
  const mainIcons: IconItem[] = [
    {
      title: "Vídeos",
      description: "Conteúdo em vídeo para suas redes",
      icon: <Video className="h-8 w-8 text-blue-500" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      link: ROUTES.VIDEOS.ROOT
    },
    {
      title: "Fotos",
      description: "Banco de imagens profissionais",
      icon: <FileImage className="h-8 w-8 text-purple-500" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      link: "/fotos"
    },
    {
      title: "Ilustrações",
      description: "Artes digitais para publicações",
      icon: <Pen className="h-8 w-8 text-pink-500" />,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      link: "/ilustracoes"
    },
    {
      title: "Vetores",
      description: "Gráficos e elementos vetoriais",
      icon: <Image className="h-8 w-8 text-green-500" />,
      color: "text-green-500",
      bgColor: "bg-green-50",
      link: "/vetores"
    }
  ];
  
  // Ícones específicos para administradores
  const adminIcons: IconItem[] = [
    {
      title: "Importar vídeos",
      description: "Adicionar novos conteúdos",
      icon: <Import className="h-8 w-8 text-amber-500" />,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      link: ROUTES.ADMIN_VIDEOS.IMPORT,
      isAdmin: true
    },
    {
      title: "Gerenciar usuários",
      description: "Controle de acesso",
      icon: <Users className="h-8 w-8 text-cyan-500" />,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      link: ROUTES.WORKSPACE_SETTINGS,
      isAdmin: true
    },
    {
      title: "Relatórios de uso",
      description: "Análise de performance",
      icon: <BarChart2 className="h-8 w-8 text-rose-500" />,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      link: ROUTES.MARKETING.REPORTS,
      isAdmin: true
    }
  ];
  
  // Escolher quais ícones exibir com base no papel do usuário
  const icons = [...mainIcons, ...(isAdmin() ? adminIcons : [])];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {icons.map((iconData, i) => (
        <motion.div key={iconData.title} variants={item}>
          <Link 
            to={iconData.link} 
            className={`
              block p-6 rounded-xl border border-gray-100 bg-white
              transition-all duration-300 hover:-translate-y-2 hover:shadow-md
              ${iconData.isAdmin ? 'border-dashed border' : ''}
            `}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div 
                className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full ${iconData.bgColor}`}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                {iconData.icon}
              </motion.div>
              <h3 className="font-medium text-gray-800">{iconData.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {iconData.description}
              </p>
              
              {iconData.isAdmin && (
                <span className="mt-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600">
                  Admin
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedIcons;
