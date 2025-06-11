
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
            className="aurora-glass rounded-2xl p-6 border border-aurora-electric-purple/20"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-xl bg-aurora-electric-purple/20" />
              <div className="flex-1">
                <Skeleton className="h-6 w-48 mb-2 bg-aurora-electric-purple/20" />
                <Skeleton className="h-4 w-96 bg-aurora-electric-purple/10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 bg-aurora-electric-purple/20" />
                <Skeleton className="h-8 w-20 bg-aurora-electric-purple/20" />
                <Skeleton className="h-8 w-8 rounded-full bg-aurora-electric-purple/20" />
              </div>
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
          className="aurora-card p-6 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {equipment.thumbnail_url || equipment.image_url ? (
                <div className="relative">
                  <img 
                    src={equipment.thumbnail_url || equipment.image_url} 
                    alt={equipment.nome} 
                    className="w-16 h-16 object-cover rounded-xl border border-aurora-electric-purple/30"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-aurora-electric-purple/20 to-aurora-neon-blue/20"></div>
                </div>
              ) : (
                <div className="w-16 h-16 aurora-glass rounded-xl flex items-center justify-center text-aurora-electric-purple border border-aurora-electric-purple/30">
                  <Eye className="h-6 w-6" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="aurora-heading text-lg font-medium text-white mb-1">
                  {equipment.nome}
                </h3>
                <p className="aurora-body text-white/60 text-sm max-w-md line-clamp-2">
                  {equipment.tecnologia && equipment.tecnologia.substring(0, 120)}
                  {equipment.tecnologia && equipment.tecnologia.length > 120 ? '...' : ''}
                </p>
                {equipment.categoria && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full aurora-glass border border-aurora-electric-purple/30 text-aurora-electric-purple">
                    {equipment.categoria === 'estetico' ? '🌟 Estético' : '🏥 Médico'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {equipment.ativo ? (
                <span className="px-3 py-1 bg-gradient-to-r from-aurora-emerald to-aurora-lime text-white text-xs rounded-full font-medium">
                  Ativo
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-500/50 text-white/70 text-xs rounded-full font-medium">
                  Inativo
                </span>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 text-aurora-electric-purple hover:text-white"
              >
                <Link to={`/equipments/${equipment.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20 text-aurora-electric-purple hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="aurora-glass border-aurora-electric-purple/30 backdrop-blur-xl"
                >
                  <DropdownMenuItem 
                    onClick={() => onEdit(equipment)}
                    className="hover:bg-aurora-electric-purple/20 text-white hover:text-white cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(equipment.id)}
                    className="hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
      
      {equipments.length === 0 && !loading && (
        <div className="text-center py-16 aurora-glass rounded-3xl border border-aurora-electric-purple/20">
          <div className="aurora-floating">
            <Eye className="h-16 w-16 text-aurora-electric-purple mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="aurora-heading text-xl text-white mb-2">
            Nenhum equipamento encontrado
          </h3>
          <p className="aurora-body text-white/60">
            Tente ajustar os filtros ou criar um novo equipamento.
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
