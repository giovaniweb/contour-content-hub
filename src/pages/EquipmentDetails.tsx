
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Equipment } from "@/types/equipment"; 
import { getEquipments } from "@/utils/api-equipment";
import { FileSearch, Search, Eye, Filter, Star, Tag, LayoutGrid, ChevronLeft, ChevronRight, Flame, Dumbbell, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Componente para o detalhe de um equipamento
const EquipmentDetail: React.FC<{ equipment: Equipment }> = ({ equipment }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{equipment.nome}</h1>
          {equipment.tecnologia && (
            <p className="text-lg text-muted-foreground">{equipment.tecnologia}</p>
          )}
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant={equipment.ativo ? "default" : "secondary"}>
              {equipment.ativo ? "Ativo" : "Inativo"}
            </Badge>
            {equipment.categoria && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {equipment.categoria}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="indications">Indicações</TabsTrigger>
          <TabsTrigger value="technical">Dados Técnicos</TabsTrigger>
          <TabsTrigger value="media">Material de Apoio</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Equipamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.efeito && (
                <blockquote className="italic border-l-4 border-blue-200 pl-4 py-1 text-gray-700">
                  "{equipment.efeito}"
                </blockquote>
              )}
              <div className="prose max-w-none">
                <p>{equipment.beneficios || "Sem descrição disponível"}</p>
              </div>
              
              {equipment.fabricante && (
                <div className="pt-2 border-t">
                  <h3 className="text-sm font-medium">Informações do Fabricante</h3>
                  <p className="text-sm mt-1">{equipment.fabricante}</p>
                  {equipment.site && (
                    <a 
                      href={equipment.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center"
                    >
                      Visitar site do fabricante
                      <Eye className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Flame className="h-4 w-4 text-orange-500 mr-1" />
                  Principais Benefícios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {equipment.beneficios_lista ? (
                    equipment.beneficios_lista.map((beneficio, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-green-600 mr-1">•</span>
                        {beneficio}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      Informações não disponíveis
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Dumbbell className="h-4 w-4 text-purple-500 mr-1" />
                  Áreas de Aplicação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {equipment.areas_corpo ? (
                    equipment.areas_corpo.map((area, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50">
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Informações não disponíveis
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Tag className="h-4 w-4 text-blue-500 mr-1" />
                  Características
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {equipment.caracteristicas ? (
                    equipment.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-blue-600 mr-1">•</span>
                        {caracteristica}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      Informações não disponíveis
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="indications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indicações Terapêuticas</CardTitle>
              <CardDescription>
                Condições e casos em que este equipamento é indicado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.indicacoes && equipment.indicacoes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipment.indicacoes.map((indicacao, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Pill className="h-4 w-4 text-green-500 mt-1" />
                      <span>{indicacao}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma indicação cadastrada para este equipamento.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contraindicações</CardTitle>
              <CardDescription>
                Casos em que o uso deste equipamento não é recomendado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.contraindicacoes && equipment.contraindicacoes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipment.contraindicacoes.map((contraindicacao, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold mt-1">✕</span>
                      <span>{contraindicacao}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma contraindicação cadastrada para este equipamento.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: "Tecnologia", value: equipment.tecnologia },
                  { label: "Modelo", value: equipment.modelo },
                  { label: "Fabricante", value: equipment.fabricante },
                  { label: "País de Origem", value: equipment.pais_origem },
                  { label: "Registro ANVISA", value: equipment.reg_anvisa },
                  { label: "Classificação", value: equipment.classificacao },
                  { label: "Ano de Lançamento", value: equipment.ano_lancamento },
                  { label: "Garantia", value: equipment.garantia }
                ].map((item, index) => (
                  item.value && (
                    <div key={index} className="space-y-0.5">
                      <dt className="text-sm font-medium text-muted-foreground">{item.label}</dt>
                      <dd className="text-sm">{item.value}</dd>
                    </div>
                  )
                ))}
              </dl>
            </CardContent>
          </Card>
          
          {(equipment.parametros || equipment.protocolos) && (
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros e Protocolos</CardTitle>
              </CardHeader>
              <CardContent>
                {equipment.parametros && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Parâmetros de Uso</h3>
                    <p className="text-sm">{equipment.parametros}</p>
                  </div>
                )}
                
                {equipment.protocolos && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Protocolos Recomendados</h3>
                    <p className="text-sm">{equipment.protocolos}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Materiais Relacionados</CardTitle>
              <CardDescription>
                Vídeos, artigos e outros materiais de apoio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Em breve, você poderá acessar vídeos, artigos científicos e materiais promocionais relacionados a este equipamento.
                </p>
                
                <Button variant="outline" className="w-full">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Ver todos os materiais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="px-0 pt-4 border-t flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/equipment-details" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para lista
          </Link>
        </Button>
        
        <Button variant="default" asChild>
          <Link to="/custom-gpt" className="flex items-center">
            Criar roteiro com este equipamento
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </div>
  );
};

// Componente principal para a lista e visualização de equipamentos
const EquipmentDetails: React.FC = () => {
  const { toast } = useToast();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const params = useParams<{ id: string }>();
  const itemsPerPage = 9; // Mostrar 9 itens por página
  
  useEffect(() => {
    loadEquipments();
  }, []);
  
  useEffect(() => {
    // Se houver um ID na URL, selecione o equipamento correspondente
    if (params.id && equipments.length > 0) {
      const equipment = equipments.find(e => e.id === params.id);
      if (equipment) {
        setSelectedEquipment(equipment);
      } else {
        toast({
          variant: "destructive",
          title: "Equipamento não encontrado",
          description: "O equipamento solicitado não foi encontrado.",
        });
      }
    }
  }, [params.id, equipments, toast]);
  
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
      (equip.tecnologia && equip.tecnologia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (equip.beneficios && equip.beneficios.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (equip.efeito && equip.efeito.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtro de aba
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && equip.ativo;
    if (activeTab === "inactive") return matchesSearch && !equip.ativo;
    
    return matchesSearch;
  });
  
  // Paginação
  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const currentEquipments = filteredEquipments.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const handleCardClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };
  
  const handleBackToList = () => {
    setSelectedEquipment(null);
  };
  
  // Se temos um equipamento selecionado, mostramos o detalhe
  if (selectedEquipment) {
    return (
      <Layout title="Detalhes do Equipamento">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <EquipmentDetail equipment={selectedEquipment} />
          </CardContent>
        </Card>
      </Layout>
    );
  }
  
  return (
    <Layout title="Detalhes de Equipamentos">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Equipamentos Disponíveis</CardTitle>
                <CardDescription>
                  Verifique detalhes sobre os equipamentos utilizados nos tratamentos
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar equipamentos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Alterar visualização</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
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
                
                <TabsContent value="all" className="mt-4">
                  {renderEquipmentList(
                    currentEquipments, 
                    isLoading, 
                    handleCardClick
                  )}
                </TabsContent>
                <TabsContent value="active" className="mt-4">
                  {renderEquipmentList(
                    currentEquipments, 
                    isLoading, 
                    handleCardClick
                  )}
                </TabsContent>
                <TabsContent value="inactive" className="mt-4">
                  {renderEquipmentList(
                    currentEquipments, 
                    isLoading, 
                    handleCardClick
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={page === currentPage ? "pointer-events-none" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Função auxiliar para renderizar a lista de equipamentos
function renderEquipmentList(
  equipments: Equipment[], 
  isLoading: boolean, 
  onCardClick: (equipment: Equipment) => void
) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipments.map((equip) => (
        <Card 
          key={equip.id} 
          className={`border-l-4 ${equip.ativo ? 'border-l-green-500' : 'border-l-gray-300'} hover:shadow-md transition-shadow cursor-pointer`}
          onClick={() => onCardClick(equip)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{equip.nome}</CardTitle>
            {equip.efeito && (
              <p className="text-xs italic text-muted-foreground line-clamp-2">
                "{equip.efeito}"
              </p>
            )}
            <CardDescription className="text-xs">
              {equip.tecnologia || "Sem tecnologia especificada"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-3">{equip.beneficios || "Sem descrição disponível"}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${equip.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                {equip.ativo ? "Ativo" : "Inativo"}
              </span>
              <Button size="sm" variant="ghost" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default EquipmentDetails;
