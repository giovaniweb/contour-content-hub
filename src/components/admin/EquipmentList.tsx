
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Equipment } from '@/types/equipment';
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Eye } from 'lucide-react';

interface EquipmentListProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipments, onEdit, onDelete }) => {
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);

  const handleDelete = () => {
    if (equipmentToDelete) {
      onDelete(equipmentToDelete.id);
      setEquipmentToDelete(null);
    }
  };

  if (equipments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No equipment found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add new equipment by clicking the "New Equipment" button above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipments.map((equipment) => (
          <Card key={equipment.id} className={`border-l-4 ${equipment.ativo ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{equipment.nome}</h3>
                <Badge variant={equipment.ativo ? "success" : "secondary"}>
                  {equipment.ativo ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {equipment.tecnologia}
              </p>
              
              <div className="flex justify-between items-center mt-4">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(equipment)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setEquipmentToDelete(equipment)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                >
                  <Link to={`/admin/equipment/${equipment.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <AlertDialog open={!!equipmentToDelete} onOpenChange={() => setEquipmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment
              <strong> {equipmentToDelete?.nome}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EquipmentList;
