
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEquipments, Equipment } from "@/utils/api";
import { FileSearch, Search } from "lucide-react";

const EquipmentDetails: React.FC = () => {
  const { toast } = useToast();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        description: "Falha ao carregar a lista de equipamentos.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para filtrar equipamentos
  const filteredEquipments = equipments.filter(equip => {
    // Filtro de busca
    const matchesSearch = 
      equip.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equip.descricao && equip.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (equip.categoria && equip.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro de aba
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && equip.ativo;
    if (activeTab === "inactive") return matchesSearch && !equip.ativo;
    
    return matchesSearch;
  });
  
  return (
    <Layout title="Detalhes de Equipamentos">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Disponíveis</CardTitle>
            <CardDescription>
              Verifique detalhes sobre os equipamentos utilizados nos tratamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barra de pesquisa */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar equipamentos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar
                </Button>
              </div>
              
              {/* Abas de filtro */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="inactive">Inativos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {renderEquipmentList(filteredEquipments, isLoading)}
                </TabsContent>
                <TabsContent value="active">
                  {renderEquipmentList(filteredEquipments, isLoading)}
                </TabsContent>
                <TabsContent value="inactive">
                  {renderEquipmentList(filteredEquipments, isLoading)}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Função auxiliar para renderizar a lista de equipamentos
function renderEquipmentList(equipments: Equipment[], isLoading: boolean) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-contourline-mediumBlue border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (equipments.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <FileSearch className="mx-auto h-8 w-8 text-gray-400" />
        <p className="text-gray-500">Nenhum equipamento encontrado</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {equipments.map((equip) => (
        <Card key={equip.id} className={`border-l-4 ${equip.ativo ? 'border-l-green-500' : 'border-l-gray-300'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{equip.nome}</CardTitle>
            <CardDescription className="text-xs">
              {equip.categoria || "Sem categoria"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{equip.descricao || "Sem descrição disponível"}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${equip.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                {equip.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default EquipmentDetails;
