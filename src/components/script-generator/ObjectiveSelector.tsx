
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OBJETIVOS = [
  'Vender',
  'Atrair', 
  'Brand'
];

interface ObjectiveSelectorProps {
  selectedObjective: string;
  onObjectiveChange: (objective: string) => void;
}

const ObjectiveSelector: React.FC<ObjectiveSelectorProps> = ({
  selectedObjective,
  onObjectiveChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="aurora-accent font-medium">Objetivo do Roteiro</Label>
      <Select value={selectedObjective} onValueChange={onObjectiveChange}>
        <SelectTrigger className="aurora-glass border-purple-300/30 focus:border-purple-500/50 text-white">
          <SelectValue placeholder="Selecione o objetivo" />
        </SelectTrigger>
        <SelectContent className="aurora-glass border-purple-300/30 bg-gray-900/95 backdrop-blur-lg">
          {OBJETIVOS.map((obj) => (
            <SelectItem key={obj} value={obj} className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
              {obj}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ObjectiveSelector;
