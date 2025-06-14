
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Wand2 } from 'lucide-react';
import MestreDaBelezaChat from '@/components/mestre-da-beleza/MestreDaBelezaChat';

const MestreDaBelezaPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Mágico */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 shadow-2xl"
            >
              <Crown className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Partículas mágicas ao redor da coroa */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 -m-4"
            >
              <Sparkles className="absolute top-0 left-1/2 w-4 h-4 text-yellow-300 -translate-x-1/2" />
              <Sparkles className="absolute bottom-0 right-0 w-3 h-3 text-pink-300" />
              <Sparkles className="absolute top-1/2 left-0 w-3 h-3 text-purple-300 -translate-y-1/2" />
              <Wand2 className="absolute top-1/4 right-1/4 w-5 h-5 text-cyan-300" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              Mestre da Beleza
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              ✨ Sua inteligência mágica que descobre o que você precisa — 
              <br />
              <span className="text-pink-300">mesmo quando você ainda não sabe explicar!</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">
                Pronto para descobrir a magia da sua beleza?
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Interface do Chat Mágico */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-4xl mx-auto"
        >
          <MestreDaBelezaChat />
        </motion.div>

        {/* Footer Mágico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-white/60 text-sm"
        >
          <p>
            🪄 Criado com magia para médicos, profissionais da estética e clientes que buscam sua melhor versão
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MestreDaBelezaPage;
