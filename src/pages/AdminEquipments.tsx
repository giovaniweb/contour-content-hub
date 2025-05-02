
import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EquipmentManager from "@/components/admin/EquipmentManager";
import { Equipment } from "@/types/equipment";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { importEquipments } from "@/utils/api-equipment";

const AdminEquipments: React.FC = () => {
  const { toast } = useToast();
  const [importingFile, setImportingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportingFile(true);
      toast({
        title: "Importando equipamentos",
        description: "Aguarde enquanto processamos o arquivo...",
      });
      
      const result = await importEquipments(file);
      
      toast({
        title: "Importação concluída",
        description: `${result.imported} equipamentos foram importados com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao importar equipamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Não foi possível importar os equipamentos.",
      });
    } finally {
      setImportingFile(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Layout title="Gerenciamento de Equipamentos">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Equipamentos</h1>
        <p className="text-muted-foreground mt-1">
          Cadastre e gerencie os equipamentos disponíveis para criação de roteiros
        </p>
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
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mt-6">
              <div className="text-center space-y-4">
                <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium">Importe Equipamentos em Massa</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  Faça upload de um arquivo JSON ou CSV contendo a lista de equipamentos que você deseja importar.
                </p>
                <div className="flex justify-center mt-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json,.csv" 
                    className="hidden" 
                  />
                  <Button 
                    onClick={handleFileSelection} 
                    disabled={importingFile} 
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    {importingFile ? "Importando..." : "Selecionar Arquivo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdminEquipments;
