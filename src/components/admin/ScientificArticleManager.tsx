import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, Book, Filter, Grid2x2, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ScientificArticleList from "./ScientificArticleList";
import ScientificArticleDialog from "./ScientificArticleDialog";
import { useEquipments } from "@/hooks/useEquipments";

const ScientificArticleManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { equipments: equipmentOptions, loading: equipmentsLoading } = useEquipments();
  const [topicOptions, setTopicOptions] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  
  // Get topics for filters
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from('documentos_tecnicos')
          .select('descricao') // Changed from 'topic' to 'descricao' as a potential topic field
          .eq('tipo', 'artigo_cientifico')
          .order('descricao');
          
        if (error) throw error;
        
        // Extract and deduplicate topics from description field (or another appropriate field)
        const topics = [...new Set(data
          .map(item => item.descricao)
          .filter(Boolean)
          .map(desc => typeof desc === 'string' ? desc.split(' ')[0] : '') // Just as an example to extract topics
          .filter(t => t.length > 0)
        )];
        
        setTopicOptions(topics.length > 0 ? topics : ['General']); // Default to 'General' if no topics found
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    
    fetchTopics();
  }, []);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('documentos_tecnicos')
        .select(`
          *,
          equipamentos(nome)
        `)
        .eq('tipo', 'artigo_cientifico')
        .eq('status', 'ativo')
        .order('data_criacao', { ascending: false });

      // Apply equipment filter if selected
      if (filterEquipment && filterEquipment !== "all") {
        query = query.eq('equipamento_id', filterEquipment);
      }

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log("Fetched articles:", data);
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error("Não foi possível carregar a lista de artigos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, filterEquipment]);

  const handleArticleAdded = (articleData: any) => {
    fetchArticles();
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documentos_tecnicos')
        .update({ status: 'inativo' })
        .eq('id', id);
        
      if (error) throw error;
      
      fetchArticles();
      toast.success("O artigo científico foi excluído com sucesso.");
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error("Não foi possível excluir o artigo científico.");
    }
  };

  // Handler for opening the dialog with a clean state for a new article
  const handleOpenNewArticleDialog = () => {
    setSelectedArticle(null);
    setIsDialogOpen(true);
  };

  // Handler for opening the dialog to edit an existing article
  const handleOpenEditArticleDialog = (article: any) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleOpenNewArticleDialog}
            variant="default"
            size="lg"
            className="flex gap-2"
          >
            <Plus className="h-5 w-5" /> Novo Artigo Científico
          </Button>
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Ver em grid">
              <Grid2x2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Ver em lista">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar artigo científico..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <Label htmlFor="filterEquipment">Equipamento</Label>
            <Select value={filterEquipment} onValueChange={setFilterEquipment}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Filtrar por equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os equipamentos</SelectItem>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-muted py-12 rounded-lg flex flex-col items-center justify-center">
          <Book className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum artigo científico encontrado</p>
          <Button onClick={handleOpenNewArticleDialog}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Artigo Científico
          </Button>
        </div>
      ) : (
        <ScientificArticleList 
          articles={articles} 
          onDelete={handleDeleteArticle} 
          onUpdate={(article) => handleOpenEditArticleDialog(article)}
          viewMode={viewMode}
        />
      )}
      
      {/* Use the new ScientificArticleDialog component */}
      <ScientificArticleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleArticleAdded}
        articleData={selectedArticle}
      />
    </div>
  );
};

export default ScientificArticleManager;
