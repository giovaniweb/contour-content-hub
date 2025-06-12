
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  LayoutList, 
  Plus, 
  Camera, 
  Tag,
  Wrench
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEquipments } from '@/hooks/useEquipments';
import { ROUTES } from '@/routes';

const EquipmentList: React.FC = () => {
  const navigate = useNavigate();
  const { equipments, loading, error } = useEquipments();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Helper function to normalize indicacoes to array
  const normalizeIndicacoes = (indicacoes: string | string[]): string[] => {
    if (!indicacoes) return [];
    if (Array.isArray(indicacoes)) return indicacoes;
    if (typeof indicacoes === 'string') {
      // Split by common delimiters
      return indicacoes.split(/[,;\n]/).map(item => item.trim()).filter(Boolean);
    }
    return [];
  };
  
  // Filter equipment based on search term
  const filteredEquipments = equipments.filter(equipment => {
    const indicacoesArray = normalizeIndicacoes(equipment.indicacoes);
    return equipment.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           equipment.tecnologia.toLowerCase().includes(searchTerm.toLowerCase()) ||
           indicacoesArray.some(indication => 
             indication.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });
  
  // Filter by category
  const getEquipmentsByTab = () => {
    if (activeTab === "all") return filteredEquipments;
    return filteredEquipments.filter(equipment => equipment.categoria === activeTab);
  };
  
  const displayEquipments = getEquipmentsByTab();
  
  // Handle view equipment
  const handleViewEquipment = (id: string) => {
    navigate(ROUTES.EQUIPMENTS.DETAILS(id));
  };
  
  // Handle add equipment
  const handleAddEquipment = () => {
    navigate(ROUTES.ADMIN.EQUIPMENTS.CREATE);
  };

  // Status label and color mapping
  const getStatusInfo = (ativo: boolean) => {
    return ativo 
      ? { label: 'Disponível', class: 'bg-green-100 text-green-700' }
      : { label: 'Indisponível', class: 'bg-gray-100 text-gray-700' };
  };

  // Get category label
  const getCategoryLabel = (categoria: string) => {
    return categoria === 'medico' ? '🏥 Médico' : '🌟 Estético';
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Wrench className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-slate-50">Equipamentos</h1>
              <p className="text-slate-400">Erro ao carregar equipamentos</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Wrench className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Equipamentos</h1>
            <p className="text-slate-400">
              Gerencie e monitore todos os seus equipamentos
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="medico">Médico</TabsTrigger>
            <TabsTrigger value="estetico">Estético</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar equipamentos..."
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none rounded-l-md"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none rounded-r-md"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleAddEquipment}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>
      </div>
      
      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando equipamentos...</p>
        </div>
      )}

      {/* Equipment Grid/List */}
      {!loading && (
        <>
          {displayEquipments.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayEquipments.map((equipment) => {
                  const statusInfo = getStatusInfo(equipment.ativo);
                  const indicacoesArray = normalizeIndicacoes(equipment.indicacoes);
                  
                  return (
                    <Card 
                      key={equipment.id} 
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                      onClick={() => handleViewEquipment(equipment.id)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                        {equipment.image_url ? (
                          <img 
                            src={equipment.image_url} 
                            alt={equipment.nome}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <Camera className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg mb-2">{equipment.nome}</h3>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={statusInfo.class}>
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="secondary">
                            {getCategoryLabel(equipment.categoria)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {equipment.tecnologia}
                        </p>
                        {indicacoesArray.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {indicacoesArray.slice(0, 2).map((indication, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                              >
                                {indication}
                              </span>
                            ))}
                            {indicacoesArray.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{indicacoesArray.length - 2} mais
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {displayEquipments.map((equipment) => {
                  const statusInfo = getStatusInfo(equipment.ativo);
                  const indicacoesArray = normalizeIndicacoes(equipment.indicacoes);
                  
                  return (
                    <Card 
                      key={equipment.id} 
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
                      onClick={() => handleViewEquipment(equipment.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div className="mr-4 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {equipment.image_url ? (
                              <img 
                                src={equipment.image_url} 
                                alt={equipment.nome}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Camera className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-lg">{equipment.nome}</h3>
                              <div className="flex gap-2">
                                <Badge className={statusInfo.class}>
                                  {statusInfo.label}
                                </Badge>
                                <Badge variant="secondary">
                                  {getCategoryLabel(equipment.categoria)}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {equipment.tecnologia}
                            </p>
                            {indicacoesArray.length > 0 && (
                              <div className="flex items-center mt-2 text-sm">
                                <Tag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {indicacoesArray.slice(0, 3).join(", ")}
                                  {indicacoesArray.length > 3 && ` +${indicacoesArray.length - 3} mais`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <Wrench className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-slate-50 mb-2">
                {equipments.length === 0 ? 'Nenhum equipamento cadastrado' : 'Nenhum equipamento encontrado'}
              </h2>
              <p className="text-slate-400 mb-6">
                {searchTerm || activeTab !== "all"
                  ? "Tente ajustar os filtros de busca" 
                  : equipments.length === 0 
                    ? "Cadastre equipamentos na área administrativa"
                    : "Nenhum equipamento encontrado"}
              </p>
              <Button onClick={handleAddEquipment}>
                Adicionar novo equipamento
              </Button>
            </div>
          )}

          {/* Statistics */}
          {displayEquipments.length > 0 && (
            <div className="text-center text-sm text-slate-400">
              Mostrando {displayEquipments.length} de {equipments.length} equipamentos
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EquipmentList;
