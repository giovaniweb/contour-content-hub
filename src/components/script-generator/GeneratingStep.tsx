
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const GeneratingStep: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.div 
        className="p-12 rounded-2xl bg-gradient-to-r from-fluida-blue/5 to-fluida-pink/5 border border-blue-100/40 shadow-lg dark:border-purple-900/40"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-12">
          <div className="flex justify-center mb-12">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-fluida-blue/30 to-fluida-pink/30 blur-2xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="relative h-24 w-24 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 text-fluida-pink" />
              </motion.div>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
            Gerando seu roteiro mágico...
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Estou aplicando técnicas criativas para transformar sua ideia em um roteiro impactante.
          </p>
          
          <div className="mt-12">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3 overflow-hidden">
              <motion.div
                className="h-2.5 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-fluida-blue" />
                <span>Analisando tema</span>
              </motion.div>
              <span>→</span>
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Aplicando Magia Disney</span>
              </motion.div>
              <span>→</span>
              <motion.div 
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="flex items-center gap-1.5"
              >
                <div className="h-2 w-2 rounded-full bg-fluida-pink" />
                <span>Refinando script</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GeneratingStep;
