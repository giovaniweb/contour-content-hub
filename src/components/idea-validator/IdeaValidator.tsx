
import React from 'react';
import { motion } from 'framer-motion';
import FuturisticParallaxSection from './FuturisticParallaxSection';
import { fadeIn } from '@/lib/animations';

const IdeaValidator: React.FC = () => {
  return (
    <motion.div 
      className="idea-validator-container h-full flex-1 flex flex-col"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <FuturisticParallaxSection 
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        title="Validador de Ideias"
      />
    </motion.div>
  );
};

export default IdeaValidator;
