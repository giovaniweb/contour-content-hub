
import React from 'react';
import { motion } from 'framer-motion';
import { FileVideo, BookOpenCheck, FileText, Images, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { Card, CardContent } from '@/components/ui/card';

const QuickAccessGrid: React.FC = () => {
  const categories = [
    {
      title: "Vídeos populares",
      description: "Acesse demonstrações, tutoriais e casos reais",
      icon: <FileVideo className="h-6 w-6 text-fluida-blue" />,
      link: ROUTES.VIDEOS.ROOT,
      color: "bg-blue-50 group-hover:bg-blue-100"
    },
    {
      title: "Roteiros em alta",
      description: "Os tópicos mais requisitados do momento",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      link: ROUTES.CONTENT.SCRIPTS.GENERATOR,
      color: "bg-green-50 group-hover:bg-green-100"
    },
    {
      title: "Templates prontos",
      description: "Comece rapidamente com modelos profissionais",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      link: ROUTES.CONTENT.PLANNER,
      color: "bg-purple-50 group-hover:bg-purple-100"
    },
    {
      title: "Artigos científicos",
      description: "Evidências e pesquisas para embasar conteúdos",
      icon: <BookOpenCheck className="h-6 w-6 text-amber-600" />,
      link: ROUTES.SCIENTIFIC_ARTICLES,
      color: "bg-amber-50 group-hover:bg-amber-100"
    },
    {
      title: "Arquivos e fotos",
      description: "Imagens profissionais para suas publicações",
      icon: <Images className="h-6 w-6 text-rose-600" />,
      link: ROUTES.MEDIA,
      color: "bg-rose-50 group-hover:bg-rose-100"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Acesso Rápido</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((category, i) => (
          <motion.div
            key={category.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link to={category.link} className="block h-full">
              <Card className="border group hover:shadow-md transition-all duration-300 h-full hover:border-fluida-blue/30 overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="flex flex-col h-full">
                    <div className={`${category.color} p-6 transition-colors duration-300`}>
                      {category.icon}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                      <div className="mt-auto pt-4">
                        <span className="text-fluida-blue text-sm font-medium flex items-center gap-1">
                          Explorar
                          <motion.span 
                            className="inline-block"
                            initial={{ x: 0 }}
                            whileHover={{ x: 3 }}
                          >
                            →
                          </motion.span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
