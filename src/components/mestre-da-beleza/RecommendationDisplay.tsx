
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap, Heart, TrendingUp, Award, CheckCircle } from "lucide-react";
import { Equipment } from '@/types/equipment';

interface RecommendationResult {
  equipamento: Equipment;
  confianca: number;
  motivo: string;
  cta: string;
  score_breakdown?: Record<string, number>;
}

interface RecommendationDisplayProps {
  recommendation: RecommendationResult;
  onContinue: () => void;
  onNewChat: () => void;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendation,
  onContinue,
  onNewChat
}) => {
  const { equipamento, confianca, motivo, cta, score_breakdown } = recommendation;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400 border-green-400';
    if (confidence >= 75) return 'text-yellow-400 border-yellow-400';
    if (confidence >= 60) return 'text-orange-400 border-orange-400';
    return 'text-red-400 border-red-400';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <Award className="w-4 h-4" />;
    if (confidence >= 75) return <Star className="w-4 h-4" />;
    if (confidence >= 60) return <TrendingUp className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'Combinação Perfeita!';
    if (confidence >= 75) return 'Excelente Combinação';
    if (confidence >= 60) return 'Boa Combinação';
    return 'Possível Solução';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Header da Revelação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-4"
      >
        <div className="text-4xl mb-2">🎭✨</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Revelação Mágica Completa!
        </h2>
        <p className="text-purple-200 text-lg">
          Após analisar suas respostas, descobri o equipamento perfeito para você...
        </p>
      </motion.div>

      {/* Card Principal do Equipamento */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm border-2 border-purple-400/50 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{equipamento.nome}</h3>
                  <p className="text-purple-200 text-sm font-normal">{equipamento.tecnologia}</p>
                </div>
              </CardTitle>
              
              <Badge 
                className={`${getConfidenceColor(confianca)} bg-white/10 px-4 py-2 text-base font-semibold`}
              >
                {getConfidenceIcon(confianca)}
                <span className="ml-2">{confianca}% Match</span>
              </Badge>
            </div>
            
            <div className="text-center">
              <span className={`text-lg font-semibold ${getConfidenceColor(confianca).split(' ')[0]}`}>
                {getConfidenceText(confianca)}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Imagem do Equipamento */}
            {equipamento.image_url && (
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-800">
                <img 
                  src={equipamento.image_url} 
                  alt={equipamento.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Por que é perfeito */}
            <div className="bg-purple-800/40 rounded-lg p-4">
              <h4 className="text-purple-200 font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Por que é perfeito para você
              </h4>
              <p className="text-white leading-relaxed">{motivo}</p>
            </div>

            {/* Score Breakdown (se disponível) */}
            {score_breakdown && Object.keys(score_breakdown).length > 0 && (
              <div className="bg-purple-800/30 rounded-lg p-4">
                <h4 className="text-purple-200 font-semibold mb-3">🎯 Análise Detalhada</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(score_breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-purple-100 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-yellow-400 font-semibold">+{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicações */}
            <div>
              <h4 className="text-purple-200 font-semibold mb-2">✨ Indicações</h4>
              <p className="text-white">{equipamento.indicacoes}</p>
            </div>

            {/* Benefícios */}
            <div>
              <h4 className="text-purple-200 font-semibold mb-2">💫 Benefícios</h4>
              <p className="text-white">{equipamento.beneficios}</p>
            </div>

            {/* Diferenciais */}
            {equipamento.diferenciais && (
              <div>
                <h4 className="text-purple-200 font-semibold mb-2">⚡ Diferenciais</h4>
                <p className="text-white">{equipamento.diferenciais}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Botões de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col gap-4"
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {cta}
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={onContinue}
            variant="outline"
            className="bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30"
          >
            Ver Detalhes Técnicos
          </Button>
          
          <Button
            onClick={onNewChat}
            variant="outline"
            className="bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30"
          >
            Nova Consulta Mágica
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-white"
          onClick={() => window.open(`/equipments/${equipamento.id}`, '_blank')}
        >
          📋 Ver ficha técnica completa
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-purple-300 text-sm border-t border-purple-500/30 pt-4"
      >
        <p>✨ Recomendação baseada em análise inteligente dos equipamentos cadastrados</p>
        <p className="text-xs mt-1 text-purple-400">
          Consulte sempre um profissional qualificado para avaliação completa
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationDisplay;
