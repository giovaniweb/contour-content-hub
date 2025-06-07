
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Palette, Users, BarChart3 } from 'lucide-react';
import AuroraButton from '@/components/ui/AuroraButton';
import AuroraCard from '@/components/ui/AuroraCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ViteStyleHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: Zap,
      title: "IA Criativa",
      description: "Gere roteiros emocionais e conteúdo personalizado com nossa inteligência artificial avançada.",
      color: "from-aurora-electric-blue to-aurora-turquoise"
    },
    {
      icon: Palette,
      title: "Design Emocional",
      description: "Interface inspirada na Aurora Boreal que se adapta ao seu estado emocional e criativo.",
      color: "from-aurora-lavender to-aurora-soft-pink"
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com outros profissionais e compartilhe estratégias de conteúdo vencedoras.",
      color: "from-aurora-teal to-aurora-deep-violet"
    },
    {
      icon: BarChart3,
      title: "Analytics Inteligente",
      description: "Acompanhe o desempenho do seu conteúdo com insights baseados em inteligência emocional.",
      color: "from-aurora-soft-pink to-aurora-electric-blue"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #C4B5FD 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between p-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-aurora-lavender to-aurora-teal"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">Fluida</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Recursos</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">Sobre</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Preços</a>
            <AuroraButton 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              Entrar
            </AuroraButton>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          className="text-center py-20 px-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="mb-8"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-aurora-lavender via-aurora-teal to-aurora-electric-blue flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Crie conteúdo{' '}
            <span className="bg-gradient-to-r from-aurora-lavender via-aurora-teal to-aurora-electric-blue bg-clip-text text-transparent">
              mágico
            </span>
            {' '}para clínicas estéticas
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforme sua comunicação com IA emocional, roteiros personalizados e estratégias de conteúdo que realmente conectam com seu público.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <AuroraButton
              size="lg"
              onClick={handleGetStarted}
              className="min-w-[200px]"
            >
              Começar gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </AuroraButton>
            
            <AuroraButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="min-w-[200px]"
            >
              Ver demonstração
            </AuroraButton>
          </div>

          <div className="mt-16 text-white/60">
            <p className="mb-4">Usado por +1000 profissionais de estética</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="w-20 h-8 bg-white/10 rounded"></div>
              <div className="w-20 h-8 bg-white/10 rounded"></div>
              <div className="w-20 h-8 bg-white/10 rounded"></div>
              <div className="w-20 h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Recursos que fazem a{' '}
              <span className="bg-gradient-to-r from-aurora-soft-pink to-aurora-electric-blue bg-clip-text text-transparent">
                diferença
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Ferramentas pensadas especificamente para profissionais de estética que querem se destacar no digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AuroraCard className="h-full text-center p-8">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </AuroraCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para transformar seu{' '}
              <span className="bg-gradient-to-r from-aurora-lavender to-aurora-teal bg-clip-text text-transparent">
                conteúdo
              </span>
              ?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já estão criando conteúdo mais efetivo e emocionalmente conectado.
            </p>
            
            <AuroraButton
              size="lg"
              onClick={handleGetStarted}
              confetti
              className="min-w-[250px] text-lg"
            >
              Começar agora mesmo
              <ArrowRight className="ml-2 w-6 h-6" />
            </AuroraButton>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-aurora-lavender to-aurora-teal">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Fluida</span>
            </div>
            <p className="text-white/60">
              © 2024 Fluida. Transformando a comunicação de clínicas estéticas com IA emocional.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ViteStyleHome;
