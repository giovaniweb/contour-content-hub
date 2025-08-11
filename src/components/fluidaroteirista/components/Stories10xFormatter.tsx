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

      {/* Texto corrido simples dos Stories */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <section className="max-w-3xl mx-auto">
          <div className="flex justify-end mb-3">
            <CopyButton 
              text={(() => {
                const cleanBody = (content: string) => {
                  return content
                    .replace(/^\s*[-=]+\s*$/gm, '')
                    .replace(/^\s*#+\s*$/gm, '')
                    .trim();
                };

                return cappedSlides.map((slide, i) => {
                  const icon = getSlideIcon(slide.tipo);
                  const cleanContent = cleanBody(sanitizeText(slide.conteudo));
                  return `${icon} Conteúdo do story ${slide.number || i + 1} - ✨ ${sanitizeText(slide.titulo)}:\n\n${cleanContent}`;
                }).join('\n\n---------------------------------------------------------------\n\n');
              })()}
              successMessage="Roteiro Stories 10x copiado!"
            />
          </div>
          <article className="text-foreground leading-relaxed aurora-body">
            {cappedSlides.map((slide, i) => {
              const icon = getSlideIcon(slide.tipo);
              const cleanBody = (content: string) => {
                let cleaned = content
                  .replace(/^\s*[-=]+\s*$/gm, '')
                  .replace(/^\s*#+\s*$/gm, '')
                  .trim();
                
                if (!cleaned) return '';
                
                // Formatação específica para Stories 10x
                cleaned = cleaned
                  // Quebrar linha antes de numerações com emoji (1️⃣, 2️⃣, etc.)
                  .replace(/(?<!^|\n)(\d️⃣)/g, '\n$1')
                  // Quebrar linha antes de textos entre colchetes
                  .replace(/(?<!^|\n)(\[.*?\])/g, '\n$1')
                  // Quebrar após pontos finais seguidos de maiúscula
                  .replace(/\. ([A-Z])/g, '.\n$1')
                  // Quebrar após dois pontos quando seguido de texto longo
                  .replace(/: ([A-Z][^.]{40,})/g, ':\n$1')
                  // Quebrar frases muito longas (mais de 100 caracteres)
                  .split('\n')
                  .map(line => {
                    if (line.length > 100 && !line.includes('️⃣') && !line.includes('[')) {
                      // Procurar por vírgulas ou pontos para quebrar
                      const breakPoints = [', ', ' - ', ' e ', ' que '];
                      for (const breakPoint of breakPoints) {
                        const midPoint = Math.floor(line.length / 2);
                        const breakIndex = line.indexOf(breakPoint, midPoint - 20);
                        if (breakIndex > 0 && breakIndex < line.length - 15) {
                          return line.substring(0, breakIndex + breakPoint.length).trim() + 
                                 '\n' + line.substring(breakIndex + breakPoint.length).trim();
                        }
                      }
                    }
                    return line;
                  })
                  .join('\n')
                  // Limpar múltiplas quebras de linha excessivas
                  .replace(/\n{3,}/g, '\n\n')
                  .replace(/^\n+|\n+$/g, '')
                  .trim();
                
                return cleaned;
              };
              
              const cleanContent = cleanBody(sanitizeText(slide.conteudo));
              const hasBody = cleanContent.length > 0;
              
              return (
                <div key={i}>
                  <h3 className="font-semibold text-white mb-3">
                    {icon} Conteúdo do story {slide.number || i + 1} - ✨ {sanitizeText(slide.titulo)}:
                  </h3>
                  {hasBody && (
                    <div className="mt-3 pl-6 border-l-2 border-aurora-electric-purple/20">
                      <div className="font-normal !text-white leading-loose whitespace-pre-line text-sm">
                        {cleanContent}
                      </div>
                    </div>
                  )}
                  {i < cappedSlides.length - 1 && <hr className="my-8 border-border border-dashed" />}
                </div>
              );
            })}
          </article>
        </section>
      </motion.div>

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
