
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash, Eye, ExternalLink } from "lucide-react";
import { Equipment } from '@/types/equipment';
import EquipmentForm from './EquipmentForm';

interface EquipmentListProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipments, onEdit, onDelete }) => {
  const [viewEquipment, setViewEquipment] = useState<Equipment | null>(null);
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleView = (equipment: Equipment) => {
    setViewEquipment(equipment);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setEditEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveEdit = async (updatedEquipment: Equipment) => {
    await onEdit(updatedEquipment);
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tecnologia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum equipamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            equipments.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell className="font-medium">{equipment.nome}</TableCell>
                <TableCell>
                  {equipment.tecnologia.length > 50 
                    ? `${equipment.tecnologia.slice(0, 50)}...` 
                    : equipment.tecnologia}
                </TableCell>
                <TableCell>
                  {equipment.ativo ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      Inativo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(equipment)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/equipment/${equipment.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(equipment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(equipment.id!)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewEquipment?.nome}</DialogTitle>
            <DialogDescription>
              Detalhes completos do equipamento
            </DialogDescription>
          </DialogHeader>

          {viewEquipment && (
            <div className="space-y-4 mt-4">
              {viewEquipment.image_url && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={viewEquipment.image_url} 
                    alt={viewEquipment.nome}
                    className="max-h-64 object-contain rounded-md" 
                  />
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm">Tecnologia</h4>
                <p className="mt-1 text-sm">{viewEquipment.tecnologia}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Indicações</h4>
                <p className="mt-1 text-sm">{viewEquipment.indicacoes}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Benefícios</h4>
                <p className="mt-1 text-sm">{viewEquipment.beneficios}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Diferenciais</h4>
                <p className="mt-1 text-sm">{viewEquipment.diferenciais}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Linguagem Recomendada</h4>
                <p className="mt-1 text-sm">{viewEquipment.linguagem}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Status</h4>
                {viewEquipment.ativo ? (
                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-1 bg-gray-50 text-gray-700 border-gray-200">
                    Inativo
                  </Badge>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button asChild>
                  <Link to={`/admin/equipment/${viewEquipment.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir página completa
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Equipamento</DialogTitle>
            <DialogDescription>
              Atualize as informações do equipamento
            </DialogDescription>
          </DialogHeader>

          {editEquipment && (
            <EquipmentForm
              equipment={editEquipment}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EquipmentList;
