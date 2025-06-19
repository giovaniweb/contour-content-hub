
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Tag, X } from 'lucide-react';

interface Equipment {
  id: string;
  nome: string;
}

interface BulkActionBarProps {
  selectedCount: number;
  equipments: Equipment[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkUpdateEquipment: (equipmentId: string) => void;
  onBulkAddTags: (tags: string[]) => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  equipments,
  onClearSelection,
  onBulkDelete,
  onBulkUpdateEquipment,
  onBulkAddTags
}) => {
  if (selectedCount === 0) return null;

  // Additional validation to ensure we only render SelectItems with valid values
  const safeEquipments = equipments.filter(equipment => 
    equipment && 
    equipment.id && 
    equipment.id.trim() !== "" && 
    equipment.nome && 
    equipment.nome.trim() !== ""
  );

  console.log('[BulkActionBar] Valid equipments for Select:', safeEquipments);

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedCount} vídeo(s) selecionado(s)
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearSelection}
            className="h-7"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar seleção
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Atualizar equipamento */}
          <Select onValueChange={onBulkUpdateEquipment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Atualizar equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Remover equipamento</SelectItem>
              {safeEquipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Adicionar tags */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const tags = prompt('Digite as tags separadas por vírgula:');
              if (tags) {
                onBulkAddTags(tags.split(',').map(tag => tag.trim()).filter(Boolean));
              }
            }}
          >
            <Tag className="h-3 w-3 mr-1" />
            Adicionar Tags
          </Button>

          {/* Excluir */}
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onBulkDelete}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Excluir Selecionados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
