
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import CarouselSlideCard from './CarouselSlideCard';
import CopyButton from '@/components/ui/CopyButton';
import { parseCarouselSlides } from '../utils/carouselParser';
import { sanitizeText } from '../utils/textSanitizer';

interface CarouselFormatterProps {
  roteiro: string;
}

const CarouselFormatter: React.FC<CarouselFormatterProps> = ({ roteiro }) => {
  console.log('🎠 [CarouselFormatter] Renderizando carrossel com roteiro:', roteiro.substring(0, 100));
  
  // Aplicar sanitização antes de processar
  const cleanRoteiro = sanitizeText(roteiro);
  const slides = parseCarouselSlides(cleanRoteiro);
  
  console.log('📋 [CarouselFormatter] Slides processados:', slides.length);
  
  if (slides.length === 0) {
    return (
      <Card className="aurora-glass border-red-400/30 border-2">
        <CardContent className="p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Erro no Carrossel</div>
          <p className="text-slate-300">Não foi possível processar os slides do carrossel.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Carrossel */}
      <Card className="aurora-glass border-blue-400/30 border-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-slate-200">Carrossel Instagram</h3>
                <p className="text-sm text-slate-400">Múltiplos slides deslizáveis</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/30">
              {slides.length} slides
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Slides do Carrossel */}
      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CarouselSlideCard 
              slide={slide} 
              index={index + 1}
              total={slides.length}
            />
          </motion.div>
        ))}
      </div>

      {/* Preview do Fluxo */}
      <Card className="aurora-glass border-purple-400/30 border">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Fluxo do Carrossel
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            {slides.map((slide, index) => (
              <React.Fragment key={index}>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-400/30">
                  {slide.title || `Slide ${index + 1}`}
                </div>
                {index < slides.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-purple-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roteiro Completo para Cópia */}
      <Card className="aurora-glass border-slate-600 border-2">
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-aurora-electric-purple rounded-full aurora-pulse"></div>
            <span className="text-sm font-medium text-aurora-electric-purple">Roteiro Completo</span>
          </div>
          <div className="text-slate-200 text-sm aurora-body pr-12 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded border border-slate-700">
            {cleanRoteiro}
          </div>
          <CopyButton 
            text={cleanRoteiro}
            successMessage="Roteiro completo copiado!"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarouselFormatter;
