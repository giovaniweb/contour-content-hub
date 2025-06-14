
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Heart, Target, Timer } from "lucide-react";

interface ScriptMetricsProps {
  estimatedTime: number;
  isWithinTimeLimit: boolean;
  wordCount: number;
  emocao_central: string;
  formato: string;
  showTime: boolean;
}

const ScriptMetrics: React.FC<ScriptMetricsProps> = ({
  estimatedTime,
  isWithinTimeLimit,
  wordCount,
  emocao_central,
  formato,
  showTime
}) => {
  const getEmotionColor = (emotion: string) => {
    const emotionColors: { [key: string]: string } = {
      'confiança': 'bg-blue-100 text-blue-800 border-blue-300',
      'curiosidade': 'bg-purple-100 text-purple-800 border-purple-300',
      'urgência': 'bg-red-100 text-red-800 border-red-300',
      'tranquilidade': 'bg-green-100 text-green-800 border-green-300',
      'encantamento': 'bg-pink-100 text-pink-800 border-pink-300',
      'esperança': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return emotionColors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getFormatColor = (format: string) => {
    const formatColors: { [key: string]: string } = {
      'carrossel': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'stories': 'bg-orange-100 text-orange-800 border-orange-300',
      'stories_10x': 'bg-orange-100 text-orange-800 border-orange-300',
      'post_estatico': 'bg-green-100 text-green-800 border-green-300',
      'reels': 'bg-purple-100 text-purple-800 border-purple-300',
      'video': 'bg-red-100 text-red-800 border-red-300'
    };
    return formatColors[format.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Card className="bg-slate-900/30 border border-slate-700/50">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Métricas do Roteiro
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tempo Estimado - apenas se showTime for true */}
          {showTime && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className={`p-2 rounded-full ${isWithinTimeLimit ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <Clock className={`h-4 w-4 ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <div className="text-sm text-slate-400">Tempo Estimado</div>
                <div className={`font-semibold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
                  {estimatedTime}s
                </div>
              </div>
            </div>
          )}

          {/* Contagem de Palavras */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="p-2 rounded-full bg-blue-900/50">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Palavras</div>
              <div className="font-semibold text-blue-400">
                {wordCount}
              </div>
            </div>
          </div>

          {/* Emoção Central */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="p-2 rounded-full bg-pink-900/50">
              <Heart className="h-4 w-4 text-pink-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-1">Emoção</div>
              <Badge 
                variant="outline" 
                className={`${getEmotionColor(emocao_central)} text-xs font-medium border`}
              >
                {emocao_central}
              </Badge>
            </div>
          </div>

          {/* Formato */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="p-2 rounded-full bg-purple-900/50">
              <Target className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-400 mb-1">Formato</div>
              <Badge 
                variant="outline" 
                className={`${getFormatColor(formato)} text-xs font-medium border`}
              >
                {formato.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Indicadores Específicos do Formato */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          {formato.toLowerCase() === 'carrossel' && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Estrutura: 5 slides com texto + descrição visual detalhada</span>
            </div>
          )}
          
          {(formato.toLowerCase() === 'stories' || formato.toLowerCase() === 'stories_10x') && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Metodologia: Stories 10x - Leandro Ladeira</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Objetivo: Gerar até 10x mais engajamento através de dispositivos</span>
              </div>
            </div>
          )}
          
          {formato.toLowerCase() === 'post_estatico' && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Estrutura: Imagem + texto sobreposto + legenda completa</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptMetrics;
