import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, X, Zap, Heart, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EquipmentStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

interface Equipment {
  id: string;
  nome: string;
  categoria: string;
}

const interestAreas = [
  {
    id: 'conteudo_social',
    label: 'Criação de Conteúdo para Redes Sociais',
    icon: TrendingUp,
    description: 'Posts, stories, reels para Instagram e outras redes'
  },
  {
    id: 'material_educativo',
    label: 'Material Educativo',
    icon: Users,
    description: 'Conteúdo para educar pacientes e clientes'
  },
  {
    id: 'marketing_digital',
    label: 'Marketing Digital',
    icon: Zap,
    description: 'Campanhas, anúncios e estratégias de marketing'
  },
  {
    id: 'relacionamento_cliente',
    label: 'Relacionamento com Cliente',
    icon: Heart,
    description: 'Comunicação pré e pós-procedimento'
  }
];

export const EquipmentStep: React.FC<EquipmentStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isLoading
}) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(formData.equipamentos || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loadingEquipments, setLoadingEquipments] = useState(false);

  useEffect(() => {
    loadEquipments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = equipments.filter(eq => 
        eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (eq.categoria && eq.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEquipments(filtered);
    } else {
      // Mostrar apenas alguns equipamentos populares quando não há busca
      const popular = equipments.slice(0, 12);
      setFilteredEquipments(popular);
    }
  }, [searchTerm, equipments]);

  const loadEquipments = async () => {
    setLoadingEquipments(true);
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome, categoria')
        .order('nome');
      
      if (error) {
        console.warn('Não foi possível carregar equipamentos:', error);
        // Define uma lista básica de equipamentos se não conseguir carregar
        setEquipments([
          { id: '1', nome: 'Laser CO2', categoria: 'laser' },
          { id: '2', nome: 'Ultraformer', categoria: 'ultrassom' },
          { id: '3', nome: 'Sculptra', categoria: 'preenchimento' },
          { id: '4', nome: 'Botox', categoria: 'toxina' },
          { id: '5', nome: 'Peeling Químico', categoria: 'peeling' },
          { id: '6', nome: 'Radiofrequência', categoria: 'radiofrequencia' },
          { id: '7', nome: 'Fios de PDO', categoria: 'fios' },
          { id: '8', nome: 'Microagulhamento', categoria: 'microagulhamento' }
        ]);
      } else {
        setEquipments(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      // Fallback para lista básica em caso de erro
      setEquipments([
        { id: '1', nome: 'Laser CO2', categoria: 'laser' },
        { id: '2', nome: 'Ultraformer', categoria: 'ultrassom' },
        { id: '3', nome: 'Sculptra', categoria: 'preenchimento' },
        { id: '4', nome: 'Botox', categoria: 'toxina' },
        { id: '5', nome: 'Peeling Químico', categoria: 'peeling' },
        { id: '6', nome: 'Radiofrequência', categoria: 'radiofrequencia' },
        { id: '7', nome: 'Fios de PDO', categoria: 'fios' },
        { id: '8', nome: 'Microagulhamento', categoria: 'microagulhamento' }
      ]);
    } finally {
      setLoadingEquipments(false);
    }
  };

  const toggleEquipment = (equipmentName: string) => {
    const newSelection = selectedEquipments.includes(equipmentName)
      ? selectedEquipments.filter(id => id !== equipmentName)
      : [...selectedEquipments, equipmentName];
    
    setSelectedEquipments(newSelection);
    updateFormData('equipamentos', newSelection);
  };

  const toggleInterest = (interestId: string) => {
    const newSelection = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    setSelectedInterests(newSelection);
  };

  const removeEquipment = (equipmentName: string) => {
    toggleEquipment(equipmentName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Salvar interesses como string no campo observacoes_conteudo
    const interestLabels = selectedInterests.map(id => 
      interestAreas.find(area => area.id === id)?.label
    ).filter(Boolean).join(', ');
    
    if (interestLabels) {
      const currentObservacoes = formData.observacoes_conteudo || '';
      const newObservacoes = currentObservacoes 
        ? `${currentObservacoes}\n\nÁreas de interesse: ${interestLabels}`
        : `Áreas de interesse: ${interestLabels}`;
      updateFormData('observacoes_conteudo', newObservacoes);
    }
    
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-white mb-2">
          Equipamentos e Interesses
        </h3>
        <p className="text-slate-400 text-sm">
          Nos ajude a personalizar o conteúdo mostrando seus equipamentos e áreas de interesse.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Áreas de Interesse */}
        <div className="space-y-4">
          <Label className="text-white text-base">
            Áreas de Interesse
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interestAreas.map((area) => {
              const Icon = area.icon;
              const isSelected = selectedInterests.includes(area.id);
              
              return (
                <div key={area.id}>
                  <Checkbox
                    id={area.id}
                    checked={isSelected}
                    onCheckedChange={() => toggleInterest(area.id)}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={area.id}
                    className={`
                      flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                      hover:border-aurora-electric-purple/50 hover:bg-aurora-space-black/30
                      ${isSelected 
                        ? 'border-aurora-bright-cyan bg-aurora-bright-cyan/10' 
                        : 'border-aurora-electric-purple/30 bg-aurora-space-black/20'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mt-0.5 flex-shrink-0
                      ${isSelected ? 'text-aurora-bright-cyan' : 'text-slate-400'}
                    `} />
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${
                        isSelected ? 'text-aurora-bright-cyan' : 'text-white'
                      }`}>
                        {area.label}
                      </div>
                      <div className="text-xs text-slate-400">
                        {area.description}
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipamentos */}
        <div className="space-y-4">
          <Label className="text-white text-base">
            Equipamentos que Possui ou Tem Interesse
          </Label>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar equipamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-aurora-space-black/50"
            />
          </div>

          {/* Equipamentos Selecionados */}
          {selectedEquipments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Selecionados:</p>
              <div className="flex flex-wrap gap-2">
                {selectedEquipments.map((equipmentName) => (
                  <Badge
                    key={equipmentName}
                    variant="secondary"
                    className="bg-aurora-bright-cyan/20 text-aurora-bright-cyan border-aurora-bright-cyan/30 pr-1"
                  >
                    {equipmentName}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEquipment(equipmentName)}
                      className="ml-2 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Equipamentos */}
          {loadingEquipments ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-aurora-bright-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {filteredEquipments.map((equipment) => (
                <div key={equipment.id}>
                  <Checkbox
                    id={equipment.id}
                    checked={selectedEquipments.includes(equipment.nome)}
                    onCheckedChange={() => toggleEquipment(equipment.nome)}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={equipment.id}
                    className={`
                      block p-2 text-sm rounded border cursor-pointer transition-all
                      hover:border-aurora-electric-purple/50
                      ${selectedEquipments.includes(equipment.nome)
                        ? 'border-aurora-bright-cyan bg-aurora-bright-cyan/10 text-aurora-bright-cyan' 
                        : 'border-aurora-electric-purple/30 bg-aurora-space-black/20 text-slate-300'
                      }
                    `}
                  >
                    {equipment.nome}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {filteredEquipments.length === 0 && !loadingEquipments && searchTerm && (
            <div className="text-center py-4 text-slate-400">
              Nenhum equipamento encontrado para "{searchTerm}"
            </div>
          )}
        </div>

        {/* Informação sobre pular */}
        <div className="bg-aurora-space-black/30 border border-aurora-electric-purple/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-aurora-neon-purple rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Essas informações são opcionais
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Você pode pular esta etapa e adicionar equipamentos depois. 
                Essas informações nos ajudam a mostrar conteúdo mais relevante para você.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button - Hidden, controlled by parent */}
        <Button type="submit" className="hidden">
          Continue
        </Button>
      </form>
    </div>
  );
};