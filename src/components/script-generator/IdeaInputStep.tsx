
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormData } from '@/types/script';

interface IdeaInputStepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onObjectiveChange: (value: 'emotion' | 'sales') => void;
  onGoBack: () => void;
  onSubmit: () => void;
}

const IdeaInputStep: React.FC<IdeaInputStepProps> = ({
  formData,
  onInputChange,
  onObjectiveChange,
  onGoBack,
  onSubmit,
}) => {
  const [isThinking, setIsThinking] = useState(false);
  
  // Handle thinking animation when idea input changes
  useEffect(() => {
    if (formData.idea.length > 10) {
      setIsThinking(true);
      const timeout = setTimeout(() => setIsThinking(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [formData.idea]);
  
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Typing animation component
  const TypingText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 100);
        
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, text]);
  
    return (
      <div className="relative h-8">
        <span className="text-xl">{displayedText}</span>
        <span className="inline-block w-[2px] h-6 bg-fluida-pink ml-1 animate-pulse"></span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-8 md:p-12 shadow-xl border border-blue-100/40 dark:border-blue-700/40"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background gradient blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-r from-fluida-blue/20 to-fluida-pink/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-r from-fluida-pink/20 to-fluida-blue/20 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10 space-y-8">
          <motion.div variants={itemVariants} className="space-y-3 text-center max-w-3xl mx-auto">
            <motion.div
              className="inline-block text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Crie roteiros que emocionam ou vendem
            </motion.div>
            
            <motion.div 
              className="mt-4 text-center"
              variants={itemVariants}
            >
              <TypingText text="O que você quer criar hoje?" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 border border-white/20 shadow-lg"
            variants={itemVariants}
          >
            <div>
              <Label htmlFor="idea" className="text-lg font-medium bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">Sua ideia para conteúdo</Label>
              <div className="relative mt-2">
                <Textarea 
                  id="idea"
                  name="idea"
                  value={formData.idea}
                  onChange={onInputChange}
                  className="h-32 text-lg border-2 border-gray-200 hover:border-fluida-blue focus:border-fluida-pink transition-colors pr-12"
                  placeholder="Ex: Vídeo com massinha para o Dia das Mães, Tutorial de skincare, Antes e depois de procedimento..."
                />
                {isThinking && (
                  <motion.div 
                    className="absolute bottom-4 right-4 flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-gradient-to-r from-fluida-blue to-fluida-pink"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </div>
              {formData.idea.length > 5 && (
                <motion.div 
                  className="mt-2 px-3 py-2 bg-gradient-to-r from-fluida-blue/10 to-fluida-pink/10 rounded-lg text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-fluida-pink flex-shrink-0 mt-0.5" />
                    <span>
                      {formData.idea.toLowerCase().includes('massinha') 
                        ? "Dica: Roteiros sobre produtos para crianças costumam performar melhor quando focam na conexão emocional entre pais e filhos." 
                        : formData.idea.toLowerCase().includes('antes e depois')
                          ? "Dica: Em roteiros de 'antes e depois', use depoimentos reais e timeline clara para maior credibilidade."
                          : "Dica: Roteiros com histórias pessoais costumam ter maior engajamento e compartilhamento."}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <Label className="text-lg font-medium bg-gradient-to-r from-fluida-blue to-fluida-pink bg-clip-text text-transparent">
                Qual seu objetivo com esse conteúdo?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <motion.div
                  className={`${
                    formData.objective === 'emotion'
                      ? 'bg-gradient-to-r from-fluida-blue to-fluida-blue/60 text-white'
                      : 'bg-white dark:bg-gray-800'
                  } p-4 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer border border-gray-100 dark:border-gray-700`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onObjectiveChange('emotion')}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-200/20 flex items-center justify-center">
                      <span className="text-2xl">💙</span>
                    </div>
                    <h3 className="font-semibold text-lg">Emocionar</h3>
                    <p className="text-sm">
                      Criar conexão emocional com a audiência
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className={`${
                    formData.objective === 'sales'
                      ? 'bg-gradient-to-r from-fluida-pink to-fluida-pink/60 text-white'
                      : 'bg-white dark:bg-gray-800'
                  } p-4 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer border border-gray-100 dark:border-gray-700`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onObjectiveChange('sales')}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-200/20 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="font-semibold text-lg">Vender</h3>
                    <p className="text-sm">
                      Gerar conversão e resultados diretos
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-4 pt-2"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audience" className="text-base text-gray-600 dark:text-gray-300">Quem é o público-alvo? (opcional)</Label>
                  <Input 
                    id="audience"
                    name="audience"
                    value={formData.audience || ''}
                    onChange={onInputChange}
                    className="mt-2 border-gray-200"
                    placeholder="Ex: Mulheres 30-45 anos interessadas em estética"
                  />
                </div>
                
                <div>
                  <Label htmlFor="theme" className="text-base text-gray-600 dark:text-gray-300">Algum tema ou elemento específico? (opcional)</Label>
                  <Input 
                    id="theme"
                    name="theme"
                    value={formData.theme || ''}
                    onChange={onInputChange}
                    className="mt-2 border-gray-200"
                    placeholder="Ex: Dia das Mães, Black Friday, Verão..."
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={onGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button 
              className="gap-2 relative overflow-hidden group"
              onClick={onSubmit}
              style={{
                backgroundImage: "linear-gradient(90deg, #0094fb, #f300fc)",
              }}
            >
              <span className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
              <Sparkles className="h-4 w-4" />
              Gerar roteiro mágico
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IdeaInputStep;
