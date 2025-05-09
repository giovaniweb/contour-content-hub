
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxPrompt from './ParallaxPrompt';
import ThinkingAnimation from './ThinkingAnimation';
import AIResponseBlock from './AIResponseBlock';
import { slideVariants, fadeIn } from '@/lib/animations';

interface FuturisticParallaxSectionProps {
  backgroundImage?: string;
  title?: string;
}

const FuturisticParallaxSection: React.FC<FuturisticParallaxSectionProps> = ({ 
  backgroundImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", 
  title = "Validação de Ideias" 
}) => {
  const [userIdea, setUserIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  
  const handleSubmitIdea = (idea: string) => {
    setUserIdea(idea);
    setIsAnalyzing(true);
    
    // Simulate API request delay
    setTimeout(() => {
      const responses = [
        {
          evaluation: 'excellent',
          reasoning: "Esta ideia tem um excelente potencial para engajar seu público. O formato é atraente e o tema está alinhado com as tendências atuais.",
          suggestion: "Considere adicionar dicas práticas ou um antes e depois para tornar o conteúdo ainda mais valioso.",
          motivation: "Vamos transformar esta ideia em algo incrível! Seu público vai adorar ver este conteúdo autêntico e útil!"
        },
        {
          evaluation: 'good',
          reasoning: "Esta é uma ideia sólida que deve ressoar bem com seu público. O tema é relevante e tem potencial para gerar engajamento.",
          suggestion: "Para maximizar o impacto, considere adicionar um elemento de surpresa ou uma pergunta para aumentar a interação.",
          motivation: "Esta ideia tem muito potencial! Com a execução certa, pode gerar resultados excelentes para sua clínica!"
        },
        {
          evaluation: 'needs-work',
          reasoning: "Sua ideia tem um bom fundamento, mas pode precisar de mais elementos para se destacar na timeline lotada das redes sociais.",
          suggestion: "Considere adicionar um elemento emocional ou um benefício claro para o espectador para aumentar o engajamento.",
          motivation: "Com alguns ajustes, esta ideia pode se transformar em um conteúdo poderoso! Vamos trabalhar nisso juntos!"
        }
      ];
      
      // Randomly select a response, but weight toward good/excellent
      const random = Math.random();
      const responseIndex = random < 0.5 ? 0 : random < 0.8 ? 1 : 2;
      
      setAiResponse(responses[responseIndex]);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000); // 3 seconds of "thinking"
  };
  
  const handleReset = () => {
    setUserIdea("");
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAiResponse(null);
  };
  
  return (
    <section className="parallax-section w-full min-h-[80vh] relative flex items-center justify-center">
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
            {!isAnalyzing && !analysisComplete && (
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
            
            {analysisComplete && aiResponse && (
              <motion.div
                key="response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              >
                <AIResponseBlock 
                  evaluation={aiResponse.evaluation}
                  reasoning={aiResponse.reasoning}
                  suggestion={aiResponse.suggestion}
                  motivation={aiResponse.motivation}
                  ideaText={userIdea}
                />
                
                <motion.div 
                  className="text-center mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <button
                    onClick={handleReset}
                    className="text-white hover:text-fluida-pink transition-colors"
                  >
                    Avaliar outra ideia
                  </button>
                </motion.div>
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
