
import React from 'react';
import { motion } from 'framer-motion';

const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundImage: 'linear-gradient(45deg, rgba(0, 148, 251, 0.05), rgba(243, 0, 252, 0.05), rgba(111, 0, 255, 0.05), rgba(0, 255, 200, 0.05))',
          backgroundSize: '400% 400%',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
};

export default AuroraBackground;
