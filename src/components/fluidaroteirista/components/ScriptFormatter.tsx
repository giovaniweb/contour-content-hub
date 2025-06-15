import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselFormatter from './CarouselFormatter';
import Stories10xFormatter from './Stories10xFormatter';
import PostEstaticoFormatter from './PostEstaticoFormatter';
import ScriptMetrics from './ScriptMetrics';
import EquipmentStatus from './EquipmentStatus';
import DisneyMagicIndicator from './DisneyMagicIndicator';
import EquipmentDetails from './EquipmentDetails';
import TimeWarning from './TimeWarning';
import CopyButton from '@/components/ui/CopyButton';
import { parseStories10xSlides } from '../utils/stories10xParser';
import { MessageSquare, Clock, AudioWaveform } from "lucide-react";

interface ScriptFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
    equipamentos_utilizados?: any[];
    disney_applied?: boolean;
  };
}

const TITLES = [
  "Gancho", 
  "Erro", 
  "Virada", 
  "CTA", 
  "Dispositivo", 
  "Chamada para Ação",
  "Introdução"
];

// Função para separar o texto em blocos usando os títulos conhecidos
function splitByTitles(text: string) {
  // Regex: encontra títulos no início de linha (inclusive com pontuação).
  const regex = new RegExp(`^(${TITLES.join('|')})[:：-]?\\s*`, 'im');

  // 1. Encontra todos títulos para divisão
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  const sections: { titulo: string | null, conteudo: string }[] = [];
  let currentTitle: string | null = null;
  let buffer = [];

  for (let line of lines) {
    const match = line.match(/^([A-Za-zÀ-ÿ\s]+)[:：-]\s*/);
    const rawTitle = match && TITLES.includes(match[1].trim());
    if (rawTitle) {
      // Salva o bloco anterior
      if (buffer.length > 0) {
        sections.push({
          titulo: currentTitle,
          conteudo: buffer.join('\n').trim()
        });
        buffer = [];
      }
      currentTitle = match![1].trim();
      line = line.replace(/^([A-Za-zÀ-ÿ\s]+)[:：-]\s*/, '');
    }
    buffer.push(line);
  }

  // Último bloco
  if (buffer.length) {
    sections.push({
      titulo: currentTitle,
      conteudo: buffer.join('\n').trim()
    });
  }

  // Se nada foi identificado, retorna tudo junto sem título
  if (sections.length === 1 && !sections[0].titulo) {
    return [
      { titulo: null, conteudo: text }
    ];
  }
  return sections;
}

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;
  const wordCount = script.roteiro.split(/\s+/).length;
  const hasEquipments = script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0;

  // Verificar se equipamentos foram realmente utilizados no roteiro
  const equipmentUsedInScript = hasEquipments ? 
    script.equipamentos_utilizados.some(eq => {
      const equipmentName = typeof eq === 'string' ? eq : (eq?.nome || '');
      return script.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
    }) : false;

  // Renderização condicional baseada no formato
  const renderScriptContent = () => {
    if (script.formato.toLowerCase() === 'carrossel') {
      return <CarouselFormatter roteiro={script.roteiro} />;
    }

    if (script.formato.toLowerCase() === 'stories_10x') {
      const slides = parseStories10xSlides(script.roteiro);
      return <Stories10xFormatter slides={slides} />;
    }

    if (script.formato.toLowerCase() === 'post_estatico') {
      return <PostEstaticoFormatter roteiro={script.roteiro} />;
    }

    // Renderização padrão para outros formatos — reformulado!
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="aurora-glass border border-cyan-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple/10 via-aurora-neon-blue/10 to-aurora-soft-pink/5 opacity-40 pointer-events-none" />
          <CardHeader className="flex flex-col items-center z-10 relative pb-2">
            <div className="flex items-center gap-3 justify-center mb-2">
              <MessageSquare className="h-8 w-8 text-aurora-electric-purple aurora-glow" />
              <CardTitle className="text-cyan-300 text-center text-2xl drop-shadow aurora-heading">
                Fala do Roteiro
              </CardTitle>
            </div>
            <div className="flex gap-4 items-center justify-center mt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-200 font-semibold">~{estimatedTime}s</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <AudioWaveform className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-pink-200 font-semibold">Áudio</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md">
                <span className="font-mono text-xs text-purple-200">{wordCount} palavras</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 px-5 pb-7 relative z-10">
            <div className="relative w-full flex flex-col items-center text-center gap-6">
              {/* Título da seção */}
              <div className="w-full flex flex-col items-center gap-2">
                <h3 className="text-aurora-electric-purple text-lg font-bold tracking-wide aurora-heading mb-1">
                  🎬 Fala do Roteiro
                </h3>
                <div className="flex gap-2 justify-center items-center">
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-neon-blue/10 text-blue-200 text-xs font-semibold">
                    <Clock className="h-4 w-4 text-blue-400" />
                    {estimatedTime}s
                  </span>
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-soft-pink/10 text-pink-200 text-xs font-semibold">
                    <AudioWaveform className="h-4 w-4 text-pink-400" />
                    Áudio
                  </span>
                  <span className="flex items-center gap-2 rounded-md px-2 py-1 bg-aurora-electric-purple/10 text-purple-200 text-xs font-mono">
                    {wordCount} palavras
                  </span>
                  <CopyButton
                    text={script.roteiro}
                    successMessage="Roteiro copiado!"
                    className="ml-2"
                    position="relative"
                  />
                </div>
              </div>
              {/* Linha divisória */}
              <div className="w-full border-t border-aurora-electric-purple/20 my-2" />
              {/* Bloco do texto do roteiro */}
              <div className="relative bg-slate-900/80 px-6 py-6 rounded-2xl shadow-inner aurora-glass border-aurora-neon-blue/10 min-h-[180px] w-full max-w-2xl mx-auto flex flex-col items-center">
                {/* Aspas decorativas */}
                <span className="absolute left-2 top-3 text-3xl text-aurora-electric-purple opacity-70 select-none">“</span>
                <span className="absolute right-2 bottom-3 text-3xl text-aurora-electric-purple opacity-70 select-none">”</span>
                <div className="flex flex-col gap-8 w-full">
                  {splitByTitles(script.roteiro).map((block, i) => (
                    <div key={i} className="text-left w-full max-w-2xl mx-auto">
                      {block.titulo && (
                        <>
                          <h4 className="text-aurora-electric-purple text-lg font-bold mb-2 mt-2 aurora-heading tracking-wide flex items-center gap-2">
                            <span>
                              {/* Ícone por título */}
                              {block.titulo === "Gancho" && <span className="text-blue-300">🎯</span>}
                              {block.titulo === "Erro" && <span className="text-yellow-400">⚡</span>}
                              {block.titulo === "Virada" && <span className="text-pink-300">🔄</span>}
                              {block.titulo === "CTA" && <span className="text-green-300">🚀</span>}
                              {block.titulo === "Dispositivo" && <span className="text-cyan-400">📲</span>}
                              {block.titulo === "Chamada para Ação" && <span className="text-green-400">👉</span>}
                              {block.titulo === "Introdução" && <span className="text-purple-300">✨</span>}
                            </span>
                            {block.titulo}
                          </h4>
                          <hr className="border-aurora-electric-purple/20 mb-3" />
                        </>
                      )}
                      <div className="text-slate-100 text-lg leading-relaxed font-medium whitespace-pre-line aurora-body px-2">
                        {block.conteudo}
                      </div>
                    </div>
                  ))}
                </div>
                {/* /FIM DO BLOCO DE TEXTO */}
              </div>
            </div>
            <div className="w-full flex justify-center pt-4 gap-2">
              <button
                className="flex items-center gap-1 px-5 py-2 rounded-lg bg-aurora-electric-purple/90 hover:bg-aurora-emerald/80 text-white font-semibold shadow transition-all text-base disabled:opacity-60"
                disabled
                title="Funcionalidade futura"
              >
                <AudioWaveform className="h-5 w-5 animate-pulse text-white" />
                Ouvir Áudio
                <span className="ml-1 text-xs text-white/70">(em breve)</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Stories 10x também não precisa de contagem de tempo (formato estático)
  const showTimeMetric = !['post_estatico', 'carrossel', 'stories_10x'].includes(script.formato.toLowerCase());

  return (
    <div className="space-y-6 w-full">
      {/* Conteúdo Principal do Roteiro */}
      {renderScriptContent()}

      {/* Métricas Básicas */}
      <ScriptMetrics
        estimatedTime={estimatedTime}
        isWithinTimeLimit={isWithinTimeLimit}
        wordCount={wordCount}
        emocao_central={script.emocao_central}
        formato={script.formato}
        showTime={showTimeMetric}
      />

      {/* Disney Magic Badge */}
      <DisneyMagicIndicator disneyApplied={script.disney_applied || false} />

      {/* Equipamentos Detalhados - Mostrar apenas se houver equipamentos utilizados */}
      {hasEquipments && equipmentUsedInScript && (
        <EquipmentDetails
          equipments={script.equipamentos_utilizados || []}
          roteiro={script.roteiro}
        />
      )}

      {/* Aviso de Tempo - Apenas para formatos com tempo */}
      {showTimeMetric && (
        <TimeWarning
          isWithinTimeLimit={isWithinTimeLimit}
          estimatedTime={estimatedTime}
        />
      )}
    </div>
  );
};

export default ScriptFormatter;
