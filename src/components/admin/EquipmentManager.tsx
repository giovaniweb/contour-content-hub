import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from '@/types/equipment';
import EquipmentForm from './EquipmentForm';
import EquipmentList from './EquipmentList';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment } from '@/api/equipment';

const EquipmentManager: React.FC = () => {
  const { toast } = useToast();
  
  // State
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
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
  
  const handleCreateEquipment = async (equipment: any) => {
    try {
      setIsProcessing(true);
      const createdEquipment = await createEquipment(equipment);
      setEquipments(prev => [...prev, createdEquipment]);
      setShowNewForm(false);
      toast({
        title: "Equipamento criado",
        description: `${equipment.nome} foi criado com sucesso.`,
      });
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar equipamento",
        description: "Não foi possível criar o equipamento. Por favor, tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEditEquipment = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setShowEditForm(true);
  };
  
  const handleUpdateEquipment = async (equipment: any) => {
    if (!currentEquipment) return;
    
    try {
      setIsProcessing(true);
      const updatedEquipment = await updateEquipment(currentEquipment.id, equipment);
      setEquipments(prev => prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq));
      setShowEditForm(false);
      toast({
        title: "Equipamento atualizado",
        description: `${updatedEquipment.nome} foi atualizado com sucesso.`,
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar equipamento",
        description: "Não foi possível atualizar o equipamento. Por favor, tente novamente.",
      });
    } finally {
      setIsProcessing(false);
    }
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
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar equipamentos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-[400px]">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
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
      
      {/* Add Equipment Dialog */}
      <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo equipamento.
            </DialogDescription>
          </DialogHeader>
          
          <EquipmentForm 
            onSave={handleCreateEquipment} 
            onCancel={() => setShowNewForm(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Equipment Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Editar Equipamento</DialogTitle>
            <DialogDescription>
              Edite os detalhes do equipamento.
            </DialogDescription>
          </DialogHeader>
          
          {currentEquipment && (
            <EquipmentForm 
              equipment={currentEquipment}
              onSave={handleUpdateEquipment}
              onCancel={() => setShowEditForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
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
