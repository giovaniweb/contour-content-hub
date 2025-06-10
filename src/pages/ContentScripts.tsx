
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'review': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
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
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="aurora-heading text-3xl font-bold mb-2">Roteiros Mágicos</h1>
        <p className="aurora-body">Crie conteúdo que conecta e emociona seu público</p>
      </motion.div>

      {/* Main Action Button */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Button
          onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
          className="aurora-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg font-semibold aurora-glow"
          size="lg"
        >
          <Wand2 className="h-6 w-6 mr-3 aurora-pulse" />
          Gerar Novo Roteiro FLUIDA
        </Button>
      </motion.div>

      {/* Scripts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="aurora-card border-2 relative overflow-hidden">
          <div className="absolute inset-0 aurora-gradient-bg opacity-5 pointer-events-none" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="aurora-text-gradient text-2xl">
                Seus Roteiros
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="aurora-glass border-purple-300/30 hover:border-purple-400/50 cursor-pointer transition-all backdrop-blur-sm">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(script.status)}
                          <div>
                            <h3 className="aurora-accent font-medium text-base">
                              {script.title}
                            </h3>
                            <p className="aurora-body text-sm opacity-80">
                              {script.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="aurora-body text-xs">
                            {getStatusText(script.status)}
                          </span>
                          <p className="aurora-body text-xs opacity-70">
                            {script.created}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContentScripts;
