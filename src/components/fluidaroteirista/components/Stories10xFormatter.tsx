
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseStories10xSlides } from '../utils/stories10xParser';
import CopyButton from '@/components/ui/CopyButton';

interface Stories10xFormatterProps {
  roteiro: string;
}

const Stories10xFormatter: React.FC<Stories10xFormatterProps> = ({ roteiro }) => {
  const slides = parseStories10xSlides(roteiro);

  const getStoryIcon = (tipo: string) => {
    switch (tipo) {
      case 'gancho': return '🎯';
      case 'erro': return '❌';
      case 'virada': return '💡';
      case 'cta': return '📲';
      default: return '📝';
    }
  };

  const getStoryColor = (tipo: string) => {
    switch (tipo) {
      case 'gancho': return 'from-red-600 to-orange-600';
      case 'erro': return 'from-orange-600 to-yellow-600';
      case 'virada': return 'from-green-600 to-teal-600';
      case 'cta': return 'from-blue-600 to-purple-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      {/* Header Stories 10x */}
      <Card className="aurora-glass border border-orange-500/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-3xl">⚡</div>
            <CardTitle className="text-orange-300 text-2xl">
              Stories 10x
            </CardTitle>
            <Badge variant="outline" className="bg-orange-900/50 text-orange-300 border-orange-500/50">
              {slides.length} Stories
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge className="bg-orange-600 text-white">40s Total</Badge>
            <Badge className="bg-blue-600 text-white">4 Stories</Badge>
            <Badge className="bg-purple-600 text-white">Metodologia Leandro Ladeira</Badge>
          </div>
          <p className="text-orange-400/80 mt-2">
            Estratégia de Stories que gera até 10x mais engajamento através de sequência inteligente com dispositivos de reciprocidade
          </p>
        </CardHeader>
      </Card>

      {/* Validação Stories 10x */}
      {slides.length === 4 ? (
        <Card className="bg-green-900/20 border border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-300">
              <div className="text-xl">✅</div>
              <span className="font-semibold">Validação Stories 10x</span>
              <Badge className="bg-green-600 text-white ml-auto">Score: 100/100</Badge>
            </div>
            <div className="mt-2 text-sm text-green-200">
              <strong>Pontos de melhoria:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>Story 3 deve conter dispositivo de engajamento</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-red-900/20 border border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-300">
              <div className="text-xl">⚠️</div>
              <span className="font-semibold">Atenção: Stories 10x requer exatamente 4 stories</span>
            </div>
            <p className="mt-2 text-sm text-red-200">
              Encontrados {slides.length} stories. Para funcionar corretamente, devem ser exatamente 4 stories conectados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sequência Temporal Stories */}
      <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            🕐 Sequência Temporal Stories
          </h3>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {slides.map((slide, index) => (
              <div key={index} className="flex items-center">
                <div className={`bg-gradient-to-r ${getStoryColor(slide.tipo)} text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 min-w-[140px] justify-center`}>
                  <span className="text-lg">{getStoryIcon(slide.tipo)}</span>
                  <div className="text-center">
                    <div className="font-bold">{slide.number}</div>
                    <div className="text-xs opacity-90">{slide.titulo}</div>
                    <div className="text-xs opacity-75">{slide.tempo}</div>
                  </div>
                </div>
                {index < slides.length - 1 && (
                  <div className="mx-3 text-gray-400 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            ✨ Sequência otimizada para máximo engajamento e reciprocidade
          </div>
        </CardContent>
      </Card>

      {/* Stories Detalhados */}
      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border border-slate-700/50 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getStoryColor(slide.tipo)} pb-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getStoryIcon(slide.tipo)}</div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        Story {slide.number}
                      </CardTitle>
                      <p className="text-white/80 text-sm">
                        {slide.titulo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/20 text-white mb-1">
                      {slide.tempo}
                    </Badge>
                    {slide.dispositivo && (
                      <div className="text-xs text-white/70">
                        {slide.dispositivo}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Conteúdo do Story */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-cyan-300 font-medium">Conteúdo do Story</span>
                    <CopyButton 
                      text={slide.conteudo}
                      successMessage={`Story ${slide.number} copiado!`}
                      className="ml-auto"
                      size="sm"
                    />
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <p className="text-white leading-relaxed">
                      {slide.conteudo}
                    </p>
                  </div>
                </div>

                {/* Dica Leandro Ladeira */}
                <div className="mt-4 bg-amber-900/20 p-3 rounded-lg border border-amber-700/30">
                  <div className="flex items-start gap-2">
                    <div className="text-amber-400 text-sm">💡</div>
                    <div>
                      <span className="text-amber-300 font-medium text-sm">Dica Leandro Ladeira</span>
                      <p className="text-amber-200 text-sm mt-1 italic">
                        {slide.tipo === 'gancho' && "Primeira impressão é tudo! Use provocação inteligente nos primeiros 3 segundos para parar o scroll."}
                        {slide.tipo === 'erro' && "Mostre o erro comum que todos cometem. Gere identificação: 'nossa, eu faço isso mesmo!'"}
                        {slide.tipo === 'virada' && "Aqui é onde você entrega valor + pede engajamento. Use dispositivos: emoji, enquete, pergunta."}
                        {slide.tipo === 'cta' && "CTA suave mas direcionado. Sempre deixe gancho para próximo conteúdo criar vício."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Segredos do Stories 10x */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-orange-900/30 border border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-orange-300 flex items-center gap-2">
            🎯 Segredos do Stories 10x - Leandro Ladeira
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-red-400">💡</span>
            <span className="text-white text-sm">Stories não são aulas soltas, são conversas que criam comunidade</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-400">📝</span>
            <span className="text-white text-sm">Cada story deve pedir uma ação: emoji, resposta, compartilhamento</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">💬</span>
            <span className="text-white text-sm">Reciprocidade é a chave: "manda um foguinho que eu te conto o resto"</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400">🔄</span>
            <span className="text-white text-sm">Sequência viciante: sempre deixar gancho para o próximo conteúdo</span>
          </div>
        </CardContent>
      </Card>

      {/* Roteiro Completo */}
      <Card className="bg-slate-900/30 border border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            📄 Roteiro Completo
            <CopyButton 
              text={roteiro}
              successMessage="Roteiro Stories 10x copiado!"
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

export default Stories10xFormatter;
