
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface BatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onShowEditDialog: () => void;
  onDelete: () => void;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onShowEditDialog,
  onDelete
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-muted mb-4 p-3 rounded-md flex flex-wrap justify-between items-center">
      <div className="flex items-center">
        <Badge variant="outline" className="mr-2">{selectedCount} selecionados</Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
        >
          Limpar seleção
        </Button>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowEditDialog}
        >
          <Pencil className="h-3 w-3 mr-1" /> Editar equipamento
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Excluir
        </Button>
      </div>
    </div>
  );
};

export default BatchActionBar;
