
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Loader2, Grid2x2, LayoutList, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const VideoContentManager: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterEquipment, setFilterEquipment] = useState<string>("all");
  const [equipmentOptions, setEquipmentOptions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get distinct equipments for the filter
  useEffect(() => {
    const fetchEquipmentOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('equipamento')
          .not('equipamento', 'is', null);
          
        if (error) throw error;
        
        // Extract and deduplicate equipment values
        const uniqueEquipments = [...new Set(data.map(item => item.equipamento).filter(Boolean))];
        setEquipmentOptions(uniqueEquipments);
      } catch (error) {
        console.error('Error fetching equipment options:', error);
      }
    };
    
    fetchEquipmentOptions();
  }, []);

  // Fetch videos
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('videos').select('*').order('data_upload', { ascending: false });

      // Apply type filter if selected
      if (filterType !== "all") {
        query = query.eq('tipo', filterType);
      }
      
      // Apply equipment filter if selected
      if (filterEquipment && filterEquipment !== "all") {
        query = query.eq('equipamento', filterEquipment);
      }

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar vídeos",
        description: "Não foi possível carregar a lista de vídeos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, filterType, filterEquipment]);

  const handleVideoAdded = () => {
    setIsDialogOpen(false);
    fetchVideos();
    toast({
      title: "Vídeo adicionado",
      description: "O vídeo foi adicionado com sucesso."
    });
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchVideos();
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: "Não foi possível excluir o vídeo."
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
            <Plus className="h-5 w-5" /> Novo Vídeo
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
            placeholder="Buscar vídeo..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <Label htmlFor="filterType">Tipo de Vídeo</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="video">Vídeos prontos</SelectItem>
                <SelectItem value="raw">Takes brutos</SelectItem>
                <SelectItem value="image">Imagens</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="filterEquipment">Equipamento</Label>
            <Select value={filterEquipment} onValueChange={setFilterEquipment}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Filtrar por equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os equipamentos</SelectItem>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment} value={equipment}>
                    {equipment}
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
      ) : videos.length === 0 ? (
        <div className="bg-muted py-12 rounded-lg flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">Nenhum vídeo encontrado</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Vídeo
          </Button>
        </div>
      ) : (
        <VideoList 
          videos={videos} 
          onDelete={handleDeleteVideo} 
          onUpdate={fetchVideos}
          viewMode={viewMode} 
        />
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Vídeo</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do vídeo para adicioná-lo à biblioteca de conteúdo.
            </DialogDescription>
          </DialogHeader>
          
          <VideoForm onSuccess={handleVideoAdded} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoContentManager;
