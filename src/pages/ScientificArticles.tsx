
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Search, Filter, BookOpen, Plus, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';

// Mock data para artigos
const mockArticles = [
  {
    id: "article-1",
    title: "Análise comparativa de ingredientes em hidratantes faciais",
    author: "Dra. Maria Santos",
    date: "2025-04-12",
    journal: "Journal of Cosmetic Dermatology",
    categories: ["Skincare", "Pesquisa"]
  },
  {
    id: "article-2",
    title: "Eficácia de antioxidantes na prevenção do envelhecimento cutâneo",
    author: "Dr. Carlos Oliveira",
    date: "2025-04-05",
    journal: "Dermatology Science Review",
    categories: ["Anti-idade", "Clínico"]
  },
  {
    id: "article-3",
    title: "Impacto de formulações naturais nos tratamentos de hiperpigmentação",
    author: "Dra. Amanda Ferreira",
    date: "2025-03-28",
    journal: "Natural Cosmetics Research",
    categories: ["Natural", "Pigmentação"]
  },
  {
    id: "article-4",
    title: "Efeitos da exposição solar controlada na produção de vitamina D",
    author: "Dr. Roberto Mendes",
    date: "2025-03-20",
    journal: "Sun Exposure Health Journal",
    categories: ["Proteção Solar", "Saúde"]
  }
];

const ScientificArticles: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter articles based on search term
  const filteredArticles = mockArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.journal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by category
  const getArticlesByTab = () => {
    if (activeTab === "all") return filteredArticles;
    return filteredArticles.filter(article => 
      article.categories.some(cat => cat.toLowerCase() === activeTab.toLowerCase())
    );
  };

  const displayArticles = getArticlesByTab();

  // Handle view article
  const handleViewArticle = (id: string) => {
    // Navigate to article detail page (to be implemented)
    console.log(`Viewing article ${id}`);
  };

  // Handle create article
  const handleCreateArticle = () => {
    // Navigate to article creation page (to be implemented)
    console.log("Creating new article");
  };

  return (
    <ContentLayout
      title="Artigos Científicos"
      subtitle="Base de conhecimento para embasar seus conteúdos"
      actions={
        <Button 
          onClick={handleCreateArticle}
          className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Artigo
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="skincare">Skincare</TabsTrigger>
              <TabsTrigger value="pesquisa">Pesquisa</TabsTrigger>
              <TabsTrigger value="clínico">Clínico</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar artigos..."
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
        
        {displayArticles.length > 0 ? (
          <div className="space-y-4">
            {displayArticles.map((article) => (
              <GlassContainer 
                key={article.id} 
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewArticle(article.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start md:items-center">
                    <div className="p-2 bg-purple-50 rounded-full mr-4">
                      <Book className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base md:text-lg">{article.title}</h3>
                      <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground mt-1 gap-y-1 md:gap-x-4">
                        <span className="flex items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {new Date(article.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="italic">{article.journal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                    {article.categories.map((category, idx) => (
                      <Badge key={idx} variant="secondary">{category}</Badge>
                    ))}
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        ) : (
          <GlassContainer>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-lg font-medium">Nenhum artigo encontrado</h2>
              <p className="text-muted-foreground text-center">
                Não encontramos artigos correspondentes à sua busca.
              </p>
              <Button variant="outline" className="mt-6" onClick={handleCreateArticle}>
                Adicionar novo artigo
              </Button>
            </div>
          </GlassContainer>
        )}
      </div>
    </ContentLayout>
  );
};

export default ScientificArticles;
