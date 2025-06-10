
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Sparkles, Image, Video, FileText } from 'lucide-react';
import { useEquipments } from '@/hooks/useEquipments';
import { useClinicSegmentation } from '@/hooks/useClinicSegmentation';
import { useFluidaRoteirista } from '@/hooks/useFluidaRoteirista';
import EquipmentValidationAlert from './EquipmentValidationAlert';
import FluidaLoadingMessages from './FluidaLoadingMessages';

interface FluidaScriptGeneratorProps {
  onScriptGenerated?: (script: any) => void;
}

const FORMATOS = [
  { id: 'carrossel', label: 'Carrossel', icon: FileText, description: 'Múltiplos slides' },
  { id: 'stories', label: 'Stories', icon: Video, description: 'Formato vertical' },
  { id: 'imagem', label: 'Post Único', icon: Image, description: 'Uma imagem' }
];

const OBJETIVOS = [
  '🟡 Atrair Atenção',
  '🟢 Criar Conexão', 
  '🔴 Fazer Comprar',
  '🔁 Reativar Interesse',
  '✅ Fechar Agora'
];

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

  // Mostrar loading durante geração
  if (isGenerating) {
    return <FluidaLoadingMessages isLoading={true} mentor={mentor.toLowerCase()} />;
  }

  // Mostrar resultados se houver
  if (results.length > 0) {
    return (
      <div className="space-y-6">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Roteiro FLUIDA - {result.formato}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Emoção: {result.emocao_central}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Intenção: {result.intencao}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    Mentor: {result.mentor}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Objetivo:</Label>
                    <p className="text-gray-700">{result.objetivo}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Roteiro:</Label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-2">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.roteiro}
                      </pre>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onScriptGenerated?.(result)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Aprovar Roteiro
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Novo Roteiro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
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
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Tratamento para manchas faciais com laser"
              className="w-full"
            />
          </div>

          {/* Formato */}
          <div className="space-y-2">
            <Label>Formato do Conteúdo</Label>
            <div className="grid grid-cols-3 gap-3">
              {FORMATOS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormato(fmt.id as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formato === fmt.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <fmt.icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{fmt.label}</div>
                  <div className="text-xs text-gray-500">{fmt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label>Objetivo de Marketing</Label>
            <Select value={objetivo} onValueChange={setObjetivo}>
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

          {/* Equipamentos */}
          <div className="space-y-2">
            <Label>Equipamentos (Selecione os principais)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {allowedEquipments.map((equipment) => (
                <label
                  key={equipment.id}
                  className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedEquipments.includes(equipment.id)}
                    onChange={() => handleEquipmentChange(equipment.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{equipment.nome}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Botão de Geração */}
          <Button
            onClick={handleGenerate}
            disabled={!tema.trim() || selectedEquipments.length === 0 || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Gerar Roteiro FLUIDA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FluidaScriptGenerator;
