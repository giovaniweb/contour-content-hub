
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
  formato: 'carrossel' | 'imagem' | 'stories' | 'reels';
  onFormatoChange: (formato: 'carrossel' | 'imagem' | 'stories' | 'reels') => void;
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
    <Card className="border-gray-700 hover:border-purple-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 bg-fluida-lightGray">
      <CardHeader>
        <CardTitle className="aurora-text-gradient text-2xl">
          Configuração do Roteiro
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tema Principal */}
        <div className="space-y-3">
          <Label htmlFor="tema" className="aurora-accent font-semibold text-base">
            Tema/Assunto Principal*
          </Label>
          <Input 
            id="tema" 
            value={tema} 
            onChange={e => onTemaChange(e.target.value)} 
            placeholder="Ex: Tratamento para manchas faciais com laser" 
            className="bg-gray-800/80 border-purple-300/30 focus:border-purple-500/50 text-gray-200" 
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
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200" 
          size="lg"
        >
          <Wand2 className="h-5 w-5 mr-3" />
          Gerar Roteiro FLUIDA
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScriptGeneratorForm;
