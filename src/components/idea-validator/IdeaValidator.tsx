
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FuturisticParallaxSection from './FuturisticParallaxSection';
import { fadeIn } from '@/lib/animations';
import EmotionalSalesChoice from './EmotionalSalesChoice';
import ValidationResponse from './ValidationResponse';
import AIResponseBlock from './AIResponseBlock';

type ValidationObjective = 'emotion' | 'sales' | null;
type ValidationMode = 'simple' | 'ai' | null;

const IdeaValidator: React.FC = () => {
  const [userIdea, setUserIdea] = useState<string>("");
  const [showObjectiveChoice, setShowObjectiveChoice] = useState<boolean>(false);
  const [validationObjective, setValidationObjective] = useState<ValidationObjective>(null);
  const [validationMode, setValidationMode] = useState<ValidationMode>(null);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);

  const handleIdeaSubmit = (idea: string) => {
    setUserIdea(idea);
    setShowObjectiveChoice(true);
  };

  const handleObjectiveSelect = (objective: ValidationObjective) => {
    setValidationObjective(objective);
    // By default, use the simple validation mode
    setValidationMode('simple');
    
    // Optionally, you can let users choose between simple and AI validation
    // For now, we'll simulate the AI response for the "AI" validation mode
    if (validationMode === 'ai') {
      // Mock AI evaluation (in a real app, this would be an API call)
      const mockEvaluation = {
        evaluation: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'excellent' : 'good') : 'needs-work',
        reasoning: generateMockReasoning(userIdea, objective),
        suggestion: Math.random() > 0.7 ? generateMockSuggestion(userIdea) : undefined,
        motivation: "Seu público está esperando por conteúdo que realmente conecte. Vamos criar isso juntos!"
      };
      setAiEvaluation(mockEvaluation);
    }
  };

  // Helper function to generate mock AI responses
  const generateMockReasoning = (idea: string, objective: ValidationObjective | null): string => {
    if (idea.toLowerCase().includes('massinha')) {
      return objective === 'emotion'
        ? "Essa ideia tem um forte apelo emocional por evocar memórias de infância e criar uma conexão entre gerações."
        : "O produto tem um excelente potencial de vendas por despertar nostalgia e oferecer uma experiência tangível em um mundo digital.";
    }
    return objective === 'emotion'
      ? "Sua ideia tem potencial para criar uma conexão emocional autêntica com seu público."
      : "Essa abordagem pode gerar boas conversões se apresentada com um bom gancho inicial e call-to-action.";
  };

  const generateMockSuggestion = (idea: string): string => {
    if (idea.toLowerCase().includes('tutorial')) {
      return "Considere adicionar um elemento de surpresa ou uma história pessoal para tornar o tutorial mais envolvente e memorável.";
    }
    return "Teste diferentes abordagens visuais para encontrar o que mais ressoa com seu público específico.";
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
      
      {validationObjective && validationMode === 'simple' && (
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
      
      {validationObjective && validationMode === 'ai' && aiEvaluation && (
        <motion.div
          className="w-full max-w-4xl mx-auto px-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AIResponseBlock 
            evaluation={aiEvaluation.evaluation}
            reasoning={aiEvaluation.reasoning}
            suggestion={aiEvaluation.suggestion}
            motivation={aiEvaluation.motivation}
            ideaText={userIdea}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default IdeaValidator;
