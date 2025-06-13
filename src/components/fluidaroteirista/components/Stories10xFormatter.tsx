
import React from 'react';
import { motion } from 'framer-motion';
import { parseStories10xSlides, validateStories10x } from '../utils/stories10xParser';
import Stories10xSlideCard from './Stories10xSlideCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Timer, Zap, Target, CheckCircle, AlertTriangle } from 'lucide-react';

interface Stories10xFormatterProps {
  roteiro: string;
}

const Stories10xFormatter: React.FC<Stories10xFormatterProps> = ({ roteiro }) => {
  const slides = parseStories10xSlides(roteiro);
  const validation = validateStories10x(slides);

  if (slides.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">Nenhum story encontrado no roteiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stories 10x */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <Zap className="h-10 w-10 text-orange-400 aurora-glow" />
          <h2 className="text-3xl font-bold aurora-heading">Stories 10x</h2>
          <Instagram className="h-8 w-8 text-pink-400 aurora-glow" />
        </div>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            <Timer className="h-3 w-3 mr-1" />
            40s Total
          </Badge>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Target className="h-3 w-3 mr-1" />
            4 Stories
          </Badge>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Zap className="h-3 w-3 mr-1" />
            Metodologia Leandro Ladeira
          </Badge>
        </div>
        
        <p className="text-sm text-slate-300 aurora-body max-w-2xl mx-auto">
          Estratégia de Stories que gera até 10x mais engajamento através de sequência inteligente com dispositivos de reciprocidade
        </p>
      </motion.div>

      {/* Validação da Metodologia */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`aurora-glass border ${validation.isValid ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
          <CardHeader className="pb-4">
            <CardTitle className={`flex items-center gap-3 ${validation.isValid ? 'text-green-400' : 'text-yellow-400'}`}>
              {validation.isValid ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
              Validação Stories 10x
              <Badge variant="outline" className={validation.isValid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                Score: {validation.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.isValid ? (
              <p className="text-green-300 text-sm">
                ✅ Roteiro segue perfeitamente a metodologia Stories 10x do Leandro Ladeira
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-yellow-300 text-sm font-medium">Pontos de melhoria:</p>
                <ul className="space-y-1">
                  {validation.issues.map((issue, index) => (
                    <li key={index} className="text-yellow-200 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline da Sequência */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="aurora-glass border-purple-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-orange-500/5 to-pink-500/5 opacity-50" />
          
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-center aurora-heading text-xl text-purple-300">
              📱 Sequência Temporal Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              {slides.map((slide, index) => (
                <React.Fragment key={index}>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold aurora-glow mb-2 relative ${getStoryColor(slide.tipo)}`}>
                      <span className="relative z-10">{index + 1}</span>
                      <div className="absolute inset-0 rounded-full opacity-50 animate-ping" style={{backgroundColor: getStoryBgColor(slide.tipo)}} />
                    </div>
                    <div className={`text-xs font-medium aurora-body ${getStoryTextColor(slide.tipo)}`}>
                      {slide.titulo}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {slide.tempo}
                    </div>
                  </motion.div>
                  {index < slides.length - 1 && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-orange-400 opacity-60" />
                      <div className="text-xs text-slate-500 mt-1">→</div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-sm aurora-body">
              ✨ Sequência otimizada para máximo engajamento e reciprocidade
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stories Individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <Stories10xSlideCard key={index} slide={slide} />
        ))}
      </div>

      {/* Dispositivos de Engajamento Detectados */}
      {slides.some(s => s.dispositivo) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="aurora-glass border-cyan-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-50" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-cyan-300 text-xl flex items-center gap-3 aurora-heading">
                <Zap className="h-6 w-6 aurora-glow" />
                Dispositivos de Engajamento Detectados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm relative z-10">
              {slides.filter(s => s.dispositivo).map((slide, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-cyan-400 text-lg font-bold">Story {slide.number}</span>
                  <div className="flex-1">
                    <div className="text-cyan-300 font-medium">{slide.dispositivo}</div>
                    <div className="text-slate-300 text-xs mt-1">
                      {slide.conteudo.substring(0, 80)}...
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dicas da Metodologia Leandro Ladeira */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="aurora-glass border-orange-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-50" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-orange-300 text-xl flex items-center gap-3 aurora-heading">
              <Target className="h-6 w-6 aurora-glow" />
              Segredos do Stories 10x - Leandro Ladeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm relative z-10">
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-orange-400 text-lg">🎯</span>
              <span className="aurora-body">Stories não são aulas soltas, são conversas que criam comunidade</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-orange-400 text-lg">🔥</span>
              <span className="aurora-body">Cada story deve pedir uma ação: emoji, resposta, compartilhamento</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-orange-400 text-lg">💬</span>
              <span className="aurora-body">Reciprocidade é a chave: "manda um foguinho que eu te conto o resto"</span>
            </motion.div>
            <motion.div 
              className="flex items-start gap-3 p-3 aurora-glass rounded-lg border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-orange-400 text-lg">⚡</span>
              <span className="aurora-body">Sequência viciante: sempre deixar gancho para o próximo conteúdo</span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const getStoryColor = (tipo: string): string => {
  const colors = {
    gancho: 'bg-gradient-to-br from-red-500 to-orange-500',
    erro: 'bg-gradient-to-br from-yellow-500 to-orange-500', 
    virada: 'bg-gradient-to-br from-green-500 to-cyan-500',
    cta: 'bg-gradient-to-br from-blue-500 to-purple-500'
  };
  return colors[tipo as keyof typeof colors] || colors.gancho;
};

const getStoryBgColor = (tipo: string): string => {
  const colors = {
    gancho: '#ef4444',
    erro: '#f59e0b',
    virada: '#10b981', 
    cta: '#3b82f6'
  };
  return colors[tipo as keyof typeof colors] || colors.gancho;
};

const getStoryTextColor = (tipo: string): string => {
  const colors = {
    gancho: 'text-red-400',
    erro: 'text-yellow-400',
    virada: 'text-green-400',
    cta: 'text-blue-400'
  };
  return colors[tipo as keyof typeof colors] || colors.gancho;
};

export default Stories10xFormatter;
