
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Video, Image, Pen, FileImage, Users, BarChart2, Import } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

const FeaturedIcons: React.FC = () => {
  const { user, isLoading } = useUser();
  const isAdmin = user?.app_metadata?.role === 'admin';
  
  // Ícones principais disponíveis para todos os usuários
  const mainIcons = [
    {
      title: "Vídeos",
      description: "Conteúdo em vídeo para suas redes",
      icon: <Video className="h-8 w-8 text-blue-400" />,
      color: "bg-blue-100/20 hover:bg-blue-100/30 group-hover:shadow-blue-400/40",
      link: ROUTES.VIDEOS.ROOT
    },
    {
      title: "Fotos",
      description: "Banco de imagens profissionais",
      icon: <FileImage className="h-8 w-8 text-purple-400" />,
      color: "bg-purple-100/20 hover:bg-purple-100/30 group-hover:shadow-purple-400/40",
      link: "/fotos"
    },
    {
      title: "Ilustrações",
      description: "Artes digitais para publicações",
      icon: <Pen className="h-8 w-8 text-pink-400" />,
      color: "bg-pink-100/20 hover:bg-pink-100/30 group-hover:shadow-pink-400/40",
      link: "/ilustracoes"
    },
    {
      title: "Vetores",
      description: "Gráficos e elementos vetoriais",
      icon: <Image className="h-8 w-8 text-green-400" />,
      color: "bg-green-100/20 hover:bg-green-100/30 group-hover:shadow-green-400/40",
      link: "/vetores"
    }
  ];
  
  // Ícones específicos para administradores
  const adminIcons = [
    {
      title: "Importar vídeos",
      description: "Adicionar novos conteúdos",
      icon: <Import className="h-8 w-8 text-amber-400" />,
      color: "bg-amber-100/20 hover:bg-amber-100/30 border-amber-400/30 group-hover:shadow-amber-400/40",
      link: ROUTES.VIDEOS.BATCH_IMPORT,
      isAdmin: true
    },
    {
      title: "Gerenciar usuários",
      description: "Controle de acesso",
      icon: <Users className="h-8 w-8 text-cyan-400" />,
      color: "bg-cyan-100/20 hover:bg-cyan-100/30 border-cyan-400/30 group-hover:shadow-cyan-400/40",
      link: ROUTES.WORKSPACE_SETTINGS,
      isAdmin: true
    },
    {
      title: "Relatórios de uso",
      description: "Análise de performance",
      icon: <BarChart2 className="h-8 w-8 text-rose-400" />,
      color: "bg-rose-100/20 hover:bg-rose-100/30 border-rose-400/30 group-hover:shadow-rose-400/40",
      link: ROUTES.REPORTS,
      isAdmin: true
    }
  ];
  
  // Escolher quais ícones exibir com base no papel do usuário
  const icons = [...mainIcons, ...(isAdmin ? adminIcons : [])];
  
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
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
              block group p-5 rounded-xl border border-white/10 
              transition-all duration-300 hover:-translate-y-1 
              ${iconData.color}
              ${iconData.isAdmin ? 'border-dashed border-2' : ''}
              hover:shadow-lg backdrop-blur-sm
            `}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex items-center justify-center bg-white/10 w-16 h-16 rounded-full">
                {iconData.icon}
              </div>
              <h3 className="font-semibold text-white">{iconData.title}</h3>
              <p className="text-xs text-white/70 mt-1">
                {iconData.description}
              </p>
              
              {iconData.isAdmin && (
                <span className="mt-2 px-2 py-0.5 text-xs bg-white/20 rounded-full text-white">
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
