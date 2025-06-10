
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OBJETIVOS = [
  '🟡 Atrair Atenção',
  '🟢 Criar Conexão', 
  '🔴 Fazer Comprar',
  '🔁 Reativar Interesse',
  '✅ Fechar Agora'
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
      <Label>Objetivo de Marketing</Label>
      <Select value={selectedObjective} onValueChange={onObjectiveChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OBJETIVOS.map((obj) => (
            <SelectItem key={obj} value={obj}>
              {obj}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ObjectiveSelector;
