
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { IntentProcessorResult } from '@/hooks/useIntentProcessor';

interface IntentResponseConversationProps {
  result: IntentProcessorResult;
  onAction?: () => void;
}

const IntentResponseConversation: React.FC<IntentResponseConversationProps> = ({
  result,
  onAction,
}) => {
  // Define animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Define animation variants for elements inside the card
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4 },
    }),
  };

  // Helper function to determine the icon based on category
  const getCategoryIcon = () => {
    switch (result.categoria) {
      case 'marketing':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case 'planejamento':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ciencia':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <motion.div
      className="rounded-lg border bg-card p-6"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-4">
        {/* Intent and category */}
        <motion.div
          variants={childVariants}
          custom={0}
          className="flex items-start justify-between"
        >
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <h3 className="font-medium text-lg">{result.intencao}</h3>
          </div>
          <span
            className={`
              px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${
                result.categoria === 'marketing'
                  ? 'bg-blue-100 text-blue-800'
                  : result.categoria === 'planejamento'
                  ? 'bg-green-100 text-green-800'
                  : result.categoria === 'ciencia'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-purple-100 text-purple-800'
              }
            `}
          >
            {result.categoria}
          </span>
        </motion.div>

        {/* Explanation */}
        <motion.p
          variants={childVariants}
          custom={1}
          className="text-muted-foreground"
        >
          {result.explicacao}
        </motion.p>

        {/* Strategic direction */}
        <motion.div
          variants={childVariants}
          custom={2}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
        >
          <span className="text-sm font-medium">Foco estratégico:</span>
          <span
            className={`
              px-2.5 py-0.5 rounded-full text-xs font-medium inline-block 
              ${
                result.direcionamento_estrategico === 'venda'
                  ? 'bg-green-100 text-green-800'
                  : result.direcionamento_estrategico === 'branding'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }
            `}
          >
            {result.direcionamento_estrategico === 'venda'
              ? 'Venda Direta'
              : result.direcionamento_estrategico === 'branding'
              ? 'Fortalecimento de Marca'
              : 'Educação e Conexão'}
          </span>
        </motion.div>

        {/* Next step */}
        <motion.div
          variants={childVariants}
          custom={3}
          className="mt-4 pt-4 border-t flex justify-between items-center"
        >
          <p className="text-sm text-muted-foreground">
            {result.proximo_passo}
          </p>
          <Button
            onClick={onAction}
            size="sm"
            className="gap-1"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntentResponseConversation;
