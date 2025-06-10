
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import FormatsSelector from './FormatsSelector';
import ScriptObjectiveSelector from './ScriptObjectiveSelector';
import EquipmentsList from './EquipmentsList';
import MentorSelector from './MentorSelector';

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
  selectedMentor: string | null;
  onMentorChange: (mentorId: string | null) => void;
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
  selectedMentor,
  onMentorChange,
  onGenerate,
  isGenerating
}) => {
  return (
    <Card className="aurora-card border-2 relative overflow-hidden">
      {/* Efeito Aurora de fundo */}
      <div className="absolute inset-0 aurora-gradient-bg opacity-5 pointer-events-none" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="aurora-text-gradient text-2xl text-center">
          Configuração do Roteiro
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        {/* Tema Principal */}
        <div className="space-y-3">
          <Label htmlFor="tema" className="aurora-accent font-semibold text-base">
            Tema/Assunto Principal*
          </Label>
          <Input
            id="tema"
            value={tema}
            onChange={(e) => onTemaChange(e.target.value)}
            placeholder="Ex: Tratamento para manchas faciais com laser"
            className="aurora-glass border-purple-300/30 focus:border-purple-500/50 backdrop-blur-sm text-white placeholder:text-white/50 bg-black/20"
          />
        </div>

        {/* Formato */}
        <FormatsSelector
          selectedFormat={formato}
          onFormatChange={onFormatoChange}
        />

        {/* Objetivo do Roteiro */}
        <ScriptObjectiveSelector
          selectedObjective={objetivo}
          onObjectiveChange={onObjetivoChange}
        />

        {/* Seletor de Mentores */}
        <MentorSelector
          selectedMentor={selectedMentor}
          onMentorChange={onMentorChange}
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
          className="w-full aurora-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 text-lg font-semibold aurora-glow"
          size="lg"
        >
          <Wand2 className="h-5 w-5 mr-3 aurora-pulse" />
          {isGenerating ? 'Gerando Roteiro...' : 'Gerar Roteiro FLUIDA'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScriptGeneratorForm;
