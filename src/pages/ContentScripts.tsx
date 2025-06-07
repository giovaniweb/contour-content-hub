
import React from 'react';
import { motion } from 'framer-motion';
import AuroraLayout from '@/components/layout/AuroraLayout';
import AuroraCard from '@/components/ui/AuroraCard';
import AuroraButton from '@/components/ui/AuroraButton';
import GlassContainer from '@/components/ui/GlassContainer';
import { FileText, Wand2, CheckCircle, PlayCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

const ContentScripts: React.FC = () => {
  const navigate = useNavigate();

  const scripts = [
    {
      id: 1,
      title: "Roteiro: Skincare Matinal",
      description: "Passo a passo para cuidados com a pele pela manhã",
      status: "completed",
      emotion: 8,
      created: "2 dias atrás"
    },
    {
      id: 2,
      title: "Como escolher o protetor solar ideal",
      description: "Dicas personalizadas baseadas no tipo de pele",
      status: "draft",
      emotion: 6,
      created: "1 semana atrás"
    },
    {
      id: 3,
      title: "Maquiagem natural para o dia a dia",
      description: "Tutorial simples e elegante",
      status: "review",
      emotion: 9,
      created: "3 dias atrás"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-aurora-teal" />;
      case 'review': return <PlayCircle className="w-4 h-4 text-aurora-soft-pink" />;
      default: return <FileText className="w-4 h-4 text-aurora-lavender" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'review': return 'Em revisão';
      default: return 'Rascunho';
    }
  };

  return (
    <AuroraLayout 
      title="Roteiros Mágicos" 
      subtitle="Crie conteúdo que conecta e emociona seu público"
    >
      <div className="p-6">
        {/* Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-lavender to-aurora-teal mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Wand2 className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="aurora-heading text-lg font-medium text-white mb-2">
                Gerar Roteiro
              </h3>
              <p className="aurora-body text-white/70">
                Crie roteiros emocionais com IA
              </p>
            </AuroraCard>

            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.VALIDATION)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-turquoise mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="aurora-heading text-lg font-medium text-white mb-2">
                Validar Conteúdo
              </h3>
              <p className="aurora-body text-white/70">
                Analise o impacto emocional
              </p>
            </AuroraCard>

            <AuroraCard 
              floating
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-deep-violet to-aurora-soft-pink mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Plus className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="aurora-heading text-lg font-medium text-white mb-2">
                Template Customizado
              </h3>
              <p className="aurora-body text-white/70">
                Crie modelos personalizados
              </p>
            </AuroraCard>
          </div>
        </motion.div>

        {/* Scripts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassContainer aurora className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="aurora-heading text-xl font-medium text-white">
                Seus Roteiros
              </h2>
              <AuroraButton onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Roteiro
              </AuroraButton>
            </div>

            <div className="space-y-4">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AuroraCard className="p-4 hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(script.status)}
                        <div>
                          <h3 className="aurora-body font-medium text-white">
                            {script.title}
                          </h3>
                          <p className="aurora-body text-white/70 text-sm">
                            {script.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="aurora-body text-white/60 text-xs">
                          {getStatusText(script.status)}
                        </span>
                        <p className="aurora-body text-white/50 text-xs">
                          {script.created}
                        </p>
                      </div>
                    </div>
                  </AuroraCard>
                </motion.div>
              ))}
            </div>
          </GlassContainer>
        </motion.div>
      </div>
    </AuroraLayout>
  );
};

export default ContentScripts;
