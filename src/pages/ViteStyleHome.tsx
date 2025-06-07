
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  Video, 
  FileText, 
  Calendar, 
  Lightbulb,
  ArrowRight,
  Play,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const ViteStyleHome: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Roteiros com IA",
      description: "Gere roteiros emocionais que conectam com seu público usando inteligência artificial avançada."
    },
    {
      icon: Video,
      title: "Criação de Vídeos",
      description: "Crie conteúdo visual impactante com ferramentas profissionais e templates personalizáveis."
    },
    {
      icon: Calendar,
      title: "Planejamento Estratégico",
      description: "Organize sua estratégia de conteúdo com calendário inteligente e insights de performance."
    },
    {
      icon: Lightbulb,
      title: "Gerador de Ideias",
      description: "Nunca fique sem inspiração com nosso gerador inteligente de ideias criativas."
    }
  ];

  return (
    <div className="min-h-screen aurora-dark-bg">
      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-aurora-electric-purple" />
            <h1 className="aurora-heading text-2xl font-bold text-white">Fluida</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="aurora-button">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="aurora-heading text-5xl md:text-7xl font-light text-white mb-6">
              Crie conteúdo{' '}
              <span className="aurora-text-gradient font-medium">
                mágico
              </span>
            </h1>
            <p className="aurora-body text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Transforme suas ideias em conteúdo que conecta emocionalmente com seu público. 
              Use o poder da IA para criar roteiros, vídeos e estratégias que convertem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="aurora-button">
                  <Play className="w-5 h-5 mr-2" />
                  Começar Gratuitamente
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Zap className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="aurora-heading text-4xl font-light text-white mb-4">
              Funcionalidades{' '}
              <span className="aurora-text-gradient">Poderosas</span>
            </h2>
            <p className="aurora-body text-white/70 text-lg max-w-2xl mx-auto">
              Tudo que você precisa para criar, planejar e otimizar seu conteúdo em uma plataforma única.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="aurora-glass border-aurora-electric-purple/20 h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="aurora-heading text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="aurora-body text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Card className="aurora-glass border-aurora-electric-purple/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="aurora-heading text-3xl font-medium text-white mb-4">
                  Pronto para começar sua{' '}
                  <span className="aurora-text-gradient">jornada criativa</span>?
                </h2>
                <p className="aurora-body text-white/80 mb-6">
                  Junte-se a milhares de criadores que já transformaram seu conteúdo com nossa plataforma.
                </p>
                <Link to="/register">
                  <Button size="lg" className="aurora-button">
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="aurora-body text-white/60">
            © 2024 Fluida. Criando o futuro do conteúdo digital.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViteStyleHome;
