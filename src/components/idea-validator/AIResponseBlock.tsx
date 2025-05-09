
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ThumbsUp, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AIResponseProps {
  evaluation: 'excellent' | 'good' | 'needs-work';
  reasoning: string;
  suggestion?: string;
  motivation: string;
  ideaText: string;
}

const AIResponseBlock: React.FC<AIResponseProps> = ({
  evaluation,
  reasoning,
  suggestion,
  motivation,
  ideaText
}) => {
  const navigate = useNavigate();
  
  const evaluationConfig = {
    'excellent': {
      label: "Ideia Excelente!",
      icon: <Sparkles className="h-6 w-6 text-yellow-400" />,
      color: "from-yellow-400 to-yellow-500",
      textColor: "text-yellow-700"
    },
    'good': {
      label: "Boa Ideia",
      icon: <ThumbsUp className="h-6 w-6 text-green-500" />,
      color: "from-green-400 to-green-500",
      textColor: "text-green-700"
    },
    'needs-work': {
      label: "Ideia Precisa de Ajustes",
      icon: <AlertCircle className="h-6 w-6 text-amber-500" />,
      color: "from-amber-400 to-amber-500",
      textColor: "text-amber-700"
    }
  };
  
  const config = evaluationConfig[evaluation];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleGenerateScript = () => {
    navigate('/script-generator', { 
      state: { 
        validatedIdea: {
          topic: ideaText,
          validationScore: evaluation === 'excellent' ? 90 : evaluation === 'good' ? 75 : 60
        } 
      }
    });
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Evaluation Section */}
      <motion.div 
        variants={item} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${config.color} p-4 flex items-center`}>
          <div className="bg-white dark:bg-gray-700 rounded-full p-2 mr-3">
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-white">{config.label}</h3>
        </div>
        
        <div className="p-6">
          <motion.p 
            className="text-lg mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {reasoning}
          </motion.p>
        </div>
      </motion.div>
      
      {/* Suggestion Section (if provided) */}
      {suggestion && (
        <motion.div 
          variants={item}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-fluida-blue to-fluida-blue/80 p-4 flex items-center">
            <div className="bg-white dark:bg-gray-700 rounded-full p-2 mr-3">
              <CheckCircle className="h-6 w-6 text-fluida-blue" />
            </div>
            <h3 className="text-xl font-bold text-white">Sugestão de Melhoria</h3>
          </div>
          
          <div className="p-6">
            <motion.p 
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {suggestion}
            </motion.p>
          </div>
        </motion.div>
      )}
      
      {/* Motivation Section */}
      <motion.div
        variants={item}
        className="bg-gradient-to-r from-fluida-blue to-fluida-pink p-1 rounded-lg shadow-lg mb-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <motion.p 
            className="text-xl font-medium text-center bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {motivation}
          </motion.p>
        </div>
      </motion.div>
      
      {/* Call to Action Button - Always show for any evaluation */}
      <motion.div 
        variants={item}
        className="text-center"
      >
        <Button 
          onClick={handleGenerateScript}
          className="px-8 py-6 text-lg font-medium rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink hover:from-fluida-blue/90 hover:to-fluida-pink/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Gerar Roteiro com essa Ideia
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AIResponseBlock;
