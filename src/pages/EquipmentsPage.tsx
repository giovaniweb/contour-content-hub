
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getEquipments } from '@/api/equipment';
import { Equipment } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const EquipmentsPage: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const data = await getEquipments();
        // Filtrar apenas equipamentos ativos para os clientes
        const activeEquipments = data.filter(eq => eq.ativo);
        setEquipments(activeEquipments);
        setFilteredEquipments(activeEquipments);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar equipamentos",
          description: "Não foi possível carregar a lista de equipamentos.",
        });
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [toast]);

  // Filtrar equipamentos com base na pesquisa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEquipments(equipments);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = equipments.filter(eq => 
        eq.nome.toLowerCase().includes(lowercaseSearch) || 
        (eq.tecnologia && eq.tecnologia.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredEquipments(filtered);
    }
  }, [searchTerm, equipments]);

  const handleViewDetails = (id: string) => {
    navigate(`/equipments/${id}`);
  };

  if (loading) {
    return (
      <Layout title="Equipamentos">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Equipamentos">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Nossos Equipamentos</h1>
            <p className="text-muted-foreground">
              Conheça nossa linha completa de equipamentos e suas tecnologias
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList>
            <TabsTrigger value="todos">Todos os Equipamentos</TabsTrigger>
            <TabsTrigger value="laser">Tecnologia Laser</TabsTrigger>
            <TabsTrigger value="rf">Radiofrequência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map(equipment => (
                <EquipmentCard 
                  key={equipment.id} 
                  equipment={equipment}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            
            {filteredEquipments.length === 0 && (
              <div className="text-center py-20 bg-muted/30 rounded-lg">
                <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">Nenhum equipamento encontrado</h3>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar sua busca ou entre em contato conosco para mais informações.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="laser" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments
                .filter(eq => eq.tecnologia?.toLowerCase().includes('laser'))
                .map(equipment => (
                  <EquipmentCard 
                    key={equipment.id} 
                    equipment={equipment}
                    onViewDetails={handleViewDetails}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="rf" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments
                .filter(eq => eq.tecnologia?.toLowerCase().includes('rf') || 
                             eq.tecnologia?.toLowerCase().includes('radiofrequência'))
                .map(equipment => (
                  <EquipmentCard 
                    key={equipment.id} 
                    equipment={equipment}
                    onViewDetails={handleViewDetails}
                  />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetails: (id: string) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onViewDetails }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{equipment.nome}</CardTitle>
        <CardDescription className="line-clamp-1">{equipment.tecnologia}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {equipment.image_url ? (
          <div className="relative h-40 mb-4">
            <img 
              src={equipment.image_url} 
              alt={equipment.nome}
              className="w-full h-full object-cover rounded-md" 
            />
          </div>
        ) : (
          <div className="h-40 mb-4 bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Imagem não disponível</p>
          </div>
        )}
        
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Indicações:</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {Array.isArray(equipment.indicacoes) 
                ? equipment.indicacoes.join(', ') 
                : equipment.indicacoes || 'Não especificado'}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
          Disponível
        </Badge>
        <Button variant="ghost" onClick={() => onViewDetails(equipment.id)}>
          Detalhes <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EquipmentsPage;
