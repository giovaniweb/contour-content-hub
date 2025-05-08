
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Equipment {
  id: string;
  nome: string;
}

interface BatchEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentOptions: Equipment[];
  batchEquipmentId: string;
  setBatchEquipmentId: (value: string) => void;
  selectedCount: number;
  onApply: () => Promise<void>;
}

const BatchEditDialog: React.FC<BatchEditDialogProps> = ({
  isOpen,
  onOpenChange,
  equipmentOptions,
  batchEquipmentId,
  setBatchEquipmentId,
  selectedCount,
  onApply
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar equipamento</DialogTitle>
          <DialogDescription>
            Selecione um equipamento para associar aos {selectedCount} vídeos selecionados.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select 
            value={batchEquipmentId || "none"} 
            onValueChange={setBatchEquipmentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum equipamento</SelectItem>
              {equipmentOptions
                .filter(eq => eq && eq.id && eq.id !== "")
                .map(eq => (
                  <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onApply} 
            disabled={!batchEquipmentId}
          >
            Aplicar para {selectedCount} vídeos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchEditDialog;
