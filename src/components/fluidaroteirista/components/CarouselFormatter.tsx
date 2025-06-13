
import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides } from '../utils/carouselParser';
import CarouselSlideCard from './CarouselSlideCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, ArrowRight, Sparkles } from 'lucide-react';

interface CarouselFormatterProps {
  roteiro: string;
}

const CarouselFormatter: React.FC<CarouselFormatterProps> = ({ roteiro }) => {
  const slides = parseCarouselSlides(roteiro);

  if (slides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Nenhum slide encontrado no roteiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header do Carrossel Aurora */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <Images className="h-10 w-10 text-aurora-electric-purple aurora-glow" />
          <h2 className="text-3xl font-bold aurora-heading">Carrossel Instagram</h2>
          <Instagram className="h-8 w-8 text-aurora-soft-pink aurora-glow" />
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {slides.length} Slides
          </Badge>
          <ArrowRight className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-300 aurora-body">Deslizar horizontalmente</span>
        </div>
      </motion.div>

      {/* Preview da Sequência Aurora */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="aurora-glass border-aurora-electric-purple/30 relative overflow-hidden">
          {/* Background particles effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-electric-purple/5 via-aurora-neon-blue/5 to-aurora-emerald/5 opacity-50" />
          
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-center aurora-heading text-xl">
              📱 Preview da Sequência
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              {slides.map((_, index) => (
                <React.Fragment key={index}>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-aurora-gradient-primary flex items-center justify-center text-white text-sm font-bold aurora-glow mb-2 relative">
                      <span className="relative z-10">{index + 1}</span>
                      <div className="absolute inset-0 rounded-full bg-aurora-gradient-primary opacity-50 animate-ping" />
                    </div>
                    <div className="text-xs text-aurora-electric-purple font-medium aurora-body">
                      {index === 0 && 'Gancho'}
                      {index === 1 && 'Problema'}
                      {index === 2 && 'Solução'}
                      {index === 3 && 'Benefícios'}
                      {index === 4 && 'CTA'}
                    </div>
                  </motion.div>
                  {index < slides.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-aurora-neon-blue aurora-pulse" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-sm aurora-body">
              ✨ Estrutura narrativa otimizada para engagement no Instagram
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Slides Individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <CarouselSlideCard key={index} slide={slide} />
        ))}
      </div>

      {/* Dicas Aurora para o Carrossel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="aurora-glass border-aurora-emerald/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-emerald/5 to-aurora-lime/5 opacity-50" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-aurora-emerald text-xl flex items-center gap-3 aurora-heading">
              <Sparkles className="h-6 w-6 aurora-glow-emerald" />
              Dicas para seu Carrossel Aurora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm relative z-10">
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Primeiro slide deve capturar atenção em 3 segundos</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Use imagens de alta qualidade e consistentes</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Último slide sempre com call-to-action claro</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">✅</span>
              <span className="aurora-body">Mantenha texto legível mesmo em telas pequenas</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CarouselFormatter;
