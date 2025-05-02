
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Loader2, FileText, Image, Box, Grid2x2, LayoutList, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MaterialForm from "./MaterialForm";
import MaterialList from "./MaterialList";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MaterialContentManager: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('materiais').select('*').order('data_upload', { ascending: false });

      // Apply type filter if selected
      if (filterType !== "all") {
        query = query.eq('tipo', filterType);
      }
      
      // Apply category filter if selected
      if (filterCategory && filterCategory !== "all") {
        query = query.eq('categoria', filterCategory);
      }

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`nome.ilike.%${searchQuery}%,categoria.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar materiais",
        description: "Não foi possível carregar a lista de materiais."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get categories for filter
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('materiais')
          .select('categoria')
          .not('categoria', 'is', null);
          
        if (error) throw error;
        
        // Extract and deduplicate category values
        const uniqueCategories = [...new Set(data.map(item => item.categoria).filter(Boolean))];
        setCategoryOptions(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [searchQuery, filterType, filterCategory]);

  const handleMaterialAdded = () => {
    setIsDialogOpen(false);
    fetchMaterials();
    toast({
      title: "Material adicionado",
      description: "O material foi adicionado com sucesso."
    });
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materiais')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchMaterials();
      toast({
        title: "Material excluído",
        description: "O material foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir material",
        description: "Não foi possível excluir o material."
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
            <Plus className="h-5 w-5" /> Novo Material
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
            placeholder="Buscar material..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <Label htmlFor="filterType">Tipo de Material</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="PSD">PSD</SelectItem>
                <SelectItem value="Logomarca">Logomarca</SelectItem>
                <SelectItem value="Imagem">Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filterCategory">Categoria</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
      ) : materials.length === 0 ? (
        <div className="bg-muted py-12 rounded-lg flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">Nenhum material encontrado</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Material
          </Button>
        </div>
      ) : (
        <MaterialList 
          materials={materials} 
          onDelete={handleDeleteMaterial} 
          onUpdate={fetchMaterials}
          viewMode={viewMode}
        />
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Material</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do material para adicioná-lo à biblioteca de conteúdo.
            </DialogDescription>
          </DialogHeader>
          
          <MaterialForm onSuccess={handleMaterialAdded} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialContentManager;
