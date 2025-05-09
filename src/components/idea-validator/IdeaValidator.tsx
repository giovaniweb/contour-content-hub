
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FuturisticParallaxSection from './FuturisticParallaxSection';

const IdeaValidator: React.FC = () => {
  return (
    <div className="idea-validator-container h-full flex-1 flex flex-col">
      <FuturisticParallaxSection 
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        title="Validador de Ideias"
      />
    </div>
  );
};

export default IdeaValidator;
