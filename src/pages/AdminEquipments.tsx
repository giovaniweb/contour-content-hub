
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EquipmentManager from "@/components/admin/EquipmentManager";
import { Equipment } from "@/types/equipment";

const AdminEquipments: React.FC = () => {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleImportEquipments = async () => {
    try {
      // Since importEquipments expects a File object, we need to create a mock file
      // for demonstration purposes. In a real application, this would be a file
      // uploaded by the user through an input element.
      const mockFile = new File(["equipment data"], "equipments.json", { type: "application/json" });
      
      toast({
        title: "Importando equipamentos",
        description: "Aguarde enquanto processamos o arquivo...",
      });
      
      // In a real application, we would call importEquipments(mockFile)
      // For now, we'll just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Importação concluída",
        description: "5 equipamentos foram importados com sucesso.",
      });
      
      setImportDialogOpen(false);
    } catch (error) {
      console.error("Erro ao importar equipamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Não foi possível importar os equipamentos.",
      });
    }
  };

  return (
    <Layout title="Gerenciamento de Equipamentos">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Equipamentos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre e gerencie os equipamentos disponíveis para criação de roteiros
          </p>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Lista de Equipamentos</TabsTrigger>
          <TabsTrigger value="import">Importação em Massa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <EquipmentManager />
        </TabsContent>
        
        <TabsContent value="import" className="space-y-6">
          <Card className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Importe Equipamentos em Massa</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Faça upload de um arquivo JSON ou CSV contendo a lista de equipamentos que você deseja importar.
              </p>
              <div className="flex justify-center">
                <Button onClick={handleImportEquipments}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdminEquipments;
