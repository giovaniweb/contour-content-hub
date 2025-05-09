
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmotionalSalesChoiceProps {
  onObjectiveSelect: (objective: 'emotion' | 'sales') => void;
}

const EmotionalSalesChoice: React.FC<EmotionalSalesChoiceProps> = ({ onObjectiveSelect }) => {
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <motion.h3 
          className="text-xl md:text-2xl font-medium mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Adorei sua ideia! Ela tem muito potencial.
        </motion.h3>
        
        <motion.p 
          className="text-lg font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Agora me conta: <br className="md:hidden" />
          você quer que esse conteúdo emocione o público ou leve à ação (como gerar vendas ou agendamentos)?
        </motion.p>
      </div>
      
      <motion.div 
        className="flex flex-col md:flex-row gap-4 justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          variant="glass"
          size="lg"
          className="flex items-center justify-center gap-2 px-8 py-6 text-lg hover:bg-white/30 hover:scale-105 transition-all"
          onClick={() => onObjectiveSelect('emotion')}
        >
          <Heart className="h-5 w-5" />
          Quero emocionar
        </Button>
        
        <Button
          variant="glass"
          size="lg"
          className="flex items-center justify-center gap-2 px-8 py-6 text-lg hover:bg-white/30 hover:scale-105 transition-all"
          onClick={() => onObjectiveSelect('sales')}
        >
          <DollarSign className="h-5 w-5" />
          Quero vender
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmotionalSalesChoice;
