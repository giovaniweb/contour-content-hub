import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Zap, Eye } from 'lucide-react';
import { Stories10xSlide } from '../utils/stories10xParser';
import CopyButton from '@/components/ui/CopyButton';

interface Stories10xFormatterProps {
  slides: Stories10xSlide[];
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
  const themes = {
    gancho: { 
      bg: "aurora-glass", 
      border: "border-red-400/30", 
      text: "text-red-300", 
      badge: "bg-red-500/20 text-red-300 border-red-400/30"
    },
    erro: { 
      bg: "aurora-glass", 
      border: "border-orange-400/30", 
      text: "text-orange-300", 
      badge: "bg-orange-500/20 text-orange-300 border-orange-400/30"
    },
    virada: { 
      bg: "aurora-glass", 
      border: "border-green-400/30", 
      text: "text-green-300", 
      badge: "bg-green-500/20 text-green-300 border-green-400/30"
    },
    cta: { 
      bg: "aurora-glass", 
      border: "border-blue-400/30", 
      text: "text-blue-300", 
      badge: "bg-blue-500/20 text-blue-300 border-blue-400/30"
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

const Stories10xFormatter: React.FC<Stories10xFormatterProps> = ({ slides }) => {
  // Remove as linhas meta técnicas dos slides
  const filteredSlides = removeStoryMetaLines(slides);

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
          <Zap className="h-10 w-10 text-yellow-500" />
          <h2 className="text-3xl font-bold">Stories 10x</h2>
          <Eye className="h-8 w-8 text-purple-500" />
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
            ⚡ Metodologia 10x
          </Badge>
          <span className="text-sm text-slate-300">4 Stories • 10 segundos cada</span>
        </div>
      </motion.div>

      {/* Timeline dos Stories */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="aurora-glass border-yellow-500/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              📱 Sequência Stories 10x
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              {filteredSlides.map((slide, index) => (
                <React.Fragment key={index}>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold mb-2 relative">
                      <span className="relative z-10">{slide.number}</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-50 animate-ping" />
                    </div>
                    <div className="text-xs text-yellow-400 font-medium text-center">
                      {slide.titulo}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{slide.tempo}</span>
                    </div>
                  </motion.div>
                  {index < filteredSlides.length - 1 && (
                    <div className="text-yellow-400 text-2xl">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stories Individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSlides.map((slide, index) => {
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
                      <Badge variant="outline" className={`${theme.badge} border mb-2`}>
                        Story {slide.number} • {slide.tempo}
                      </Badge>
                      <h3 className={`font-bold ${theme.text} text-lg`}>
                        {slide.titulo}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Conteúdo do Story */}
                  <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Conteúdo</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-sm pr-12">
                      {slide.conteudo}
                    </p>
                    <CopyButton 
                      text={slide.conteudo}
                      successMessage={`Story ${slide.number} copiado!`}
                    />
                  </div>

                  {/* Dispositivos de Engajamento */}
                  {slide.dispositivo && (
                    <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Dispositivo</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slide.dispositivo.split(', ').map((dispositivo, i) => (
                          <Badge key={i} variant="outline" className="text-purple-300 border-purple-400/30">
                            {dispositivo}
                          </Badge>
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

      {/* Dicas para Stories 10x */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="aurora-glass border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-xl flex items-center gap-3">
              <Zap className="h-6 w-6" />
              Metodologia Stories 10x
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-red-400 text-lg">🎯</span>
              <div>
                <span className="font-semibold text-red-300">Story 1 - Gancho:</span>
                <span className="text-slate-300 ml-2">Captura atenção em 2 segundos</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-orange-400 text-lg">⚠️</span>
              <div>
                <span className="font-semibold text-orange-300">Story 2 - Erro:</span>
                <span className="text-slate-300 ml-2">Mostra o que não fazer</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-green-400 text-lg">💡</span>
              <div>
                <span className="font-semibold text-green-300">Story 3 - Virada:</span>
                <span className="text-slate-300 ml-2">Apresenta a solução + dispositivo</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-blue-400 text-lg">🚀</span>
              <div>
                <span className="font-semibold text-blue-300">Story 4 - CTA:</span>
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
