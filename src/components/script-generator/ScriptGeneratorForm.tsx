
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import FormatsSelector from './FormatsSelector';
import ObjectiveSelector from './ObjectiveSelector';
import EquipmentsList from './EquipmentsList';

interface Equipment {
  id: string;
  nome: string;
}

interface ScriptGeneratorFormProps {
  tema: string;
  onTemaChange: (tema: string) => void;
  formato: 'carrossel' | 'stories' | 'imagem';
  onFormatoChange: (formato: 'carrossel' | 'stories' | 'imagem') => void;
  objetivo: string;
  onObjetivoChange: (objetivo: string) => void;
  selectedEquipments: string[];
  onEquipmentChange: (equipmentId: string) => void;
  allowedEquipments: Equipment[];
  onGenerate: () => void;
  isGenerating: boolean;
}

const ScriptGeneratorForm: React.FC<ScriptGeneratorFormProps> = ({
  tema,
  onTemaChange,
  formato,
  onFormatoChange,
  objetivo,
  onObjetivoChange,
  selectedEquipments,
  onEquipmentChange,
  allowedEquipments,
  onGenerate,
  isGenerating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Roteiro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tema Principal */}
        <div className="space-y-2">
          <Label htmlFor="tema">Tema/Assunto Principal*</Label>
          <Input
            id="tema"
            value={tema}
            onChange={(e) => onTemaChange(e.target.value)}
            placeholder="Ex: Tratamento para manchas faciais com laser"
            className="w-full"
          />
        </div>

        {/* Formato */}
        <FormatsSelector
          selectedFormat={formato}
          onFormatChange={onFormatoChange}
        />

        {/* Objetivo */}
        <ObjectiveSelector
          selectedObjective={objetivo}
          onObjectiveChange={onObjetivoChange}
        />

        {/* Equipamentos */}
        <EquipmentsList
          equipments={allowedEquipments}
          selectedEquipments={selectedEquipments}
          onEquipmentChange={onEquipmentChange}
        />

        {/* Botão de Geração */}
        <Button
          onClick={onGenerate}
          disabled={!tema.trim() || selectedEquipments.length === 0 || isGenerating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Gerar Roteiro FLUIDA
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScriptGeneratorForm;
