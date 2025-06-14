
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Gem, Star, Zap } from "lucide-react";

interface AkinatorWelcomeScreenProps {
  equipmentsCount: number;
  onStart: () => void;
}

const AkinatorWelcomeScreen: React.FC<AkinatorWelcomeScreenProps> = ({
  equipmentsCount,
  onStart,
}) => (
  <div className="text-center space-y-8">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6"
        >
          <Gem className="h-12 w-12 text-white" />
        </motion.div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">
        🔮 Mestre da Beleza Mágico
      </h1>
      <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
        Vou descobrir o equipamento perfeito para você através de perguntas inteligentes...
      </p>
      <div className="text-sm text-purple-300 mt-4">
        {equipmentsCount} equipamentos disponíveis para análise
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-center space-x-2 text-yellow-400">
        <Star className="h-5 w-5" />
        <span className="text-sm">Prepare-se para uma experiência personalizada</span>
        <Star className="h-5 w-5" />
      </div>
      <Button
        onClick={onStart}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg"
      >
        <Zap className="mr-2 h-5 w-5" />
        Iniciar Consulta Mágica
      </Button>
    </motion.div>
  </div>
);

export default AkinatorWelcomeScreen;

