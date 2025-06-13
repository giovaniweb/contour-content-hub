import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import { useEquipments } from '@/hooks/useEquipments';
import { useClinicSegmentation } from '@/hooks/useClinicSegmentation';
import { useFluidaRoteirista } from '@/hooks/useFluidaRoteirista';
import EquipmentValidationAlert from './EquipmentValidationAlert';
import AuroraLoadingScreen from './AuroraLoadingScreen';
import ScriptGeneratorForm from './ScriptGeneratorForm';
import EnhancedScriptResults from './EnhancedScriptResults';

interface FluidaScriptGeneratorProps {
  onScriptGenerated?: (script: any) => void;
}

const FluidaScriptGenerator: React.FC<FluidaScriptGeneratorProps> = ({ 
  onScriptGenerated 
}) => {
  const [tema, setTema] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [formato, setFormato] = useState<'carrossel' | 'imagem' | 'stories' | 'reels'>('carrossel');
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
    // Reset form but keep current inputs for variations
  };

  const handleGenerateImage = (script: any) => {
    console.log('🖼️ Gerar imagem para script:', script);
    // TODO: Implementar geração de imagem
  };

  // Mostrar loading durante geração
  if (isGenerating) {
    return <AuroraLoadingScreen isLoading={true} mentor={mentor.toLowerCase()} />;
  }

  // Mostrar resultados se houver
  if (results.length > 0) {
    return (
      <EnhancedScriptResults
        results={results}
        onScriptApproved={onScriptGenerated}
        onNewScript={handleNewScript}
        onGenerateImage={handleGenerateImage}
      />
    );
  }

  return (
    <div className="space-y-8">
      <EquipmentValidationAlert
        clinicType={clinicType}
        selectedEquipments={selectedEquipments}
        recommendation={recommendation}
        hasInvasiveEquipments={hasInvasiveEquipments}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
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
      </motion.div>
    </div>
  );
};

export default FluidaScriptGenerator;
