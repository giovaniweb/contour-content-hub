
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Equipment } from '@/types/equipment';
import { Skeleton } from '@/components/ui/skeleton';

interface EquipmentListProps {
  equipments: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={`skeleton-${i}`} 
            className="flex items-center justify-between p-4 bg-card rounded-md border shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-md" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {equipments.map((equipment) => (
        <div 
          key={equipment.id}
          className="flex items-center justify-between p-4 bg-card rounded-md border shadow-sm"
        >
          <div className="flex items-center gap-3">
            {equipment.image_url ? (
              <img 
                src={equipment.image_url} 
                alt={equipment.nome} 
                className="w-12 h-12 object-cover rounded-md"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}
            
            <div>
              <h3 className="font-medium">{equipment.nome}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {equipment.tecnologia && equipment.tecnologia.substring(0, 100)}
                {equipment.tecnologia && equipment.tecnologia.length > 100 ? '...' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {equipment.ativo ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inativo</span>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to={`/equipments/${equipment.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(equipment)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(equipment.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
      
      {equipments.length === 0 && !loading && (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">Nenhum equipamento encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
