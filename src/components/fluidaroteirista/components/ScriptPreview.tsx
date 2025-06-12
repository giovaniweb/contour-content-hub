
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Wand2, Image, Volume2, Palette, Zap, Type, ImageIcon } from "lucide-react";
import { parseCarouselSlides } from '../utils/carouselParser';

interface ScriptSlide {
  number: number;
  texto?: string;
  imagem?: string;
  content: string;
  type?: 'hook' | 'problem' | 'solution' | 'cta';
}

interface ScriptPreviewProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
  };
  onApprove: () => void;
  onNewScript: () => void;
  onGenerateImage?: () => Promise<void>;
  onGenerateAudio?: () => Promise<void>;
  onApplyDisney?: () => Promise<void>;
  isProcessing?: boolean;
  generatedImageUrl?: string;
}

const ScriptPreview: React.FC<ScriptPreviewProps> = ({
  script,
  onApprove,
  onNewScript,
  onGenerateImage,
  onGenerateAudio,
  onApplyDisney,
  isProcessing = false,
  generatedImageUrl
}) => {
  // Parse script content into slides based on format
  const parseScriptSlides = (content: string): ScriptSlide[] => {
    if (script.formato === 'carrossel') {
      return parseCarouselSlides(content);
    }
    
    // Para outros formatos, manter lógica anterior
    const lines = content.split('\n').filter(line => line.trim());
    const slides: ScriptSlide[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^Slide\s*\d+/i)) {
        const slideNumber = slides.length + 1;
        const content = trimmedLine.replace(/^Slide\s*\d+\s*:?\s*/i, '');
        
        let type: 'hook' | 'problem' | 'solution' | 'cta' = 'solution';
        if (slideNumber === 1) type = 'hook';
        else if (slideNumber === slides.length + 1 && script.formato === 'carrossel') type = 'cta';
        else if (slideNumber === 2) type = 'problem';
        
        slides.push({
          number: slideNumber,
          content,
          type
        });
      }
    }
    
    return slides;
  };

  const slides = parseScriptSlides(script.roteiro);

  const slideVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const getSlideColor = (type: string, index: number) => {
    const colors = [
      'from-red-500/20 to-pink-500/20 border-red-500/30',
      'from-orange-500/20 to-yellow-500/20 border-orange-500/30', 
      'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      'from-green-500/20 to-emerald-500/20 border-green-500/30',
      'from-purple-500/20 to-violet-500/20 border-purple-500/30'
    ];
    return colors[index % colors.length];
  };

  const getSlideEmoji = (type: string, index: number) => {
    const emojis = ['🎣', '⚡', '💡', '✨', '🚀'];
    return emojis[index % emojis.length];
  };

  const getSlideLabel = (type: string, index: number) => {
    if (script.formato === 'carrossel') {
      const labels = ['Gancho', 'Problema', 'Desenvolvimento', 'Solução', 'Call to Action'];
      return `${getSlideEmoji(type, index)} ${labels[index] || 'Conteúdo'}`;
    }
    
    switch (type) {
      case 'hook': return '🎣 Gancho';
      case 'problem': return '⚡ Problema';
      case 'solution': return '✨ Solução';
      case 'cta': return '🚀 Ação';
      default: return '📝 Conteúdo';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header Aurora Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 relative"
      >
        {/* Aurora Background Effect */}
        <div className="absolute inset-0 aurora-gradient-bg opacity-10 rounded-3xl blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="p-4 aurora-glass rounded-full"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Palette className="h-10 w-10 text-aurora-electric-purple" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl font-bold aurora-text-gradient mb-4">
            ✨ Roteiro Aurora Criado!
          </h2>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              {script.formato.toUpperCase()}
            </Badge>
            <Badge className="aurora-glass border-aurora-sage/30 text-aurora-sage px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              {script.emocao_central}
            </Badge>
            <Badge className="aurora-glass border-aurora-electric-purple/30 text-white px-4 py-2">
              🎨 {script.mentor}
            </Badge>
            {script.formato === 'carrossel' && (
              <Badge className="aurora-glass border-yellow-500/30 text-yellow-300 px-4 py-2">
                🎠 {slides.length} Slides
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Script Preview - Aurora Carousel Style */}
      <div className="space-y-8">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-center aurora-text-gradient"
        >
          🎨 Preview Estilo Aurora {script.formato === 'carrossel' ? 'Carrossel' : script.formato}
        </motion.h3>
        
        <div className="grid gap-6">
          <AnimatePresence>
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <Card className={`aurora-glass bg-gradient-to-r ${getSlideColor(slide.type, index)} relative overflow-hidden shadow-2xl hover:shadow-aurora-glow-purple transition-all duration-500`}>
                  {/* Aurora Glow Effect */}
                  <div className="absolute inset-0 aurora-gradient-primary opacity-0 hover:opacity-10 transition-opacity duration-500"></div>
                  
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium text-white flex items-center gap-3">
                        <span className="text-2xl">{getSlideEmoji(slide.type, index)}</span>
                        {getSlideLabel(slide.type, index)}
                      </CardTitle>
                      <Badge variant="secondary" className="aurora-glass text-sm px-3 py-1">
                        Slide {slide.number}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    {/* Conteúdo para carrossel com estrutura Texto/Imagem */}
                    {script.formato === 'carrossel' && slide.texto && slide.imagem ? (
                      <div className="space-y-4">
                        {/* Seção Texto */}
                        <div className="p-4 aurora-glass bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Type className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">Texto:</span>
                          </div>
                          <p className="text-white leading-relaxed">{slide.texto}</p>
                        </div>
                        
                        {/* Seção Imagem */}
                        <div className="p-4 aurora-glass bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">Imagem:</span>
                          </div>
                          <p className="text-white leading-relaxed italic">{slide.imagem}</p>
                        </div>
                      </div>
                    ) : (
                      /* Conteúdo para outros formatos */
                      <motion.p 
                        className="text-white leading-relaxed text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                      >
                        {slide.content}
                      </motion.p>
                    )}
                  </CardContent>
                  
                  {/* Connector Arrow - Aurora Style */}
                  {index < slides.length - 1 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        className="w-8 h-8 aurora-glass bg-aurora-electric-purple/30 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="h-4 w-4 text-aurora-electric-purple" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Slide number indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                    <span className="text-aurora-electric-purple font-bold">{slide.number}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Generated Image Display - Aurora Style */}
      {generatedImageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-aurora-electric-purple text-center flex items-center justify-center gap-2">
                <Image className="h-6 w-6" />
                🌌 Imagem Aurora Gerada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img 
                  src={generatedImageUrl} 
                  alt="Imagem gerada para o roteiro" 
                  className="w-full max-w-md mx-auto rounded-lg shadow-aurora-glow-purple"
                />
                <div className="absolute inset-0 aurora-gradient-primary opacity-10 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons - Aurora Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: slides.length * 0.15 + 0.5 }}
        className="flex gap-4 justify-center flex-wrap"
      >
        <Button
          onClick={onApprove}
          disabled={isProcessing}
          className="aurora-button text-white px-8 h-14 text-lg font-medium shadow-aurora-glow-purple"
        >
          <CheckCircle2 className="h-6 w-6 mr-3" />
          ✨ Aprovar Aurora Script
        </Button>
        
        {onGenerateImage && (
          <Button
            onClick={onGenerateImage}
            disabled={isProcessing}
            className="aurora-glass bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-white hover:bg-purple-500/30 px-6 h-14"
          >
            <Image className="h-5 w-5 mr-2" />
            Gerar Arte Aurora
          </Button>
        )}
        
        {onGenerateAudio && (
          <Button
            onClick={onGenerateAudio}
            disabled={isProcessing}
            className="aurora-glass bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-white hover:bg-cyan-500/30 px-6 h-14"
          >
            <Volume2 className="h-5 w-5 mr-2" />
            Aurora Voice
          </Button>
        )}
        
        {onApplyDisney && (
          <Button
            onClick={onApplyDisney}
            disabled={isProcessing}
            className="aurora-glass bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-white hover:bg-yellow-500/30 px-6 h-14"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Disney Aurora Magic
          </Button>
        )}
        
        <Button
          onClick={onNewScript}
          className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 px-8 h-14"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Novo Aurora Script
        </Button>
      </motion.div>

      {/* Script Metadata - Aurora Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: slides.length * 0.15 + 0.7 }}
        className="mt-8 p-6 aurora-glass rounded-2xl border border-aurora-electric-purple/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 aurora-gradient-primary opacity-5"></div>
        <div className="relative z-10">
          <h4 className="text-lg font-medium text-aurora-electric-purple mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            📊 Detalhes Aurora do Roteiro
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="space-y-2">
              <p><strong className="text-aurora-electric-purple">Objetivo:</strong> {script.objetivo}</p>
              <p><strong className="text-aurora-sage">Intenção:</strong> {script.intencao}</p>
              <p><strong className="text-aurora-electric-purple">Emoção Central:</strong> {script.emocao_central}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-aurora-sage">Mentor Aurora:</strong> {script.mentor}</p>
              <p><strong className="text-aurora-electric-purple">Total de Slides:</strong> {slides.length}</p>
              <p><strong className="text-aurora-sage">Formato:</strong> {script.formato}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScriptPreview;
