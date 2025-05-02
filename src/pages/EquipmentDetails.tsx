
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Settings, FileText, CheckCircle, AlertCircle, Info, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Equipment {
  id: string;
  nome: string;
  tecnologia: string;
  beneficios: string;
  indicacoes: string;
  diferenciais: string;
  image_url?: string;
  ativo: boolean;
  data_cadastro: string;
}

const EquipmentDetails: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const { data: equipments, isLoading, isError, refetch } = useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipamentos")
        .select("*")
        .order("nome", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      return data as Equipment[];
    }
  });

  const filteredEquipments = equipments?.filter(equip => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return equip.ativo;
    if (activeTab === "inactive") return !equip.ativo;
    return true;
  });

  const handleSelectEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  const handleCloseDetails = () => {
    setSelectedEquipment(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Layout title="Detalhes de Equipamentos">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout title="Detalhes de Equipamentos">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-red-500">
                <AlertCircle className="mr-2" /> Erro ao carregar equipamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Não foi possível carregar os dados dos equipamentos. Por favor, tente novamente mais tarde.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => refetch()}>Tentar novamente</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Detalhes de Equipamentos">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">Equipamentos Disponíveis</h2>
          <p className="text-muted-foreground">
            Visualize informações detalhadas sobre os equipamentos cadastrados no sistema.
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="inactive">Inativos</TabsTrigger>
            </TabsList>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Acessar Gerenciador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Área Administrativa</DialogTitle>
                  <DialogDescription>
                    A administração de equipamentos é feita no painel administrativo.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Para adicionar, editar ou remover equipamentos, acesse o painel administrativo clicando no botão abaixo.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => window.location.href = "/admin/equipments"}>
                    Ir para Gerenciador de Equipamentos
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {filteredEquipments && filteredEquipments.length > 0 ? (
                filteredEquipments.map((equipment) => (
                  <EquipmentCard 
                    key={equipment.id} 
                    equipment={equipment} 
                    onSelect={handleSelectEquipment} 
                  />
                ))
              ) : (
                <div className="col-span-3 bg-muted rounded-lg p-8 text-center">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum equipamento encontrado</h3>
                  <p className="text-muted-foreground">Não há equipamentos cadastrados nesta categoria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {filteredEquipments && filteredEquipments.length > 0 ? (
                filteredEquipments.map((equipment) => (
                  <EquipmentCard 
                    key={equipment.id} 
                    equipment={equipment} 
                    onSelect={handleSelectEquipment} 
                  />
                ))
              ) : (
                <div className="col-span-3 bg-muted rounded-lg p-8 text-center">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum equipamento ativo</h3>
                  <p className="text-muted-foreground">Não há equipamentos ativos cadastrados.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {filteredEquipments && filteredEquipments.length > 0 ? (
                filteredEquipments.map((equipment) => (
                  <EquipmentCard 
                    key={equipment.id} 
                    equipment={equipment} 
                    onSelect={handleSelectEquipment} 
                  />
                ))
              ) : (
                <div className="col-span-3 bg-muted rounded-lg p-8 text-center">
                  <Info className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhum equipamento inativo</h3>
                  <p className="text-muted-foreground">Não há equipamentos inativos cadastrados.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedEquipment && (
        <EquipmentDetailsDialog 
          equipment={selectedEquipment} 
          onClose={handleCloseDetails} 
        />
      )}
    </Layout>
  );
};

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: (equipment: Equipment) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onSelect }) => {
  return (
    <Card className="overflow-hidden hover:border-blue-200 transition-colors cursor-pointer" onClick={() => onSelect(equipment)}>
      <div className="h-40 bg-blue-50 flex items-center justify-center overflow-hidden">
        {equipment.image_url ? (
          <img 
            src={equipment.image_url} 
            alt={equipment.nome} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-blue-100/50">
            <Settings className="h-16 w-16 text-blue-300" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{equipment.nome}</CardTitle>
          {equipment.ativo ? (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Ativo</Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Inativo</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{equipment.tecnologia}</p>
      </CardContent>
      <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
        Cadastrado em {new Date(equipment.data_cadastro).toLocaleDateString('pt-BR')}
      </CardFooter>
    </Card>
  );
};

interface EquipmentDetailsDialogProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentDetailsDialog: React.FC<EquipmentDetailsDialogProps> = ({ equipment, onClose }) => {
  return (
    <Dialog open={Boolean(equipment)} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{equipment.nome}</span>
            {equipment.ativo ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Ativo</Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Inativo</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-48 w-full bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {equipment.image_url ? (
                <img 
                  src={equipment.image_url} 
                  alt={equipment.nome} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-blue-100/50">
                  <Settings className="h-16 w-16 text-blue-300" />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Data de Cadastro</h4>
                <p className="text-sm">{new Date(equipment.data_cadastro).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Tecnologia</h3>
              <p className="text-sm">{equipment.tecnologia}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Benefícios</h3>
              <ScrollArea className="h-24">
                <p className="text-sm">{equipment.beneficios}</p>
              </ScrollArea>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Indicações</h3>
              <ScrollArea className="h-24">
                <p className="text-sm">{equipment.indicacoes}</p>
              </ScrollArea>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Diferenciais</h3>
              <ScrollArea className="h-24">
                <p className="text-sm">{equipment.diferenciais}</p>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button 
            onClick={() => {
              // Aqui adicionaríamos a funcionalidade para gerar roteiro com este equipamento
              window.location.href = `/script-generator?equipment=${equipment.nome}`;
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Roteiro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentDetails;
