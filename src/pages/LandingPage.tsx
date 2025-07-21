import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Video, 
  TrendingUp, 
  Zap, 
  Users, 
  Star,
  Play,
  ArrowRight,
  Rocket,
  Trophy,
  Eye,
  Palette,
  Camera
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [featuredContent, setFeaturedContent] = useState({
    video: null as any,
    photo: null as any,
    art: null as any
  });
  const [contentCounts, setContentCounts] = useState({ videos: 0, photos: 0, arts: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Advanced parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.4, 0]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.6, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Fetch featured content
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        // Get counts
        const [videosCount, photosCount, artsCount] = await Promise.all([
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('equipment_photos').select('id', { count: 'exact', head: true }).eq('is_public', true),
          supabase.from('downloads_storage').select('id', { count: 'exact', head: true }).eq('status', 'active')
        ]);

        setContentCounts({
          videos: videosCount.count || 0,
          photos: photosCount.count || 0,
          arts: artsCount.count || 0
        });

        // Fetch one featured item from each category
        const [videoData, photoData, artData] = await Promise.all([
          supabase
            .from('videos')
            .select('id, titulo, thumbnail_url, url_video')
            .order('data_upload', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('equipment_photos')
            .select('id, title, thumbnail_url, image_url')
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('downloads_storage')
            .select('id, title, thumbnail_url, file_url')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        ]);

        setFeaturedContent({
          video: videoData.data,
          photo: photoData.data,
          art: artData.data
        });
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

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
      {/* Advanced Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Background Layer */}
        <motion.div
          style={{ 
            y: backgroundY, 
            opacity: opacity1,
            scale,
            x: useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-50, 50]),
            rotate: useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-10, 10])
          }}
          className="absolute -top-96 -left-96 w-[120vw] h-[120vh] bg-gradient-radial from-aurora-electric-purple/20 via-aurora-neon-blue/10 to-transparent rounded-full blur-3xl"
        />
        
        {/* Midground Layer */}
        <motion.div
          style={{ 
            y: midgroundY, 
            opacity: opacity2,
            x: useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [30, -30]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 180])
          }}
          className="absolute top-1/4 -right-48 w-[80vw] h-[80vh] bg-gradient-radial from-aurora-emerald/15 via-aurora-electric-purple/8 to-transparent rounded-full blur-2xl"
        />
        
        {/* Foreground Interactive Orbs */}
        <motion.div
          style={{ 
            y: foregroundY,
            x: useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-20, 20])
          }}
          className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-aurora-neon-blue/20 rounded-full blur-2xl"
        />
        
        {/* Rotating Aurora Ring */}
        <motion.div
          style={{ 
            rotate,
            scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.4])
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] border border-aurora-electric-purple/10 rounded-full"
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
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-aurora-electric-purple/20 to-aurora-neon-blue/20 text-white border-aurora-electric-purple/40 mb-8 px-6 py-2 text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                Revolução no Marketing Médico
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-[0.9] px-4 md:px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              A Primeira Plataforma
              <br />
              <motion.span 
                className="aurora-text-gradient inline-block"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Verdadeiramente
              </motion.span>
              <br />
              <motion.span 
                className="aurora-text-gradient inline-block"
                initial={{ backgroundPosition: "100% 50%" }}
                animate={{ backgroundPosition: "0% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Inteligente
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-5xl mx-auto leading-relaxed mb-12 px-4 md:px-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Transforme sua clínica de estética em uma{' '}
              <span className="text-aurora-electric-purple font-semibold">máquina de conversão</span>{' '}
              através da união perfeita entre ciência, tecnologia e criatividade.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:shadow-2xl hover:shadow-aurora-electric-purple/40 text-xl px-12 py-8 rounded-2xl group"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-aurora-electric-purple/40 text-white hover:bg-aurora-electric-purple/20 text-xl px-12 py-8 rounded-2xl backdrop-blur-sm"
              >
                <Play className="mr-3 h-6 w-6" />
                Ver Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Stats with Enhanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-4xl md:text-6xl font-bold text-white mb-3 group-hover:text-aurora-electric-purple transition-colors duration-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 1.8 + (index * 0.1) 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/80 text-base md:text-lg font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Advanced Parallax */}
      <section className="relative z-10 py-40 px-6">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0.2, 0.6], [50, -50]) }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight px-4 md:px-8">
              🧠 3 Inteligências
              <br />
              <span className="aurora-text-gradient">Especializadas</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4 md:px-8">
              Cada IA foi treinada especificamente para uma função, garantindo expertise máxima em cada área do marketing médico.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="bg-gradient-to-br from-aurora-space-black/60 to-aurora-space-black/40 border-aurora-electric-purple/30 hover:border-aurora-electric-purple/80 transition-all duration-500 h-full group backdrop-blur-xl">
                  <CardContent className="p-10">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-all duration-300`}
                      whileHover={{ rotate: 12, scale: 1.1 }}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-white mb-6 text-center group-hover:text-aurora-electric-purple transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed text-lg text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Modern Content Showcase */}
      <section className="relative z-10 py-40 px-6">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0.4, 0.8], [80, -80]) }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 px-4 md:px-8">
              📸 Biblioteca de
              <br />
              <span className="aurora-text-gradient">Conteúdo</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4 md:px-8">
              Acesse nossa vasta coleção de fotos, vídeos e artes prontas para download e uso em suas campanhas.
            </p>
          </motion.div>

          {/* Featured Content Cards with Real Data */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Featured Video */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-300/30 overflow-hidden group backdrop-blur-xl">
                <div className="aspect-video relative overflow-hidden">
                  {featuredContent.video ? (
                    <>
                      <img 
                        src={featuredContent.video.thumbnail_url} 
                        alt={featuredContent.video.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Play className="h-16 w-16 text-white" />
                      </motion.div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center h-full">
                      <Video className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">Vídeos Exclusivos</h3>
                  <p className="text-white/80 mb-6 text-lg">
                    Demonstrações profissionais e tutoriais especializados
                  </p>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-lg px-4 py-2">
                    {contentCounts.videos}+ Vídeos
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Photo */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-300/30 overflow-hidden group backdrop-blur-xl">
                <div className="aspect-video relative overflow-hidden">
                  {featuredContent.photo ? (
                    <>
                      <img 
                        src={featuredContent.photo.thumbnail_url || featuredContent.photo.image_url} 
                        alt={featuredContent.photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <motion.div 
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Eye className="h-8 w-8 text-white" />
                      </motion.div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center h-full">
                      <Camera className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">Fotos Profissionais</h3>
                  <p className="text-white/80 mb-6 text-lg">
                    Antes e depois, procedimentos e imagens de alta qualidade
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
                    {contentCounts.photos}+ Fotos
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Featured Art */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-300/30 overflow-hidden group backdrop-blur-xl">
                <div className="aspect-video relative overflow-hidden">
                  {featuredContent.art ? (
                    <>
                      <img 
                        src={featuredContent.art.thumbnail_url || featuredContent.art.file_url || "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop"} 
                        alt={featuredContent.art.title || "Arte exemplo"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <motion.div 
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Palette className="h-8 w-8 text-white" />
                      </motion.div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-emerald-500/30 to-green-500/30 flex items-center justify-center h-full">
                      <Palette className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">Artes & Templates</h3>
                  <p className="text-white/80 mb-6 text-lg">
                    Posts para redes sociais, banners e materiais gráficos prontos
                  </p>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-lg px-4 py-2">
                    {contentCounts.arts}+ Artes
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section with Parallax */}
      <section className="relative z-10 py-40 px-6">
        <motion.div 
          style={{ 
            y: useTransform(scrollYProgress, [0.7, 1], [100, -100]),
            scale: useTransform(scrollYProgress, [0.7, 1], [0.9, 1.1])
          }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Pronto para Revolucionar
              <br />
              <span className="aurora-text-gradient">Sua Clínica?</span>
            </h2>
            
            <p className="text-2xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
              Junte-se a centenas de clínicas que já transformaram seus resultados com a Fluida. 
              Comece gratuitamente hoje mesmo!
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:shadow-2xl hover:shadow-aurora-electric-purple/40 text-xl px-12 py-8 rounded-2xl group"
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                Começar Agora
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleLogin}
                className="border-2 border-aurora-electric-purple/40 text-white hover:bg-aurora-electric-purple/20 text-xl px-12 py-8 rounded-2xl backdrop-blur-sm"
              >
                Já tenho conta
              </Button>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-aurora-space-black/40 border border-aurora-electric-purple/20 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <span className="text-white font-semibold">Conformidade CFM</span>
                <span className="text-white/70 text-sm text-center">Todo conteúdo segue diretrizes médicas</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-aurora-space-black/40 border border-aurora-electric-purple/20 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <span className="text-white font-semibold">Suporte 24/7</span>
                <span className="text-white/70 text-sm text-center">Atendimento especializado sempre disponível</span>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-aurora-space-black/40 border border-aurora-electric-purple/20 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                <span className="text-white font-semibold">98% Satisfação</span>
                <span className="text-white/70 text-sm text-center">Aprovado pelos usuários</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-aurora-electric-purple/20 py-16 px-6 bg-aurora-space-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Fluida</span>
            </div>
            
            <p className="text-white/80 mb-6 text-lg">
              A primeira plataforma de marketing médico verdadeiramente inteligente
            </p>
            
            <p className="text-white/50 text-sm">
              © 2024 Fluida. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;