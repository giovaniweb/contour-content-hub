
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DocumentTypeEnum } from '@/types/document';
import { Equipment } from '@/types/equipment';

interface ScientificArticleFiltersProps {
  selectedType: DocumentTypeEnum | 'all';
  setSelectedType: (type: DocumentTypeEnum | 'all') => void;
  selectedEquipment: string;
  setSelectedEquipment: (equipment: string) => void;
  equipments?: Equipment[];
}

const ScientificArticleFilters: React.FC<ScientificArticleFiltersProps> = ({
  selectedType,
  setSelectedType,
  selectedEquipment,
  setSelectedEquipment,
  equipments = []
}) => {
  const documentTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'artigo_cientifico', label: 'Artigo Científico' },
    { value: 'ficha_tecnica', label: 'Ficha Técnica' },
    { value: 'protocolo', label: 'Protocolo' },
    { value: 'folder_publicitario', label: 'Folder Publicitário' },
    { value: 'outro', label: 'Outro' }
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-300 font-medium">Filtrar por:</span>
      </div>

      {/* Type Filter */}
      <div className="min-w-[200px]">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="aurora-glass border-slate-600 text-white">
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent className="aurora-glass border-slate-600">
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Filter */}
      <div className="min-w-[200px]">
        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger className="aurora-glass border-slate-600 text-white">
            <SelectValue placeholder="Equipamento" />
          </SelectTrigger>
          <SelectContent className="aurora-glass border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-700">
              Todos equipamentos
            </SelectItem>
            {equipments.map((equipment) => (
              <SelectItem key={equipment.id} value={equipment.id} className="text-white hover:bg-slate-700">
                {equipment.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      <div className="flex items-center gap-2">
        {selectedType !== 'all' && (
          <Badge variant="secondary" className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30">
            {documentTypes.find(t => t.value === selectedType)?.label}
          </Badge>
        )}
        {selectedEquipment !== 'all' && (
          <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            {equipments.find(e => e.id === selectedEquipment)?.nome}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ScientificArticleFilters;
