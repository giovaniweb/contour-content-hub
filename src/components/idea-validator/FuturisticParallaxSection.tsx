
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxPrompt from './ParallaxPrompt';
import ThinkingAnimation from './ThinkingAnimation';
import { slideVariants, fadeIn } from '@/lib/animations';

interface FuturisticParallaxSectionProps {
  backgroundImage?: string;
  title?: string;
  onIdeaSubmit?: (idea: string) => void;
  showObjectiveChoice?: boolean;
  userIdea?: string;
}

const FuturisticParallaxSection: React.FC<FuturisticParallaxSectionProps> = ({ 
  backgroundImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", 
  title = "Validação de Ideias",
  onIdeaSubmit,
  showObjectiveChoice = false,
  userIdea = "",
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleSubmitIdea = (idea: string) => {
    if (!idea.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsAnalyzing(false);
      if (onIdeaSubmit) {
        onIdeaSubmit(idea);
      }
    }, 1500); // 1.5 seconds of "thinking"
  };
  
  return (
    <section className="parallax-section w-full min-h-[60vh] md:min-h-[50vh] relative flex items-center justify-center">
      {/* Background with parallax effect */}
      <div 
        className="parallax-background absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content Container */}
      <div className="w-full z-10 px-4 py-16 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {title}
          </motion.h2>
          
          <AnimatePresence mode="wait">
            {!isAnalyzing && !showObjectiveChoice && (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ParallaxPrompt onSubmit={handleSubmitIdea} isSubmitting={isAnalyzing} />
              </motion.div>
            )}
            
            {isAnalyzing && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              >
                <ThinkingAnimation />
              </motion.div>
            )}
            
            {showObjectiveChoice && userIdea && (
              <motion.div
                key="idea-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-medium mb-2">Sua ideia 💡</h3>
                  <p className="text-lg font-light italic">"{userIdea}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>
        {`
        .parallax-section {
          background: linear-gradient(45deg, rgba(0,148,251,0.1), rgba(243,0,252,0.1));
          overflow: hidden;
        }
        
        .parallax-background {
          background-size: cover;
          background-position: center;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.1s ease-out;
        }
        `}
      </style>
    </section>
  );
};

export default FuturisticParallaxSection;
