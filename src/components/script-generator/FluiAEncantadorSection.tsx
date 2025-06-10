
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Sparkles, Castle, Star, Wand2 } from 'lucide-react';
import MagicalButton from '@/components/ui/MagicalButton';

interface FluiAEncantadorSectionProps {
  onActivate: () => void;
  isActive: boolean;
  isProcessing: boolean;
}

const FluiAEncantadorSection: React.FC<FluiAEncantadorSectionProps> = ({
  onActivate,
  isActive,
  isProcessing
}) => {
  const fluiAPhrases = [
    "Quer que seu roteiro flua com a magia Disney? ✨",
    "Deixe o FluiA Encantador fazer sua história fluir como um conto de fadas! 🏰",
    "Que tal deixar sua criatividade fluir pela magia dos estúdios Disney? 🎬",
    "FluiA detectou: seu conteúdo pode fluir ainda mais encantador! 💫"
  ];

  const randomPhrase = fluiAPhrases[Math.floor(Math.random() * fluiAPhrases.length)];

  if (isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Castle className="h-6 w-6 text-purple-600" />
              <Star className="h-5 w-5 text-yellow-500" />
              <Sparkles className="h-6 w-6 text-pink-500" />
            </div>
            <div className="text-purple-700 font-medium">
              ✨ Encantado pelo FluiA Disney 1928! ✨
            </div>
            <div className="text-sm text-purple-600 mt-1">
              Seu roteiro agora flui com a magia atemporal de Walt Disney
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-orange-50/50 relative overflow-hidden">
        {/* Partículas de fundo sutis */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <CardContent className="p-8 text-center relative z-10">
          {/* Título mágico */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-purple-500" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                FluiA Encantador
              </h3>
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wand2 className="h-8 w-8 text-orange-500" />
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-purple-700 mb-2 font-medium"
            >
              {randomPhrase}
            </motion.p>
            
            <p className="text-sm text-purple-600 mb-6">
              Transforme seu roteiro com a metodologia storytelling Disney 1928 • 
              Era uma vez... até que um dia... então descobriu... e viveram felizes! 🎭
            </p>
          </motion.div>

          {/* Botão mágico principal */}
          <MagicalButton
            onClick={onActivate}
            disabled={isProcessing}
            isActive={false}
          >
            {isProcessing 
              ? "FluiA está encantando..." 
              : "✨ Ativar Magia Disney ✨"
            }
          </MagicalButton>

          {/* Subtext mágico */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs text-purple-500 italic"
          >
            "A magia acontece quando deixamos nossa criatividade fluir..." - FluiA ✨
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FluiAEncantadorSection;
