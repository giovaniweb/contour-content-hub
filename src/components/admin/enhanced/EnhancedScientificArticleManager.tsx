
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, BookOpen, Filter, Grid2x2, LayoutList, Sparkles, GraduationCap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import EnhancedScientificArticleForm from "./EnhancedScientificArticleForm";
import { useEquipments } from "@/hooks/useEquipments";
import AuroraLoadingSkeleton from "@/components/aurora/AuroraLoadingSkeleton";

// Componente interno para lista de artigos
const ArticleList: React.FC<{
  articles: any[];
  onDelete: (id: string) => void;
  onUpdate: (article: any) => void;
  viewMode: "grid" | "list";
}> = ({
  articles,
  onDelete,
  onUpdate,
  viewMode
}) => {
  if (viewMode === "grid") {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => <div key={article.id} className="aurora-glass p-6 rounded-lg border border-aurora-electric-purple/20">
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="h-6 w-6 text-aurora-electric-purple" />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onUpdate(article)} className="text-aurora-neon-blue hover:bg-aurora-neon-blue/20">
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(article.id)} className="text-red-400 hover:bg-red-400/20">
                  Excluir
                </Button>
              </div>
            </div>
            <h3 className="aurora-heading text-lg mb-2">{article.titulo}</h3>
            <p className="text-slate-400 text-sm mb-4">{article.descricao}</p>
            {article.equipamentos && <div className="text-xs text-aurora-electric-purple">
                Equipamento: {article.equipamentos.nome}
              </div>}
          </div>)}
      </div>;
  }
  return <div className="space-y-4">
      {articles.map(article => <div key={article.id} className="aurora-glass p-4 rounded-lg border border-aurora-electric-purple/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-aurora-electric-purple" />
            <div>
              <h3 className="aurora-heading">{article.titulo}</h3>
              <p className="text-slate-400 text-sm">{article.descricao}</p>
              {article.equipamentos && <div className="text-xs text-aurora-electric-purple mt-1">
                  Equipamento: {article.equipamentos.nome}
                </div>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onUpdate(article)} className="text-aurora-neon-blue hover:bg-aurora-neon-blue/20">
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(article.id)} className="text-red-400 hover:bg-red-400/20">
              Excluir
            </Button>
          </div>
        </div>)}
    </div>;
};

const EnhancedScientificArticleManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { equipments: equipmentOptions } = useEquipments();

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('documentos_tecnicos').select(`
          *,
          equipamentos(nome)
        `).eq('tipo', 'artigo_cientifico').eq('status', 'ativo').order('data_criacao', {
        ascending: false
      });
      if (filterEquipment && filterEquipment !== "all") {
        query = query.eq('equipamento_id', filterEquipment);
      }
      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error("Não foi possível carregar os artigos científicos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === "list") {
      fetchArticles();
    }
  }, [searchQuery, filterEquipment, currentView]);

  const handleArticleSuccess = () => {
    toast.success("Artigo científico salvo com sucesso!");
    setCurrentView("list");
    setSelectedArticle(null);
    fetchArticles();
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase.from('documentos_tecnicos').update({
        status: 'inativo'
      }).eq('id', id);
      if (error) throw error;
      fetchArticles();
      toast.success("Artigo científico excluído com sucesso.");
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error("Não foi possível excluir o artigo científico.");
    }
  };

  const handleNewArticle = () => {
    setSelectedArticle(null);
    setCurrentView("form");
  };

  const handleEditArticle = (article: any) => {
    setSelectedArticle(article);
    setCurrentView("form");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedArticle(null);
  };

  // Se está no modo formulário, renderiza apenas o formulário
  if (currentView === "form") {
    return (
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles fixed inset-0 pointer-events-none" />
        
        <div className="relative">
          {/* Header com botão de voltar */}
          <div className="p-6 border-b border-aurora-electric-purple/20">
            <div className="max-w-7xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="text-aurora-electric-purple hover:bg-aurora-electric-purple/20 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Lista
              </Button>
            </div>
          </div>
          
          <EnhancedScientificArticleForm
            articleData={selectedArticle}
            onSuccess={handleArticleSuccess}
            onCancel={handleBackToList}
            forceClearState={!selectedArticle}
          />
        </div>
      </div>
    );
  }

  // Renderiza a lista de artigos
  return (
    <div className="aurora-dark-bg min-h-screen p-6">
      <div className="aurora-particles fixed inset-0 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl aurora-text-gradient font-bold text-slate-50">
                Biblioteca de Artigos Científicos
              </h1>
              <p className="text-slate-400 aurora-body">
                Gerencie sua biblioteca de artigos científicos com extração automática de dados por IA
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="aurora-card p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={handleNewArticle} className="aurora-button flex items-center gap-2" size="lg">
                <Plus className="h-5 w-5" />
                <Sparkles className="h-4 w-4" />
                Novo Artigo Científico
              </Button>
              
              <ToggleGroup type="single" value={viewMode} onValueChange={value => value && setViewMode(value as "grid" | "list")} className="aurora-glass">
                <ToggleGroupItem value="grid" aria-label="Ver em grade" className="data-[state=on]:bg-aurora-electric-purple/20 data-[state=on]:text-aurora-electric-purple">
                  <Grid2x2 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="Ver em lista" className="data-[state=on]:bg-aurora-electric-purple/20 data-[state=on]:text-aurora-electric-purple">
                  <LayoutList className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={`aurora-glass border-aurora-electric-purple/30 ${showFilters ? 'bg-aurora-electric-purple/20 text-aurora-electric-purple' : ''}`}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative w-full lg:w-auto lg:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-aurora-electric-purple h-4 w-4" />
              <Input placeholder="Buscar por título, autores ou palavras-chave..." className="pl-10 aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-6 p-4 aurora-glass rounded-lg border border-aurora-electric-purple/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filterEquipment" className="aurora-heading">Equipamento Estudado</Label>
                  <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                    <SelectTrigger className="w-full mt-1 aurora-glass border-aurora-electric-purple/30">
                      <SelectValue placeholder="Filtrar por equipamento estudado" />
                    </SelectTrigger>
                    <SelectContent className="aurora-glass border-aurora-electric-purple/30">
                      <SelectItem value="all">Todos os equipamentos</SelectItem>
                      {equipmentOptions.map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        {isLoading ? (
          <div className="aurora-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <AuroraLoadingSkeleton lines={4} height="md" />
                </div>
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="aurora-card p-12">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto aurora-glass rounded-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-aurora-electric-purple aurora-floating" />
              </div>
              <div>
                <h3 className="text-2xl font-medium aurora-heading mb-2">
                  Nenhum artigo científico encontrado
                </h3>
                <p className="text-slate-400 aurora-body mb-6">
                  Comece criando sua biblioteca científica adicionando seu primeiro artigo
                </p>
                <Button onClick={handleNewArticle} className="aurora-button">
                  <Plus className="h-4 w-4 mr-2" />
                  <Sparkles className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Artigo Científico
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="aurora-card p-6">
            <ArticleList 
              articles={articles} 
              onDelete={handleDeleteArticle} 
              onUpdate={handleEditArticle} 
              viewMode={viewMode} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedScientificArticleManager;
