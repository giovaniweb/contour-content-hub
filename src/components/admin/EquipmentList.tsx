
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Equipment } from '@/types/equipment';

interface EquipmentListProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  equipments, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (equipments.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/30 rounded-md">
        <Search className="h-10 w-10 mx-auto text-muted-foreground" />
        <p className="mt-2 text-lg font-medium">Nenhum equipamento encontrado</p>
        <p className="text-sm text-muted-foreground">
          Tente ajustar os critérios de busca ou adicione um novo equipamento.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tecnologia</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipments.map((equipment) => (
          <TableRow key={equipment.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{equipment.nome}</TableCell>
            <TableCell>{equipment.tecnologia}</TableCell>
            <TableCell>
              {equipment.ativo ? (
                <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
              ) : (
                <Badge variant="outline" className="bg-rose-100 text-rose-800 hover:bg-rose-100">Inativo</Badge>
              )}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(equipment)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onDelete(equipment.id)}
                className="hover:bg-rose-100 hover:text-rose-700"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EquipmentList;
