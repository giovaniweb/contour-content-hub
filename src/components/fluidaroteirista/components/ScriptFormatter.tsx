
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselFormatter from './CarouselFormatter';
import Stories10xFormatter from './Stories10xFormatter';
import PostEstaticoFormatter from './PostEstaticoFormatter';
import ReelsFormatter from './ReelsFormatter';
import ScriptMetrics from './ScriptMetrics';
import EquipmentStatus from './EquipmentStatus';
import DisneyMagicIndicator from './DisneyMagicIndicator';
import EquipmentDetails from './EquipmentDetails';
import TimeWarning from './TimeWarning';
import CopyButton from '@/components/ui/CopyButton';
import { getFormatterType, shouldShowTimeMetrics } from '../utils/formatMapper';
import { sanitizeText, sanitizeScriptStructure } from '../utils/textSanitizer';

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

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  console.log('🎬 [ScriptFormatter] Formatando script:', { 
    formato: script.formato, 
    roteiro: script.roteiro.substring(0, 100) 
  });

  // Sanitizar texto UNIVERSALMENTE antes de usar
  const cleanScript = {
    ...script,
    roteiro: sanitizeScriptStructure(script.roteiro)
  };

  console.log('🧹 [ScriptFormatter] Texto após sanitização:', {
    original: script.roteiro.substring(0, 50),
    limpo: cleanScript.roteiro.substring(0, 50)
  });

  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const estimatedTime = estimateReadingTime(cleanScript.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;
  const wordCount = cleanScript.roteiro.split(/\s+/).length;
  const hasEquipments = cleanScript.equipamentos_utilizados && cleanScript.equipamentos_utilizados.length > 0;

  // Verificar se equipamentos foram realmente utilizados no roteiro
  const equipmentUsedInScript = hasEquipments ? 
    cleanScript.equipamentos_utilizados.some(eq => {
      const equipmentName = typeof eq === 'string' ? eq : (eq?.nome || '');
      return cleanScript.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
    }) : false;

  // Determinar formatter baseado no formato usando mapper
  const formatterType = getFormatterType(cleanScript.formato);
  const showTimeMetrics = shouldShowTimeMetrics(cleanScript.formato);

  console.log('🎯 [ScriptFormatter] Usando formatter:', formatterType, 'para formato:', cleanScript.formato);

  // Renderização condicional baseada no formato
  const renderScriptContent = () => {
    switch (formatterType) {
      case 'carrossel':
        return <CarouselFormatter roteiro={cleanScript.roteiro} />;
      
      case 'stories_10x':
        return <Stories10xFormatter roteiro={cleanScript.roteiro} />;
      
      case 'post_estatico':
        return <PostEstaticoFormatter roteiro={cleanScript.roteiro} />;
      
      case 'reels':
        return <ReelsFormatter 
          roteiro={cleanScript.roteiro} 
          formato={cleanScript.formato as 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_video'} 
        />;
      
      default:
        // Renderização padrão para outros formatos
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <Card className="aurora-glass border border-cyan-500/30 relative">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center text-2xl">
                  📝 Seu Roteiro FLUIDA
                </CardTitle>
                <p className="text-cyan-400/80 text-center">
                  Formato: {cleanScript.formato.toUpperCase()}
                </p>
              </CardHeader>
              <CardContent className="p-8 relative">
                <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium p-8 bg-slate-900/30 rounded-lg min-h-[300px] w-full relative">
                  {cleanScript.roteiro}
                  <CopyButton 
                    text={cleanScript.roteiro}
                    successMessage="Roteiro copiado!"
                    className="top-4 right-4"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Conteúdo Principal do Roteiro */}
      {renderScriptContent()}

      {/* Métricas Básicas - Só mostrar tempo para formatos que precisam */}
      <ScriptMetrics
        estimatedTime={showTimeMetrics ? estimatedTime : 0}
        isWithinTimeLimit={isWithinTimeLimit}
        wordCount={wordCount}
        emocao_central={cleanScript.emocao_central}
        formato={cleanScript.formato}
        showTime={showTimeMetrics}
      />

      {/* Disney Magic Badge */}
      <DisneyMagicIndicator disneyApplied={cleanScript.disney_applied || false} />

      {/* Equipamentos Detalhados - Mostrar apenas se houver equipamentos utilizados */}
      {hasEquipments && equipmentUsedInScript && (
        <EquipmentDetails
          equipments={cleanScript.equipamentos_utilizados || []}
          roteiro={cleanScript.roteiro}
        />
      )}

      {/* Aviso de Tempo - Apenas para formatos com tempo */}
      {showTimeMetrics && (
        <TimeWarning
          isWithinTimeLimit={isWithinTimeLimit}
          estimatedTime={estimatedTime}
        />
      )}
    </div>
  );
};

export default ScriptFormatter;
