
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/layout/ContentLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Search, Filter, PlusCircle, Edit, Eye, Trash2, ArrowUpRight } from "lucide-react";
import { ROUTES } from '@/routes';

// Mock script data
const scripts = [
  {
    id: "1",
    title: "Como preparar a pele antes da maquiagem",
    category: "Tutorial",
    status: "published",
    views: 1245,
    engagement: 8.7,
    updatedAt: "2025-05-01",
    thumbnail: "https://example.com/thumbs/skincare.jpg"
  },
  {
    id: "2",
    title: "5 dicas para cuidados com cabelo no verão",
    category: "Dicas",
    status: "draft",
    views: 0,
    engagement: 0,
    updatedAt: "2025-04-28",
    thumbnail: "https://example.com/thumbs/hair.jpg"
  },
  {
    id: "3",
    title: "Demonstração do novo produto X para hidratação",
    category: "Produto",
    status: "published",
    views: 879,
    engagement: 6.2,
    updatedAt: "2025-04-15",
    thumbnail: "https://example.com/thumbs/product.jpg"
  },
  {
    id: "4",
    title: "Tendências de maquiagem para o inverno",
    category: "Tendências",
    status: "review",
    views: 0,
    engagement: 0,
    updatedAt: "2025-05-10",
    thumbnail: "https://example.com/thumbs/makeup.jpg"
  }
];

const ContentScripts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          script.category.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesTab = activeTab === "all" || 
                      (activeTab === "published" && script.status === "published") ||
                      (activeTab === "drafts" && script.status === "draft") ||
                      (activeTab === "review" && script.status === "review");
                      
    return matchesSearch && matchesTab;
  });
  
  const handleCreateScript = () => {
    navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR);
  };
  
  const handleEditScript = (id: string) => {
    navigate(`${ROUTES.CONTENT.SCRIPTS.ROOT}/${id}/edit`);
  };
  
  const handleViewScript = (id: string) => {
    navigate(`${ROUTES.CONTENT.SCRIPTS.ROOT}/${id}`);
  };
  
  const handleDeleteScript = (id: string) => {
    // In a real app, this would make an API call to delete the script
    console.log('Delete script:', id);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'review': return 'Em revisão';
      default: return status;
    }
  };
  
  return (
    <ContentLayout
      title="Roteiros"
      subtitle="Crie e gerencie roteiros para seus vídeos"
      actions={
        <Button onClick={handleCreateScript} className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Roteiro
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
            <TabsTrigger value="review">Em revisão</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar roteiros..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredScripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium">Nenhum roteiro encontrado</h2>
          <p className="text-muted-foreground text-center">
            {activeTab !== 'all' 
              ? `Não há roteiros na categoria "${activeTab}". Tente mudar o filtro.` 
              : 'Não encontramos roteiros correspondentes à sua busca.'}
          </p>
          <Button variant="outline" className="mt-6" onClick={handleCreateScript}>
            Criar novo roteiro
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script) => (
            <Card key={script.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded border ${getStatusBadgeClass(script.status)}`}>
                      {getStatusLabel(script.status)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {script.category}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleViewScript(script.id)} 
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg leading-tight">{script.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                {script.status === 'published' && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Visualizações:</span>
                    <span className="font-medium">{script.views.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Última atualização:</span>
                  <span>{new Date(script.updatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex justify-between">
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditScript(script.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewScript(script.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteScript(script.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </ContentLayout>
  );
};

export default ContentScripts;
