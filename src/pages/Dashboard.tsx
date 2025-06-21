
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  FileText, 
  Video, 
  Calendar, 
  Lightbulb, 
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Wrench
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: FileText,
      title: "Criar Roteiro",
      description: "Gere roteiros emocionais com IA",
      path: ROUTES.CONTENT.SCRIPTS.GENERATOR,
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Video,
      title: "Novo Vídeo",
      description: "Crie conteúdo visual impactante",
      path: ROUTES.VIDEOS.CREATE,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Planejar Conteúdo",
      description: "Organize sua estratégia",
      path: ROUTES.CONTENT.PLANNER,
      gradient: "from-cyan-500 to-green-500"
    },
    {
      icon: Wrench,
      title: "Ver Equipamentos",
      description: "Explore equipamentos disponíveis",
      path: ROUTES.EQUIPMENTS.LIST,
      gradient: "from-green-500 to-yellow-500"
    }
  ];

  const stats = [
    { icon: TrendingUp, label: "Crescimento", value: "+24%", color: "text-emerald-400" },
    { icon: Users, label: "Engajamento", value: "8.2k", color: "text-cyan-400" },
    { icon: Heart, label: "Conexão Emocional", value: "9.1/10", color: "text-pink-400" },
    { icon: Zap, label: "Produtividade", value: "+45%", color: "text-blue-400" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">      
      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
            Crie conteúdo{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-medium">
              mágico
            </span>
          </h1>
          
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Transforme suas ideias em conteúdo que conecta emocionalmente com seu público
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-light text-white mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer text-center p-6 h-full hover:shadow-lg transition-all duration-300 aurora-glass-enhanced aurora-border-enhanced"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 aurora-glass-enhanced aurora-border-enhanced">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-medium text-white">
                Suas Estatísticas Mágicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center py-12"
        >
          <Card className="p-8 max-w-2xl mx-auto aurora-glass-enhanced aurora-border-enhanced">
            <CardContent className="p-0">
              <h2 className="text-2xl font-medium text-white mb-4">
                Pronto para criar algo{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">incrível</span>?
              </h2>
              <p className="text-white/70 mb-6">
                Comece agora e veja como a IA pode transformar sua criatividade
              </p>
              <Button 
                size="lg"
                onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Começar a Criar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
