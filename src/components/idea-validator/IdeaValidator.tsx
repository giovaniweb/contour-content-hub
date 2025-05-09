
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FuturisticParallaxSection from './FuturisticParallaxSection';
import { fadeIn } from '@/lib/animations';
import EmotionalSalesChoice from './EmotionalSalesChoice';
import ValidationResponse from './ValidationResponse';

type ValidationObjective = 'emotion' | 'sales' | null;

const IdeaValidator: React.FC = () => {
  const [userIdea, setUserIdea] = useState<string>("");
  const [showObjectiveChoice, setShowObjectiveChoice] = useState<boolean>(false);
  const [validationObjective, setValidationObjective] = useState<ValidationObjective>(null);

  const handleIdeaSubmit = (idea: string) => {
    setUserIdea(idea);
    setShowObjectiveChoice(true);
  };

  const handleObjectiveSelect = (objective: ValidationObjective) => {
    setValidationObjective(objective);
  };

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
        onIdeaSubmit={handleIdeaSubmit}
        showObjectiveChoice={showObjectiveChoice}
        userIdea={userIdea}
      />
      
      {showObjectiveChoice && !validationObjective && (
        <motion.div 
          className="w-full max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmotionalSalesChoice 
            onObjectiveSelect={handleObjectiveSelect} 
          />
        </motion.div>
      )}
      
      {validationObjective && (
        <motion.div
          className="w-full max-w-4xl mx-auto px-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ValidationResponse 
            ideaText={userIdea} 
            objective={validationObjective} 
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default IdeaValidator;
