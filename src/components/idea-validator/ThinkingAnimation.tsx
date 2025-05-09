
import React from 'react';
import { motion } from 'framer-motion';

const ThinkingAnimation: React.FC = () => {
  // Animation variants for the bubbles
  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: [0, 1, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop" as const,
        duration: 1.5,
        delay: i * 0.2
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 text-white">
      <div className="flex items-center justify-center gap-3 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            className="w-3 h-3 bg-white rounded-full"
          />
        ))}
      </div>
      
      <motion.p
        className="text-lg text-center font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Analisando sua ideia com inteligência criativa...
      </motion.p>
    </div>
  );
};

export default ThinkingAnimation;
