
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType } from '@/types/document';
import { Equipment } from '@/types/equipment';
import { filterValidEquipments } from '@/utils/equipmentValidation';

interface ScientificArticleFiltersProps {
  selectedType: DocumentType | 'all';
  setSelectedType: (value: DocumentType | 'all') => void;
  selectedEquipment: string;
  setSelectedEquipment: (value: string) => void;
  equipments: Equipment[];
}

const ScientificArticleFilters: React.FC<ScientificArticleFiltersProps> = ({
  selectedType,
  setSelectedType,
  selectedEquipment,
  setSelectedEquipment,
  equipments
}) => {
  // Filter equipments to ensure valid IDs and prevent Select.Item errors
  const validEquipments = filterValidEquipments(equipments);

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl">
      <Select value={selectedType} onValueChange={(value: DocumentType | 'all') => setSelectedType(value)}>
        <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-500/30 text-slate-100">
          <SelectValue placeholder="Tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
          <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
          <SelectItem value="protocolo">Protocolo</SelectItem>
          <SelectItem value="outro">Outro</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
        <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-500/30 text-slate-100">
          <SelectValue placeholder="Equipamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos equipamentos</SelectItem>
          {validEquipments.map(equipment => (
            <SelectItem key={equipment.id} value={equipment.id}>
              {equipment.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScientificArticleFilters;
