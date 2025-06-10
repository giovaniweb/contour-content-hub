import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useEquipments } from '@/hooks/useEquipments';
import { useClinicSegmentation } from '@/hooks/useClinicSegmentation';
import { useFluidaRoteirista } from '@/hooks/useFluidaRoteirista';
import EquipmentValidationAlert from './EquipmentValidationAlert';
import FluidaLoadingMessages from './FluidaLoadingMessages';
import ScriptGeneratorForm from './ScriptGeneratorForm';
import ScriptResults from './ScriptResults';

interface FluidaScriptGeneratorProps {
  onScriptGenerated?: (script: any) => void;
}

const FluidaScriptGenerator: React.FC<FluidaScriptGeneratorProps> = ({ 
  onScriptGenerated 
}) => {
  const [tema, setTema] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [formato, setFormato] = useState<'carrossel' | 'stories' | 'imagem'>('carrossel');
  const [objetivo, setObjetivo] = useState('🟡 Atrair Atenção');
  const [mentor, setMentor] = useState('Criativo');

  const { equipments, loading: equipmentsLoading } = useEquipments();
  const { clinicType, allowedEquipments, recommendation, hasInvasiveEquipments } = 
    useClinicSegmentation(selectedEquipments);
  const { generateFluidaScript, isGenerating, results } = useFluidaRoteirista();

  const handleEquipmentChange = (equipmentId: string) => {
    setSelectedEquipments(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleGenerate = async () => {
    if (!tema.trim()) return;

    const equipmentNames = selectedEquipments.map(id => 
      equipments.find(eq => eq.id === id)?.nome || id
    );

    await generateFluidaScript({
      tema,
      equipamentos: equipmentNames,
      objetivo,
      mentor,
      formato
    });
  };

  const handleNewScript = () => {
    // Reset form but keep current inputs
    // This allows users to generate variations
  };

  // Mostrar loading durante geração
  if (isGenerating) {
    return <FluidaLoadingMessages isLoading={true} mentor={mentor.toLowerCase()} />;
  }

  // Mostrar resultados se houver
  if (results.length > 0) {
    return (
      <ScriptResults
        results={results}
        onScriptApproved={onScriptGenerated}
        onNewScript={handleNewScript}
      />
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Wand2 className="h-8 w-8 text-purple-600" />
          FLUIDAROTEIRISTA
        </h1>
        <p className="text-gray-600">
          Roteiros criativos e impactantes para clínicas estéticas e médicas
        </p>
      </motion.div>

      <EquipmentValidationAlert
        clinicType={clinicType}
        selectedEquipments={selectedEquipments}
        recommendation={recommendation}
        hasInvasiveEquipments={hasInvasiveEquipments}
      />

      <ScriptGeneratorForm
        tema={tema}
        onTemaChange={setTema}
        formato={formato}
        onFormatoChange={setFormato}
        objetivo={objetivo}
        onObjetivoChange={setObjetivo}
        selectedEquipments={selectedEquipments}
        onEquipmentChange={handleEquipmentChange}
        allowedEquipments={allowedEquipments}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default FluidaScriptGenerator;
