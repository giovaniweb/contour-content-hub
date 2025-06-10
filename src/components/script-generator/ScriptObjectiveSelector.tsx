
import React from 'react';
import { Label } from '@/components/ui/label';
import { Target, DollarSign, Eye, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const OBJETIVOS_ROTEIRO = [
  { 
    id: 'vender', 
    label: 'Vender', 
    icon: DollarSign, 
    description: 'Converter em vendas diretas',
    mentor: 'Leandro Ladeira',
    color: 'text-green-400'
  },
  { 
    id: 'atrair', 
    label: 'Atrair', 
    icon: Eye, 
    description: 'Gerar interesse e leads',
    mentor: 'Ícaro de Carvalho',
    color: 'text-blue-400'
  },
  { 
    id: 'brand', 
    label: 'Brand', 
    icon: Award, 
    description: 'Fortalecer marca e autoridade',
    mentor: 'Washington Olivetto',
    color: 'text-purple-400'
  }
];

interface ScriptObjectiveSelectorProps {
  selectedObjective: string;
  onObjectiveChange: (objective: string) => void;
}

const ScriptObjectiveSelector: React.FC<ScriptObjectiveSelectorProps> = ({
  selectedObjective,
  onObjectiveChange
}) => {
  return (
    <div className="space-y-3">
      <Label className="aurora-accent font-semibold text-base">
        Objetivo do Roteiro
      </Label>
      <div className="grid grid-cols-3 gap-4">
        {OBJETIVOS_ROTEIRO.map((obj) => (
          <motion.button
            key={obj.id}
            onClick={() => onObjectiveChange(obj.id)}
            className={`p-4 rounded-xl border-2 transition-all aurora-glass backdrop-blur-sm ${
              selectedObjective === obj.id
                ? 'border-purple-500/70 aurora-glow bg-purple-500/10'
                : 'border-purple-300/20 hover:border-purple-400/40'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <obj.icon className={`h-8 w-8 mx-auto mb-3 ${
              selectedObjective === obj.id ? obj.color : 'aurora-body'
            }`} />
            <div className={`text-sm font-semibold mb-1 ${
              selectedObjective === obj.id ? obj.color : 'aurora-body'
            }`}>
              {obj.label}
            </div>
            <div className="text-xs aurora-body opacity-70 mb-2">
              {obj.description}
            </div>
            <div className="text-xs aurora-accent opacity-60">
              {obj.mentor}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ScriptObjectiveSelector;
