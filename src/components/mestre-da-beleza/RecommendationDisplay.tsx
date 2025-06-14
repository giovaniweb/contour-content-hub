
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap, Heart } from "lucide-react";
import { Equipment } from '@/types/equipment';

interface RecommendationResult {
  equipamento: Equipment;
  confianca: number;
  motivo: string;
  cta: string;
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
  const { equipamento, confianca, motivo, cta } = recommendation;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <Star className="w-4 h-4" />;
    if (confidence >= 75) return <Sparkles className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Revelação Mágica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="text-2xl mb-2">🎭</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Revelação Mágica!
        </h3>
        <p className="text-purple-200">
          Descobri exatamente o que você precisa...
        </p>
      </motion.div>

      {/* Card do Equipamento */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-sm border border-purple-400/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-400" />
                {equipamento.nome}
              </CardTitle>
              <Badge 
                className={`${getConfidenceColor(confianca)} bg-white/10 border-white/20`}
              >
                {getConfidenceIcon(confianca)}
                {confianca}% Match
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Imagem do Equipamento */}
            {equipamento.image_url && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={equipamento.image_url} 
                  alt={equipamento.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tecnologia */}
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">✨ Tecnologia</h4>
              <p className="text-white">{equipamento.tecnologia}</p>
            </div>

            {/* Motivo da Recomendação */}
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">🎯 Por que é perfeito para você</h4>
              <p className="text-white">{motivo}</p>
            </div>

            {/* Benefícios */}
            <div>
              <h4 className="text-purple-300 font-semibold mb-2">💫 Benefícios</h4>
              <p className="text-white">{equipamento.beneficios}</p>
            </div>

            {/* Diferenciais */}
            {equipamento.diferenciais && (
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">⚡ Diferenciais</h4>
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
        className="flex flex-col gap-3"
      >
        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {cta}
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={onContinue}
            variant="outline"
            className="flex-1 bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30"
          >
            Ver outras opções
          </Button>
          
          <Button
            onClick={onNewChat}
            variant="outline"
            className="flex-1 bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30"
          >
            Nova consulta
          </Button>
        </div>
      </motion.div>

      {/* Mensagem Final */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-purple-200 text-sm"
      >
        ✨ Recomendação baseada nos equipamentos cadastrados no sistema Fluida
      </motion.div>
    </motion.div>
  );
};

export default RecommendationDisplay;
