
import React from 'react';
import { motion } from 'framer-motion';
import AuroraLayout from '@/components/layout/AuroraLayout';
import AuroraCard from '@/components/ui/AuroraCard';
import AuroraButton from '@/components/ui/AuroraButton';
import GlassContainer from '@/components/ui/GlassContainer';
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
  Zap
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
      gradient: "from-aurora-electric-purple to-aurora-neon-blue"
    },
    {
      icon: Video,
      title: "Novo Vídeo",
      description: "Crie conteúdo visual impactante",
      path: ROUTES.VIDEOS.CREATE,
      gradient: "from-aurora-neon-blue to-aurora-cyan"
    },
    {
      icon: Calendar,
      title: "Planejar Conteúdo",
      description: "Organize sua estratégia",
      path: ROUTES.CONTENT.PLANNER,
      gradient: "from-aurora-cyan to-aurora-emerald"
    },
    {
      icon: Lightbulb,
      title: "Gerar Ideias",
      description: "Inspire-se com IA criativa",
      path: ROUTES.CONTENT.IDEAS,
      gradient: "from-aurora-emerald to-aurora-lime"
    }
  ];

  const stats = [
    { icon: TrendingUp, label: "Crescimento", value: "+24%", color: "text-aurora-emerald" },
    { icon: Users, label: "Engajamento", value: "8.2k", color: "text-aurora-cyan" },
    { icon: Heart, label: "Conexão Emocional", value: "9.1/10", color: "text-aurora-soft-pink" },
    { icon: Zap, label: "Produtividade", value: "+45%", color: "text-aurora-electric-blue" }
  ];

  return (
    <AuroraLayout 
      title="Dashboard Mágico" 
      subtitle="Bem-vindo ao seu universo criativo"
    >
      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-aurora-electric-purple via-aurora-neon-blue to-aurora-cyan flex items-center justify-center"
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
          
          <h1 className="aurora-heading text-4xl md:text-6xl font-light text-white mb-4">
            Crie conteúdo{' '}
            <span className="aurora-text-gradient font-medium">
              mágico
            </span>
          </h1>
          
          <p className="aurora-body text-white/80 text-xl max-w-2xl mx-auto">
            Transforme suas ideias em conteúdo que conecta emocionalmente com seu público
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="aurora-heading text-2xl font-light text-white mb-6">
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
                <AuroraCard 
                  floating
                  onClick={() => navigate(action.path)}
                  className="cursor-pointer text-center p-6 h-full"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="aurora-heading text-lg font-medium text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="aurora-body text-white/70 text-sm">
                    {action.description}
                  </p>
                </AuroraCard>
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
          <GlassContainer aurora className="p-6">
            <h2 className="aurora-heading text-xl font-medium text-white mb-6">
              Suas Estatísticas Mágicas
            </h2>
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
                  <div className="aurora-body text-white/70 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassContainer>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center py-12"
        >
          <AuroraCard className="p-8 max-w-2xl mx-auto">
            <h2 className="aurora-heading text-2xl font-medium text-white mb-4">
              Pronto para criar algo{' '}
              <span className="aurora-text-gradient">incrível</span>?
            </h2>
            <p className="aurora-body text-white/80 mb-6">
              Comece agora e veja como a IA pode transformar sua criatividade
            </p>
            <AuroraButton 
              size="lg"
              onClick={() => navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR)}
              confetti
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar a Criar
            </AuroraButton>
          </AuroraCard>
        </motion.div>
      </div>
    </AuroraLayout>
  );
};

export default Dashboard;
