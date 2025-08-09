import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, Eye } from 'lucide-react';
import { Stories10xSlide } from '../utils/stories10xParser';
import CopyButton from '@/components/ui/CopyButton';
import { sanitizeText } from '@/utils/textSanitizer';
interface Stories10xFormatterProps {
  slides: Stories10xSlide[];
  onApproveScript?: () => void;
}

const getSlideIcon = (tipo: string): string => {
  const icons = {
    gancho: "🎯",
    erro: "⚠️", 
    virada: "💡",
    cta: "🚀"
  };
  return icons[tipo as keyof typeof icons] || "📝";
};

const getSlideTheme = (tipo: string) => {
  // NOVO: Usar tons de aurora boreal!
  const themes = {
    gancho: {
      bg: "aurora-glass",
      border: "border-aurora-electric-purple/20",
      text: "text-aurora-electric-purple",
      badge: "bg-aurora-electric-purple/10 text-aurora-electric-purple border-aurora-electric-purple/20"
    },
    erro: {
      bg: "aurora-glass",
      border: "border-aurora-pink/20",
      text: "text-aurora-pink",
      badge: "bg-aurora-pink/10 text-aurora-pink border-aurora-pink/20"
    },
    virada: {
      bg: "aurora-glass",
      border: "border-aurora-emerald/20",
      text: "text-aurora-emerald",
      badge: "bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/20"
    },
    cta: {
      bg: "aurora-glass",
      border: "border-aurora-neon-blue/20",
      text: "text-aurora-neon-blue",
      badge: "bg-aurora-neon-blue/10 text-aurora-neon-blue border-aurora-neon-blue/20"
    }
  };
  return themes[tipo as keyof typeof themes] || themes.gancho;
};

// Função utilitária para limpar metadados técnicos dos stories que possam ter vindo no roteiro
function removeStoryMetaLines(slides: Stories10xSlide[]): Stories10xSlide[] {
  // Palavras-chave de metadados a serem ignoradas caso apareçam no texto do slide
  const metaKeys = [
    'formato', 'metodologia', 'stories_total', 'tempo_total',
    'dispositivos_usados', 'tom_narrativo', 'engajamento_esperado'
  ];
  const metaRegex = new RegExp(`^\\s*("?(?:${metaKeys.join('|')})"?\\s*:|[“”]?(${metaKeys.join('|')})[””]?\\s*:)`, 'i');

  return slides
    .filter(slide =>
      // Garante que o slide não é apenas uma linha do JSON de metadados
      !metaKeys.some(key => {
        // Checa no campo 'titulo' e no 'conteudo' (caso venha como "formato: stories_10x" em qualquer campo)
        return (
          (typeof slide.titulo === 'string' && metaRegex.test(slide.titulo)) ||
          (typeof slide.conteudo === 'string' && metaRegex.test(slide.conteudo))
        );
      })
    );
}

