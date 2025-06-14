
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseCarouselSlides } from '../utils/carouselParser';
import CopyButton from '@/components/ui/CopyButton';

interface CarouselFormatterProps {
  roteiro: string;
}

const CarouselFormatter: React.FC<CarouselFormatterProps> = ({ roteiro }) => {
  const slides = parseCarouselSlides(roteiro);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      {/* Header do Carrossel */}
      <Card className="aurora-glass border border-cyan-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-cyan-300 text-2xl flex items-center justify-center gap-2">
            🎠 Carrossel Instagram
            <Badge variant="outline" className="bg-cyan-900/50 text-cyan-300 border-cyan-500/50">
              {slides.length} Slides
            </Badge>
          </CardTitle>
          <p className="text-cyan-400/80">
            Estrutura narrativa otimizada para engagement no Instagram
          </p>
        </CardHeader>
      </Card>

      {/* Preview da Sequência */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            📋 Preview da Sequência
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {slides.map((slide, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {index + 1}. {slide.title}
                </div>
                {index < slides.length - 1 && (
                  <span className="mx-2 text-gray-400">→</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slides Detalhados */}
      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border border-slate-700/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {slide.number}
                    </div>
                    <CardTitle className="text-white text-lg">
                      {slide.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                    Slide {slide.number}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Texto do Slide */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-cyan-300 font-medium">Texto do Slide</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <p className="text-white leading-relaxed text-base">
                      {slide.texto}
                    </p>
                  </div>
                </div>

                {/* Descrição Visual */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 font-medium">Descrição Visual</span>
                  </div>
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                    <p className="text-green-100 leading-relaxed text-sm">
                      {slide.imagem}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Roteiro Completo para Cópia */}
      <Card className="bg-slate-900/30 border border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            📄 Roteiro Completo
            <CopyButton 
              text={roteiro}
              successMessage="Roteiro do carrossel copiado!"
              className="relative"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-700/50 max-h-64 overflow-y-auto">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {roteiro}
            </pre>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarouselFormatter;
