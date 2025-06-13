
import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides } from '../utils/carouselParser';
import CarouselSlideCard from './CarouselSlideCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header do Carrossel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <Images className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-slate-50">Carrossel Instagram</h2>
          <Instagram className="h-6 w-6 text-pink-500" />
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            {slides.length} Slides
          </Badge>
          <ArrowRight className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Deslizar horizontalmente</span>
        </div>
      </motion.div>

      {/* Preview da Sequência */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="aurora-glass border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-purple-300 text-lg">
              📱 Preview da Sequência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-4">
              {slides.map((_, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {index === 0 && 'Hook'}
                      {index === 1 && 'Problema'}
                      {index === 2 && 'Solução'}
                      {index === 3 && 'Benefícios'}
                      {index === 4 && 'CTA'}
                    </div>
                  </div>
                  {index < slides.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-sm text-slate-300">
              Estrutura narrativa otimizada para engagement no Instagram
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Slides Individuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <CarouselSlideCard slide={slide} />
          </motion.div>
        ))}
      </div>

      {/* Dicas para o Carrossel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="aurora-glass border-cyan-500/30 bg-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg flex items-center gap-2">
              💡 Dicas para seu Carrossel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">Primeiro slide deve capturar atenção em 3 segundos</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">Use imagens de alta qualidade e consistentes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">Último slide sempre com call-to-action claro</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">Mantenha texto legível mesmo em telas pequenas</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CarouselFormatter;