const Stories10xFormatter: React.FC<Stories10xFormatterProps> = ({ slides, onApproveScript }) => {
  // Remove as linhas meta técnicas dos slides
  const filteredSlides = removeStoryMetaLines(slides);
  const cappedSlides = filteredSlides.slice(0, 5);
  if (filteredSlides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Nenhum story encontrado no roteiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          {/* Trocando amarelo para aurora */}
          <span className="text-aurora-electric-purple text-3xl">⚡</span>
          <h2 className="text-3xl font-bold text-aurora-electric-purple">Stories 10x</h2>
          <span className="text-aurora-neon-blue text-2xl">👁️</span>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <span className="bg-aurora-electric-purple/10 text-aurora-electric-purple border border-aurora-electric-purple/20 rounded px-2 py-1 font-semibold text-xs">
            ⚡ Metodologia 10x
          </span>
          <span className="text-sm text-slate-300">até 5 Stories • 10-15 segundos cada</span>
        </div>
      </motion.div>

      {/* Timeline dos Stories */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="aurora-glass border-aurora-electric-purple/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl text-aurora-electric-purple">
              📱 Sequência Stories 10x
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              {cappedSlides.map((slide, index) => (
                <React.Fragment key={index}>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aurora-electric-purple via-aurora-neon-blue to-aurora-emerald flex items-center justify-center text-white text-xl font-bold mb-2 relative">
                      <span className="relative z-10">{slide.number}</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-aurora-electric-purple via-aurora-neon-blue to-aurora-emerald opacity-40 animate-ping" />
                    </div>
                    <div className="text-xs text-aurora-electric-purple font-medium text-center">
                      {sanitizeText(slide.titulo)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-aurora-emerald">{slide.tempo}</span>
                    </div>
                  </motion.div>
                  {index < cappedSlides.length - 1 && (
                    <div className="text-aurora-electric-purple text-2xl">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stories Individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cappedSlides.map((slide, index) => {
          const icon = getSlideIcon(slide.tipo);
          const theme = getSlideTheme(slide.tipo);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="h-full"
            >
              <Card className={`${theme.bg} ${theme.border} border-2 hover:shadow-lg transition-all duration-300 h-full`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{icon}</div>
                    <div className="flex-1">
                      <span className={`${theme.badge} border mb-2 rounded px-2 py-0.5 text-xs font-semibold`}>
                        Story {slide.number} • {slide.tempo}
                      </span>
                      <h3 className={`font-bold ${theme.text} text-lg`}>
                        {sanitizeText(slide.titulo)}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Conteúdo do Story */}
                  <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-aurora-neon-blue text-base">🎯</span>
                      <span className="text-sm font-medium text-aurora-neon-blue">Conteúdo</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm pr-12">
                      {sanitizeText(slide.conteudo)}
                    </p>
                    <CopyButton 
                      text={sanitizeText(slide.conteudo)}
                      successMessage={`Story ${slide.number} copiado!`}
                    />
                  </div>

                  {/* Dispositivos de Engajamento */}
                  {slide.dispositivo && (
                    <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-aurora-pink">⚡</span>
                        <span className="text-sm font-medium text-aurora-pink">Dispositivo</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slide.dispositivo.split(', ').map((dispositivo, i) => (
                          <span key={i} className="text-aurora-pink border-aurora-pink/30 border px-2 py-0.5 rounded text-xs">{dispositivo}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Dicas & Aprovação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="aurora-glass border-aurora-electric-purple/20">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-aurora-electric-purple text-xl flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              Metodologia Stories 10x
            </CardTitle>
            {/* BOTÃO DE APROVAR ROTEIRO */}
            {onApproveScript && (
              <button
                onClick={onApproveScript}
                className="bg-aurora-emerald text-white px-4 py-2 rounded-lg shadow hover:bg-aurora-neon-blue transition-all text-sm font-semibold mt-4 md:mt-0"
                type="button"
              >
                ✅ Aprovar Roteiro
              </button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-electric-purple text-lg">🎯</span>
              <div>
                <span className="font-semibold text-aurora-electric-purple">Story 1 - Gancho:</span>
                <span className="text-slate-300 ml-2">Captura atenção em 2 segundos</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-pink text-lg">⚠️</span>
              <div>
                <span className="font-semibold text-aurora-pink">Story 2 - Erro:</span>
                <span className="text-slate-300 ml-2">Mostra o que não fazer</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-emerald text-lg">💡</span>
              <div>
                <span className="font-semibold text-aurora-emerald">Story 3 - Virada:</span>
                <span className="text-slate-300 ml-2">Apresenta a solução + dispositivo</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-aurora-neon-blue text-lg">🚀</span>
              <div>
                <span className="font-semibold text-aurora-neon-blue">Story 4 - CTA:</span>
                <span className="text-slate-300 ml-2">Call-to-action + antecipação</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Stories10xFormatter;
