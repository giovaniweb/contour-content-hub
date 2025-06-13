import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Timer, Zap, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import CopyableText from './CopyableText';

interface Stories10xSlideCardProps {
  slide: {
    number: number;
    titulo: string;
    conteudo: string;
    dispositivo?: string;
    tempo: string;
    tipo: 'gancho' | 'erro' | 'virada' | 'cta';
  };
}

const getSlideIcon = (tipo: string): string => {
  const icons = {
    gancho: "🎯", // Hook
    erro: "❌", // Erro comum
    virada: "💡", // Virada + solução
    cta: "📲"  // Call to action
  };
  return icons[tipo as keyof typeof icons] || "📝";
};

const getSlideTheme = (tipo: string) => {
  const themes = {
    gancho: { 
      bg: "aurora-glass", 
      border: "border-red-400/30", 
      text: "text-red-300", 
      badge: "bg-red-500/20 text-red-300 border-red-400/30",
      glow: "shadow-red-400/20",
      gradient: "bg-gradient-to-br from-red-500/10 to-orange-500/10"
    },
    erro: { 
      bg: "aurora-glass", 
      border: "border-yellow-400/30", 
      text: "text-yellow-300", 
      badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
      glow: "shadow-yellow-400/20",
      gradient: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
    },
    virada: { 
      bg: "aurora-glass", 
      border: "border-green-400/30", 
      text: "text-green-300", 
      badge: "bg-green-500/20 text-green-300 border-green-400/30",
      glow: "shadow-green-400/20",
      gradient: "bg-gradient-to-br from-green-500/10 to-cyan-500/10"
    },
    cta: { 
      bg: "aurora-glass", 
      border: "border-blue-400/30", 
      text: "text-blue-300", 
      badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
      glow: "shadow-blue-400/20",
      gradient: "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
    }
  };
  return themes[tipo as keyof typeof themes] || themes.gancho;
};

const getDispositivoIcon = (dispositivo: string) => {
  if (dispositivo.includes('Foguinho') || dispositivo.includes('🔥')) {
    return <Zap className="h-4 w-4 text-orange-400" />;
  }
  if (dispositivo.includes('Compartilhamento') || dispositivo.includes('📲')) {
    return <Share2 className="h-4 w-4 text-blue-400" />;
  }
  if (dispositivo.includes('Reciprocidade') || dispositivo.includes('🔄')) {
    return <MessageCircle className="h-4 w-4 text-green-400" />;
  }
  if (dispositivo.includes('Enquete') || dispositivo.includes('📊')) {
    return <ThumbsUp className="h-4 w-4 text-purple-400" />;
  }
  return <Zap className="h-4 w-4 text-cyan-400" />;
};

const Stories10xSlideCard: React.FC<Stories10xSlideCardProps> = ({ slide }) => {
  const icon = getSlideIcon(slide.tipo);
  const theme = getSlideTheme(slide.tipo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: slide.number * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className={`${theme.bg} ${theme.border} ${theme.glow} border-2 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden`}>
        <div className={`absolute inset-0 ${theme.gradient} opacity-50`} />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl aurora-float">{icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`${theme.badge} border aurora-shimmer`}>
                  Story {slide.number}
                </Badge>
                <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/30 text-xs">
                  <Timer className="h-3 w-3 mr-1" />
                  {slide.tempo}
                </Badge>
              </div>
              <h3 className={`font-bold ${theme.text} text-lg aurora-heading filter drop-shadow-sm`}>
                {slide.titulo}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {/* Conteúdo do Story com botão de copiar */}
            <CopyableText text={slide.conteudo}>
              <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full aurora-pulse"></div>
                  <span className="text-sm font-medium text-cyan-400">Conteúdo do Story</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm aurora-body pr-8">
                  {slide.conteudo}
                </p>
              </div>
            </CopyableText>

            {/* Dispositivo de Engajamento */}
            {slide.dispositivo && (
              <CopyableText text={slide.dispositivo}>
                <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    {getDispositivoIcon(slide.dispositivo)}
                    <span className="text-sm font-medium text-orange-400">Dispositivo de Engajamento</span>
                  </div>
                  <div className="flex items-center gap-2 pr-8">
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                      {slide.dispositivo}
                    </Badge>
                  </div>
                </div>
              </CopyableText>
            )}

            {/* Dica Específica por Tipo */}
            <CopyableText text={getTipByType(slide.tipo)}>
              <div className="aurora-glass rounded-lg p-3 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full aurora-pulse"></div>
                  <span className="text-xs font-medium text-yellow-400">Dica Leandro Ladeira</span>
                </div>
                <p className="text-slate-300 text-xs italic aurora-body pr-8">
                  {getTipByType(slide.tipo)}
                </p>
              </div>
            </CopyableText>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const getTipByType = (tipo: string): string => {
  const tips = {
    gancho: "Primeira impressão é tudo! Use provocação inteligente nos primeiros 3 segundos para parar o scroll.",
    erro: "Mostre o erro comum que todos cometem. Gere identificação: 'nossa, eu faço isso mesmo!'",
    virada: "Aqui é onde você entrega valor + pede engajamento. Use dispositivos: emoji, enquete, pergunta.",
    cta: "CTA suave mas direcionado. Sempre deixe gancho para próximo conteúdo criar vício."
  };
  return tips[tipo as keyof typeof tips] || "Mantenha o foco na metodologia Stories 10x.";
};

export default Stories10xSlideCard;
