
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, Search, Plus, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from '@/types/equipment';
import EquipmentList from './EquipmentList';
import { getEquipments, deleteEquipment } from '@/api/equipment';
import { exportToCSV, exportToJSON } from '@/utils/exportEquipment';

const EquipmentManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fetch equipment data
  useEffect(() => {
    fetchEquipments();
  }, []);
  
  // Filter equipments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEquipments(equipments);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = equipments.filter(eq => 
        eq.nome.toLowerCase().includes(lowercaseSearch) || 
        eq.tecnologia.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredEquipments(filtered);
    }
  }, [searchTerm, equipments]);
  
  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await getEquipments();
      setEquipments(data);
      setFilteredEquipments(data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar equipamentos",
        description: "Não foi possível buscar os equipamentos. Por favor, tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateEquipment = () => {
    navigate('/admin/equipments/create');
  };
  
  const handleEditEquipment = (equipment: Equipment) => {
    navigate(`/admin/equipments/edit/${equipment.id}`);
  };
  
  // Changed to async/Promise
  const handleDeleteClick = async (id: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      setDeletingId(id);
      setShowDeleteDialog(true);
      resolve();
    });
  };
  
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    
    try {
      setIsProcessing(true);
      await deleteEquipment(deletingId);
      setEquipments(prev => prev.filter(eq => eq.id !== deletingId));
      toast({
        title: "Equipamento excluído",
        description: "O equipamento foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir equipamento",
        description: "Não foi possível excluir o equipamento. Por favor, tente novamente.",
      });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        exportToCSV(filteredEquipments);
      } else {
        exportToJSON(filteredEquipments);
      }
      toast({
        title: "Exportação concluída",
        description: `Equipamentos exportados em formato ${format.toUpperCase()} com sucesso.`,
      });
    } catch (error) {
      console.error('Error exporting equipments:', error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: error instanceof Error ? error.message : "Não foi possível exportar os equipamentos.",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar equipamentos..."
            className="pl-10 aurora-glass border-aurora-electric-purple/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="aurora-glass border-aurora-electric-purple/30"
                disabled={filteredEquipments.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="aurora-glass border-aurora-electric-purple/30">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Exportar JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleCreateEquipment}
            className="aurora-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-[400px] aurora-glass border-aurora-electric-purple/30">
          <TabsTrigger value="all" className="data-[state=active]:bg-aurora-electric-purple/20">Todos</TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-aurora-electric-purple/20">Ativos</TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-aurora-electric-purple/20">Inativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <EquipmentList
            equipments={filteredEquipments}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="active">
          <EquipmentList
            equipments={filteredEquipments.filter(eq => eq.ativo)}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="inactive">
          <EquipmentList
            equipments={filteredEquipments.filter(eq => !eq.ativo)}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteClick}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="aurora-glass border-aurora-electric-purple/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="aurora-text-gradient">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="aurora-body text-white/70">
              Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EquipmentManager;
