
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, CheckCircle, PlayCircle, Plus, Zap, Sparkles, Bot } from 'lucide-react';
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

      {/* Dual Mode Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Modo Chat Rápido */}
        <Card className="aurora-card border-2 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 aurora-glow">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="aurora-text-gradient text-2xl mb-2">
              Modo Chat Rápido
            </CardTitle>
            <p className="aurora-body text-sm opacity-80">
              Geração direta e eficiente com opções predefinidas
            </p>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="aurora-body text-sm">Objetivos pré-definidos (Vender, Atrair, Melhorar marca)</span>
              </div>
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="aurora-body text-sm">Campos abertos para personalização</span>
              </div>
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="aurora-body text-sm">Resultado em até 30 segundos</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
              className="w-full aurora-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              Criar Roteiro Rápido
            </Button>
          </CardContent>
        </Card>

        {/* Modo FluiA Akinator */}
        <Card className="aurora-card border-2 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="flex justify-center mb-4">
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 aurora-glow"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <CardTitle className="aurora-text-gradient text-2xl mb-2">
              Modo FluiA Akinator
            </CardTitle>
            <p className="aurora-body text-sm opacity-80">
              Experiência imersiva e divertida de criação
            </p>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="aurora-body text-sm">FluiA "adivinha" seu objetivo perfeito</span>
              </div>
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                <span className="aurora-body text-sm">Experiência interativa e divertida</span>
              </div>
              <div className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="aurora-body text-sm">Deixe sua criatividade fluir naturalmente</span>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/content/scripts/fluia-akinator')}
              className="w-full aurora-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2 aurora-pulse" />
              Deixar FluiA Adivinhar
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center p-6 aurora-glass rounded-xl border"
      >
        <h3 className="aurora-accent text-lg font-semibold mb-2">
          ✨ Ambos os caminhos levam ao mesmo destino mágico
        </h3>
        <p className="aurora-body text-sm opacity-80">
          Independente da sua escolha, você terá acesso ao FluiA Encantador e todas as funcionalidades avançadas
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
