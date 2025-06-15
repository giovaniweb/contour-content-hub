
import React from "react";
import { motion } from 'framer-motion';
import { Sparkles } from "lucide-react";

const FeaturesBanner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mt-4 sm:mt-8 p-6 aurora-glass border-aurora-electric-purple/30 rounded-2xl shadow-aurora-glow"
  >
    <div className="flex items-center justify-center gap-2 mb-4">
      <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
      <h3 className="text-lg font-semibold text-white">
        Recursos Disponíveis
      </h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-slate-200">
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-electric-purple font-medium mb-1">✨ Disney Magic</div>
        <div>Transformação encantadora</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-neon-blue font-medium mb-1">🖼️ Geração de Imagem</div>
        <div>Arte com IA real</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-emerald font-medium mb-1">🎙️ Áudio Narrado</div>
        <div>Voz encantadora</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-lime font-medium mb-1">📸 Antes & Depois</div>
        <div>Documente resultados</div>
      </motion.div>
    </div>
  </motion.div>
);

export default FeaturesBanner;
