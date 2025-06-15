
import React from "react";
import { motion } from 'framer-motion';
import { Sparkles } from "lucide-react";

const FeaturesBanner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mt-8 p-6 aurora-glass border-aurora-electric-purple/20 rounded-lg"
  >
    <div className="flex items-center justify-center gap-2 mb-4">
      <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
      <h3 className="text-lg font-semibold text-white">
        Recursos Disponíveis
      </h3>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-electric-purple font-medium">✨ Disney Magic</div>
        <div>Transformação encantadora</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-electric-purple font-medium">🖼️ Geração de Imagem</div>
        <div>Arte com IA real</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-electric-purple font-medium">🎙️ Áudio Narrado</div>
        <div>Voz encantadora</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-aurora-electric-purple font-medium">📸 Antes & Depois</div>
        <div>Documente resultados</div>
      </motion.div>
    </div>
  </motion.div>
);

export default FeaturesBanner;
