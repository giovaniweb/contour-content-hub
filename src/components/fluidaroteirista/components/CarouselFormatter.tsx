
import React from 'react';
import { motion } from 'framer-motion';
import { parseCarouselSlides } from '../utils/carouselParser';
import CarouselSlideCard from './CarouselSlideCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Instagram, Sparkles } from 'lucide-react';
import CarouselSequencePreview from './CarouselSequencePreview';

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
      {/* Header bonito do Carrossel Aurora */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <Images className="h-10 w-10 text-aurora-electric-purple aurora-glow" />
          <h2 className="text-3xl font-extrabold aurora-heading text-aurora-electric-purple drop-shadow">
            Carrossel Instagram
          </h2>
          <Instagram className="h-8 w-8 text-aurora-soft-pink aurora-glow" />
        </div>
        <CarouselSequencePreview slides={slides.map(sl => ({ title: sl.title }))} />
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">{slides.length} Slides</Badge>
          <span className="text-xs text-aurora-neon-blue">Arraste ou deslize →</span>
        </div>
      </motion.div>

      {/* Grid de Slides */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {slides.map((slide, index) => (
            <CarouselSlideCard key={index} slide={slide} />
          ))}
        </div>
      </motion.div>

      {/* Dicas Aurora para o Carrossel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="aurora-glass border-aurora-emerald/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-emerald/10 to-aurora-lime/5 opacity-50 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-aurora-emerald text-xl flex items-center gap-3 aurora-heading">
              <Sparkles className="h-6 w-6 aurora-glow-emerald" />
              Dicas para seu Carrossel Aurora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm relative z-10">
            <div className="flex flex-wrap gap-3">
              <Tip text="Primeiro slide = atenção nos 3 primeiros segundos" />
              <Tip text="Use imagens de alta qualidade e consistentes" />
              <Tip text="Último slide sempre com call-to-action claro" />
              <Tip text="Mantenha texto legível e pouco poluído" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

function Tip({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 px-3 py-1 bg-aurora-emerald/10 text-aurora-emerald rounded-full border border-aurora-emerald/20 text-xs font-medium aurora-body">{text}</span>
  );
}

export default CarouselFormatter;
