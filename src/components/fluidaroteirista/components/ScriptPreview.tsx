
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, CheckCircle2, Wand2, Image, Volume2 } from "lucide-react";

interface ScriptSlide {
  number: number;
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
  // Parse script content into slides
  const parseScriptSlides = (content: string): ScriptSlide[] => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      number: index + 1,
      content: line.trim(),
      type: index === 0 ? 'hook' : 
            index === lines.length - 1 ? 'cta' : 
            index === 1 ? 'problem' : 'solution'
    }));
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

  const getSlideColor = (type: string) => {
    switch (type) {
      case 'hook': return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'problem': return 'from-orange-500/20 to-yellow-500/20 border-orange-500/30';
      case 'solution': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'cta': return 'from-purple-500/20 to-blue-500/20 border-purple-500/30';
      default: return 'from-slate-500/20 to-gray-500/20 border-slate-500/30';
    }
  };

  const getSlideLabel = (type: string) => {
    switch (type) {
      case 'hook': return '🎣 Gancho';
      case 'problem': return '⚡ Problema';
      case 'solution': return '✨ Solução';
      case 'cta': return '🚀 Ação';
      default: return '📝 Conteúdo';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            className="p-3 bg-aurora-gradient-primary rounded-full"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-bold text-white">
          ✨ Seu Roteiro Está Pronto!
        </h2>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
            {script.formato}
          </Badge>
          <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
            {script.emocao_central}
          </Badge>
          <Badge variant="outline" className="border-aurora-electric-purple/30 text-white">
            {script.mentor}
          </Badge>
        </div>
      </motion.div>

      {/* Script Preview */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white text-center">
          📱 Preview do {script.formato}
        </h3>
        
        <div className="space-y-4">
          <AnimatePresence>
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`aurora-glass bg-gradient-to-r ${getSlideColor(slide.type)} relative overflow-hidden`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                        {getSlideLabel(slide.type)}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Slide {slide.number}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-white leading-relaxed">
                      {slide.content}
                    </p>
                  </CardContent>
                  
                  {/* Connector Arrow */}
                  {index < slides.length - 1 && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                      <motion.div
                        className="w-6 h-6 bg-aurora-electric-purple rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.2 }}
                      >
                        <ArrowRight className="h-3 w-3 text-white" />
                      </motion.div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Generated Image Display */}
      {generatedImageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6"
        >
          <Card className="aurora-glass">
            <CardHeader>
              <CardTitle className="text-white text-center">🖼️ Imagem Gerada</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={generatedImageUrl} 
                alt="Imagem gerada para o roteiro" 
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: slides.length * 0.2 + 0.3 }}
        className="flex gap-4 justify-center flex-wrap"
      >
        <Button
          onClick={onApprove}
          disabled={isProcessing}
          className="bg-aurora-gradient-primary hover:opacity-90 text-white px-8 h-12"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          ✨ Aprovar & Fluida Encantadora
        </Button>
        
        {onGenerateImage && (
          <Button
            onClick={onGenerateImage}
            disabled={isProcessing}
            variant="outline"
            className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 px-6 h-12"
          >
            <Image className="h-5 w-5 mr-2" />
            Gerar Imagem
          </Button>
        )}
        
        {onGenerateAudio && (
          <Button
            onClick={onGenerateAudio}
            disabled={isProcessing}
            variant="outline"
            className="aurora-glass border-aurora-cosmic-teal/30 text-white hover:bg-aurora-cosmic-teal/20 px-6 h-12"
          >
            <Volume2 className="h-5 w-5 mr-2" />
            Gerar Áudio
          </Button>
        )}
        
        {onApplyDisney && (
          <Button
            onClick={onApplyDisney}
            disabled={isProcessing}
            variant="outline"
            className="aurora-glass border-aurora-sage/30 text-white hover:bg-aurora-sage/20 px-6 h-12"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Disney Magic
          </Button>
        )}
        
        <Button
          onClick={onNewScript}
          variant="outline"
          className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 px-8 h-12"
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Criar Novo Roteiro
        </Button>
      </motion.div>

      {/* Script Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: slides.length * 0.2 + 0.5 }}
        className="mt-8 p-4 aurora-glass rounded-lg border border-aurora-electric-purple/20"
      >
        <h4 className="text-sm font-medium text-aurora-electric-purple mb-2">
          📊 Detalhes do Roteiro
        </h4>
        <div className="text-sm text-slate-300 space-y-1">
          <p><strong>Objetivo:</strong> {script.objetivo}</p>
          <p><strong>Intenção:</strong> {script.intencao}</p>
          <p><strong>Emoção Central:</strong> {script.emocao_central}</p>
          <p><strong>Total de Slides:</strong> {slides.length}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ScriptPreview;
