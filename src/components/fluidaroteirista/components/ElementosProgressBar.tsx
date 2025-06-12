
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { ELEMENTOS_CONFIG } from '../constants/elementosUniversaisTree';

interface ElementosProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentElemento: string;
  answers: Record<string, string | string[]>;
}

const ElementosProgressBar: React.FC<ElementosProgressBarProps> = ({
  currentStep,
  totalSteps,
  currentElemento,
  answers
}) => {
  const getElementoConfig = (elemento: string) => {
    return ELEMENTOS_CONFIG.find(config => config.key === elemento) || {
      key: elemento,
      label: elemento,
      icon: '📝',
      cor: 'gray'
    };
  };

  const getColorClass = (cor: string) => {
    const colors = {
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      cyan: 'bg-cyan-500',
      gray: 'bg-gray-500',
      orange: 'bg-orange-500'
    };
    return colors[cor] || 'bg-gray-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header com progresso geral */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🎯</span>
          <h2 className="text-xl font-bold text-white">
            Elementos Universais FLUIDA
          </h2>
        </motion.div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple">
            Passo {currentStep + 1} de {totalSteps}
          </Badge>
          <Badge variant="outline" className="text-slate-400">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}% completo
          </Badge>
        </div>
      </div>

      {/* Barra de progresso visual */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          {ELEMENTOS_CONFIG.map((elemento, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = elemento.key === currentElemento;
            const config = getElementoConfig(elemento.key);
            
            return (
              <motion.div
                key={elemento.key}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isCurrent ? 1.1 : (isCompleted ? 1 : 0.9),
                  opacity: isCurrent ? 1 : (isCompleted ? 0.8 : 0.5)
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col items-center space-y-1"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isCurrent ? `${getColorClass(config.cor)} text-white shadow-lg` : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}
                `}>
                  {isCompleted ? '✓' : config.icon}
                </div>
                <span className={`text-xs text-center max-w-16 leading-tight ${
                  isCurrent ? 'text-white font-semibold' : 'text-gray-400'
                }`}>
                  {config.label}
                </span>
              </motion.div>
            );
          })}
          
          {/* Tema (último passo) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: currentElemento === 'tema' ? 1.1 : (currentStep === 10 ? 1 : 0.9),
              opacity: currentElemento === 'tema' ? 1 : (currentStep === 10 ? 0.8 : 0.5)
            }}
            className="flex flex-col items-center space-y-1"
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
              ${currentElemento === 'tema' ? 'bg-aurora-electric-purple text-white shadow-lg' : 
                currentStep === 10 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}
            `}>
              {currentStep === 10 ? '✓' : '📝'}
            </div>
            <span className={`text-xs text-center max-w-16 leading-tight ${
              currentElemento === 'tema' ? 'text-white font-semibold' : 'text-gray-400'
            }`}>
              Tema
            </span>
          </motion.div>
        </div>

        {/* Linha de progresso */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700 -z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-aurora-electric-purple to-purple-400"
          />
        </div>
      </div>

      {/* Resumo dos elementos já escolhidos */}
      {Object.keys(answers).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 aurora-glass border-aurora-electric-purple/20 rounded-lg"
        >
          <h4 className="text-sm font-semibold text-white mb-2">
            ✨ Elementos já definidos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(answers).map(([key, value]) => {
              const config = getElementoConfig(key);
              if (key === 'tema') return null; // Não mostrar tema aqui
              
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="text-xs bg-gray-800/50 text-gray-300"
                >
                  {config.icon} {config.label}
                </Badge>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ElementosProgressBar;
