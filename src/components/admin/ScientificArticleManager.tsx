
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, Book, Filter, Grid2x2, LayoutList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ScientificArticleForm from "./ScientificArticleForm";
import ScientificArticleList from "./ScientificArticleList";
import { ScrollArea } from "@/components/ui/scroll-area";

const ScientificArticleManager: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState<{id: string, nome: string}[]>([]);
  const [topicOptions, setTopicOptions] = useState<string[]>([]);

  // Get equipments for filters
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');
          
        if (error) throw error;
        
        setEquipmentOptions(data || []);
      } catch (error) {
        console.error('Error fetching equipments:', error);
      }
    };

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
    
    fetchEquipments();
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
      toast({
        variant: "destructive",
        title: "Erro ao buscar artigos científicos",
        description: "Não foi possível carregar a lista de artigos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, filterEquipment]);

  const handleArticleAdded = async (articleData: any) => {
    setIsDialogOpen(false);
    
    // After article is added, automatically extract content
    if (articleData?.id) {
      try {
        toast({
          title: "Processando documento",
          description: "Extraindo conteúdo do documento..."
        });
        
        const { error } = await supabase.functions.invoke('process-document', {
          body: { documentId: articleData.id }
        });
        
        if (error) {
          console.error('Error processing document:', error);
          toast({
            variant: "destructive",
            title: "Erro ao processar documento",
            description: "Não foi possível extrair o conteúdo do documento."
          });
        } else {
          toast({
            title: "Documento processado",
            description: "O conteúdo do documento foi extraído com sucesso."
          });
        }
      } catch (err) {
        console.error('Error processing document:', err);
      }
    }
    
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
      toast({
        title: "Artigo científico excluído",
        description: "O artigo científico foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir artigo científico",
        description: "Não foi possível excluir o artigo científico."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsDialogOpen(true)}
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
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Artigo Científico
          </Button>
        </div>
      ) : (
        <ScientificArticleList 
          articles={articles} 
          onDelete={handleDeleteArticle} 
          onUpdate={fetchArticles}
          viewMode={viewMode}
        />
      )}
      
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          // Only close if open is false (user is closing dialog)
          if (!open) {
            setIsDialogOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Artigo Científico</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do artigo científico para adicioná-lo à biblioteca de conteúdo.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <ScientificArticleForm 
              onSuccess={handleArticleAdded} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScientificArticleManager;
