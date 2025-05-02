
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Equipment } from '@/types/equipment';
import EquipmentForm from './EquipmentForm';
import EquipmentList from './EquipmentList';
import { getEquipments, createEquipment, updateEquipment, deleteEquipment } from '@/utils/api';

const EquipmentManager: React.FC = () => {
  const { toast } = useToast();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      setIsLoading(true);
      const data = await getEquipments();
      setEquipments(data);
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de equipamentos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEquipment = async (newEquipment: Equipment) => {
    try {
      await createEquipment(newEquipment);
      await loadEquipments();
      setIsNewDialogOpen(false);
      toast({
        title: "Equipamento adicionado",
        description: "O equipamento foi cadastrado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao criar equipamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o equipamento.",
      });
    }
  };

  const handleUpdateEquipment = async (updatedEquipment: Equipment) => {
    try {
      await updateEquipment(updatedEquipment);
      await loadEquipments();
      toast({
        title: "Equipamento atualizado",
        description: "O equipamento foi atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar equipamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o equipamento.",
      });
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      await deleteEquipment(id);
      await loadEquipments();
      toast({
        title: "Equipamento removido",
        description: "O equipamento foi removido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o equipamento.",
      });
    }
  };

  const filteredEquipments = activeTab === "all" 
    ? equipments 
    : activeTab === "active" 
      ? equipments.filter(e => e.ativo) 
      : equipments.filter(e => !e.ativo);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciamento de Equipamentos</CardTitle>
          <CardDescription>
            Cadastre e gerencie os equipamentos disponíveis para roteiros
          </CardDescription>
        </div>
        <Button onClick={() => setIsNewDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="inactive">Inativos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <EquipmentList
            equipments={filteredEquipments}
            onEdit={handleUpdateEquipment}
            onDelete={handleDeleteEquipment}
          />
        )}
      </CardContent>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Equipamento</DialogTitle>
            <DialogDescription>
              Cadastre um novo equipamento para uso nos roteiros
            </DialogDescription>
          </DialogHeader>
          
          <EquipmentForm
            onSave={handleCreateEquipment}
            onCancel={() => setIsNewDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EquipmentManager;
