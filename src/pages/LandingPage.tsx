import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Video, 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  Star,
  ChevronRight,
  Play,
  ArrowRight,
  Rocket,
  Trophy
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true });

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/');
  };

  const stats = [
    { value: '+850%', label: 'Eficiência na criação de conteúdo', icon: Zap },
    { value: '+340%', label: 'Engajamento nas redes sociais', icon: TrendingUp },
    { value: '+180%', label: 'Conversões em agendamentos', icon: Users },
    { value: '98%', label: 'Satisfação dos usuários', icon: Star }
  ];

  const features = [
    {
      title: 'Mestre da Beleza',
      description: 'IA especializada em análise de equipamentos e recomendações personalizadas',
      icon: Brain,
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      title: 'Fluida Roteirista',
      description: 'Geração automática de scripts personalizados para cada equipamento',
      icon: Video,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Consultor de Marketing',
      description: 'Estratégias baseadas em dados e tendências do mercado estético',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-aurora-space-black relative overflow-hidden">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-aurora-electric-purple/30 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-aurora-neon-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y3, opacity }}
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-aurora-emerald/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute bottom-0 right-0 w-64 h-64 bg-aurora-electric-purple/20 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 bg-aurora-space-black/80 backdrop-blur-md border-b border-aurora-electric-purple/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Fluida</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" onClick={handleLogin} className="text-white hover:bg-aurora-electric-purple/20">
            Entrar
          </Button>
          <Button onClick={handleGetStarted} className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:shadow-lg hover:shadow-aurora-electric-purple/25">
            Começar Agora
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Revolução no Marketing Médico
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 aurora-text-gradient leading-tight">
              A Primeira Plataforma
              <br />
              <span className="text-white">Verdadeiramente</span>
              <br />
              Inteligente
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
              Transforme sua clínica de estética em uma <span className="text-aurora-electric-purple font-semibold">máquina de conversão</span> 
              através da união perfeita entre ciência, tecnologia e criatividade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:shadow-xl hover:shadow-aurora-electric-purple/30 text-lg px-8 py-6"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-aurora-electric-purple mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🧠 3 Inteligências
              <br />
              <span className="aurora-text-gradient">Especializadas</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Cada IA foi treinada especificamente para uma função, garantindo expertise máxima em cada área do marketing médico.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-aurora-space-black/40 border-aurora-electric-purple/30 hover:border-aurora-electric-purple/60 transition-all duration-300 h-full group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-6 flex items-center text-aurora-electric-purple group-hover:text-aurora-neon-blue transition-colors">
                      <span className="text-sm font-medium">Saiba mais</span>
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section ref={statsRef} className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🏆 Resultados
              <br />
              <span className="aurora-text-gradient">Comprovados</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Nossos clientes experimentam transformações reais em seus negócios em questão de semanas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="bg-aurora-space-black/40 border-aurora-electric-purple/30 text-center p-8 hover:border-aurora-electric-purple/60 transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <stat.icon className="h-12 w-12 text-aurora-electric-purple mx-auto group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-aurora-electric-purple transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-white/70">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-aurora-electric-purple/20 via-aurora-neon-blue/20 to-aurora-emerald/20 rounded-3xl p-12 border border-aurora-electric-purple/30">
              <Trophy className="h-16 w-16 text-aurora-electric-purple mx-auto mb-6" />
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para Transformar
                <br />
                <span className="aurora-text-gradient">Sua Clínica?</span>
              </h2>
              
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Junte-se às centenas de clínicas que já descobriram o poder da Fluida. 
                Comece gratuitamente e veja os resultados em 30 dias.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:shadow-xl hover:shadow-aurora-electric-purple/30 text-lg px-8 py-6"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Começar Gratuitamente
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/institucional/contato')}
                  className="border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 text-lg px-8 py-6"
                >
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-aurora-electric-purple/20 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Fluida</span>
          </div>
          <p className="text-white/60 text-sm">
            © 2024 Fluida. Transformando o marketing médico através da inteligência artificial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;