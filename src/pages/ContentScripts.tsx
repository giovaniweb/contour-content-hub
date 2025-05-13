
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, FileEdit, Clock } from 'lucide-react';
import { ROUTES } from '@/routes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';

// Mock data para scripts
const mockScripts = [
  {
    id: "script-1",
    title: "Roteiro: Aplicação de base líquida",
    date: "2025-05-10",
    status: "published",
    author: "Carla Mendes"
  },
  {
    id: "script-2",
    title: "Roteiro: Cuidados noturnos para pele oleosa",
    date: "2025-05-08",
    status: "draft",
    author: "Ana Silva"
  },
  {
    id: "script-3",
    title: "Roteiro: Contorno facial avançado",
    date: "2025-05-05",
    status: "published",
    author: "Carla Mendes"
  },
  {
    id: "script-4",
    title: "Roteiro: Hidratação profunda para cabelos",
    date: "2025-05-02",
    status: "review",
    author: "Beatriz Costa"
  },
  {
    id: "script-5",
    title: "Roteiro: Maquiagem para eventos",
    date: "2025-04-28",
    status: "published",
    author: "Ana Silva"
  }
];

const ContentScripts: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter scripts based on search term
  const filteredScripts = mockScripts.filter(script => 
    script.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get scripts for the active tab
  const getScriptsByTab = () => {
    if (activeTab === "all") return filteredScripts;
    if (activeTab === "published") return filteredScripts.filter(s => s.status === "published");
    if (activeTab === "drafts") return filteredScripts.filter(s => s.status === "draft");
    if (activeTab === "review") return filteredScripts.filter(s => s.status === "review");
    return filteredScripts;
  };

  const displayScripts = getScriptsByTab();

  // Handler to open script generator
  const handleCreateScript = () => {
    navigate(ROUTES.CONTENT.SCRIPTS.GENERATOR);
  };

  // Handler to view a script
  const handleViewScript = (id: string) => {
    navigate(`${ROUTES.CONTENT.SCRIPTS.ROOT}/${id}`);
  };

  return (
    <ContentLayout
      title="Roteiros"
      subtitle="Crie e gerencie roteiros para seus vídeos"
      actions={
        <Button 
          onClick={handleCreateScript}
          className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Roteiro
        </Button>
      }
    >
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
            <TabsTrigger value="review">Em revisão</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar roteiros..."
                className="pl-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Tabs>
      
      {displayScripts.length > 0 ? (
        <div className="space-y-4">
          {displayScripts.map((script) => (
            <GlassContainer 
              key={script.id} 
              className="hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleViewScript(script.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-full mr-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{script.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center mr-4">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {new Date(script.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{script.author}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    script.status === 'published' 
                      ? 'bg-green-100 text-green-700' 
                      : script.status === 'draft'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {script.status === 'published' 
                      ? 'Publicado' 
                      : script.status === 'draft'
                        ? 'Rascunho'
                        : 'Em revisão'}
                  </span>
                </div>
              </div>
            </GlassContainer>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <FileEdit className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-medium">Nenhum roteiro encontrado</h2>
          <p className="text-muted-foreground text-center">
            Não encontramos roteiros correspondentes à sua busca.
          </p>
          <Button variant="outline" className="mt-6" onClick={handleCreateScript}>
            Criar novo roteiro
          </Button>
        </div>
      )}
    </ContentLayout>
  );
};

export default ContentScripts;
