
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Wand2, CheckCircle, PlayCircle, Plus, Sparkles, Castle, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

const ContentScripts: React.FC = () => {
  const navigate = useNavigate();
  
  const scripts = [{
    id: 1,
    title: "Roteiro: Skincare Matinal",
    description: "Passo a passo para cuidados com a pele pela manhã",
    status: "completed",
    emotion: 8,
    created: "2 dias atrás"
  }, {
    id: 2,
    title: "Como escolher o protetor solar ideal",
    description: "Dicas personalizadas baseadas no tipo de pele",
    status: "draft",
    emotion: 6,
    created: "1 semana atrás"
  }, {
    id: 3,
    title: "Maquiagem natural para o dia a dia",
    description: "Tutorial simples e elegante",
    status: "review",
    emotion: 9,
    created: "3 dias atrás"
  }];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'review':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'review':
        return 'Em revisão';
      default:
        return 'Rascunho';
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
        <h1 className="aurora-heading text-3xl font-bold mb-2 text-slate-50">Roteiros Mágicos</h1>
        <p className="aurora-body">Crie conteúdo que conecta e emociona seu público</p>
      </motion.div>

      {/* FluiA Encantador Promotional Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
          {/* Partículas de fundo */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                      ✨ FluiA Encantador ✨
                    </h2>
                    <Badge variant="outline" className="mt-1 bg-purple-100 text-purple-700 border-purple-300">
                      <Star className="h-3 w-3 mr-1" />
                      Nova Funcionalidade Mágica!
                    </Badge>
                  </div>
                </div>
                
                <p className="text-purple-700 text-lg mb-2 font-medium">
                  Transforme seus roteiros com a magia Disney! 🏰
                </p>
                <p className="text-purple-600 mb-4">
                  Gere um roteiro → Aprove → Acesse o FluiA Encantador e deixe a metodologia Disney 1928 fazer sua história fluir como um conto de fadas!
                </p>
                
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <Castle className="h-4 w-4" />
                  <span>Era uma vez... até que um dia... então descobriu... e viveram felizes!</span>
                </div>
              </div>

              <div className="ml-6">
                <Button 
                  onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <Wand2 className="h-6 w-6 mr-3" />
                  Experimentar Agora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Action Button */}
      <motion.div 
        className="text-center" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)} 
          className="aurora-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg font-semibold aurora-glow" 
          size="lg"
        >
          <Wand2 className="h-6 w-6 mr-3 aurora-pulse" />
          Gerar Novo Roteiro FLUIDA
        </Button>
        <p className="text-sm text-slate-400 mt-2">
          💡 Após gerar e aprovar seu roteiro, você terá acesso ao FluiA Encantador!
        </p>
      </motion.div>

      {/* Scripts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
