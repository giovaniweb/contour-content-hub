
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Roteiros Mágicos</h1>
        <p className="text-muted-foreground">Crie conteúdo que conecta e emociona seu público</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer text-center p-6 hover:shadow-lg transition-all duration-300"
            onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
          >
            <CardContent className="p-0">
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Wand2 className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Gerar Roteiro
              </h3>
              <p className="text-muted-foreground">
                Crie roteiros emocionais com IA
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer text-center p-6 hover:shadow-lg transition-all duration-300"
            onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.VALIDATION)}
          >
            <CardContent className="p-0">
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Validar Conteúdo
              </h3>
              <p className="text-muted-foreground">
                Analise o impacto emocional
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer text-center p-6 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Plus className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Template Customizado
              </h3>
              <p className="text-muted-foreground">
                Crie modelos personalizados
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Scripts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium text-foreground">
                Seus Roteiros
              </CardTitle>
              <Button onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Roteiro
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-4">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(script.status)}
                        <div>
                          <h3 className="font-medium text-foreground">
                            {script.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {script.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs">
                          {getStatusText(script.status)}
                        </span>
                        <p className="text-muted-foreground text-xs">
                          {script.created}
                        </p>
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
