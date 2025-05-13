
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Search, 
  Filter, 
  Grid, 
  LayoutList, 
  Plus, 
  Camera, 
  Tag 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';
import { ROUTES } from '@/routes';

// Mock data para equipamentos
const mockEquipments = [
  {
    id: "equip-1",
    nome: "Canon EOS R5",
    categoria: "cameras",
    status: "available",
    tags: ["4K", "Vídeo", "Fotografia"],
    thumbnail: "https://example.com/images/canon-r5.jpg",
    description: "Câmera mirrorless full frame de 45MP com gravação 8K"
  },
  {
    id: "equip-2",
    nome: "Ring Light LED 18\"",
    categoria: "iluminacao",
    status: "in-use",
    tags: ["Iluminação", "Estúdio"],
    thumbnail: "https://example.com/images/ring-light.jpg",
    description: "Ring light de 48cm com temperatura ajustável entre 3000K e 6000K"
  },
  {
    id: "equip-3",
    nome: "Microfone Rode VideoMic Pro",
    categoria: "audio",
    status: "available",
    tags: ["Áudio", "Externo"],
    thumbnail: "https://example.com/images/rode-mic.jpg",
    description: "Microfone direcional de alta qualidade para montagem em câmera"
  },
  {
    id: "equip-4",
    nome: "Tripé Manfrotto 290",
    categoria: "suportes",
    status: "maintenance",
    tags: ["Suporte", "Estúdio"],
    thumbnail: "https://example.com/images/tripod.jpg",
    description: "Tripé profissional com altura máxima de 160cm"
  },
  {
    id: "equip-5",
    nome: "Kit de Iluminação Softbox",
    categoria: "iluminacao",
    status: "available",
    tags: ["Iluminação", "Estúdio", "Kit"],
    thumbnail: "https://example.com/images/softbox-kit.jpg",
    description: "Kit com 2 softboxes de 50x70cm e tripés ajustáveis"
  },
];

const EquipmentList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter equipments based on search term
  const filteredEquipments = mockEquipments.filter(equipment => 
    equipment.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter by category
  const getEquipmentsByTab = () => {
    if (activeTab === "all") return filteredEquipments;
    return filteredEquipments.filter(equipment => equipment.categoria === activeTab);
  };
  
  const displayEquipments = getEquipmentsByTab();
  
  // Handle view equipment
  const handleViewEquipment = (id: string) => {
    navigate(ROUTES.EQUIPMENT.DETAILS(id));
  };
  
  // Handle add equipment
  const handleAddEquipment = () => {
    // Navigate to equipment creation page (to be implemented)
    console.log("Adding new equipment");
  };

  // Status label and color mapping
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'Disponível', class: 'bg-green-100 text-green-700' };
      case 'in-use':
        return { label: 'Em uso', class: 'bg-blue-100 text-blue-700' };
      case 'maintenance':
        return { label: 'Manutenção', class: 'bg-amber-100 text-amber-700' };
      default:
        return { label: 'Indisponível', class: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <ContentLayout
      title="Equipamentos"
      subtitle="Gerencie e monitore todos os seus equipamentos"
      actions={
        <Button 
          onClick={handleAddEquipment}
          className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6 md:mb-0">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="cameras">Câmeras</TabsTrigger>
            <TabsTrigger value="iluminacao">Iluminação</TabsTrigger>
            <TabsTrigger value="audio">Áudio</TabsTrigger>
            <TabsTrigger value="suportes">Suportes</TabsTrigger>
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
        </div>
      </div>
      
      {displayEquipments.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayEquipments.map((equipment) => {
              const statusInfo = getStatusInfo(equipment.status);
              
              return (
                <GlassContainer 
                  key={equipment.id} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewEquipment(equipment.id)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-lg">{equipment.nome}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {equipment.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {equipment.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassContainer>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {displayEquipments.map((equipment) => {
              const statusInfo = getStatusInfo(equipment.status);
              
              return (
                <GlassContainer 
                  key={equipment.id} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewEquipment(equipment.id)}
                >
                  <div className="flex items-center">
                    <div className="mr-4 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-lg">{equipment.nome}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {equipment.description}
                      </p>
                      <div className="flex items-center mt-2 text-sm">
                        <Tag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {equipment.tags.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassContainer>
              );
            })}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Box className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-medium">Nenhum equipamento encontrado</h2>
          <p className="text-muted-foreground text-center">
            Não encontramos equipamentos correspondentes à sua busca.
          </p>
          <Button variant="outline" className="mt-6" onClick={handleAddEquipment}>
            Adicionar novo equipamento
          </Button>
        </div>
      )}
    </ContentLayout>
  );
};

export default EquipmentList;
