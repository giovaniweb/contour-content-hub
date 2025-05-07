
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Filter, Search, VideoIcon, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEquipments } from "@/hooks/useEquipments";

interface VimeoVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number;
  upload_date: string;
  video_url: string;
}

interface PaginationData {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const VideoBatchImport: React.FC = () => {
  // Estado para os vídeos e seleção
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  });
  
  // Campos para filtros
  const [folderPath, setFolderPath] = useState<string>("demo");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("todos");
  
  // Estado para o equipamento selecionado
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const { equipments, loading: loadingEquipments } = useEquipments();

  // Carregar vídeos do Vimeo
  const fetchVimeoVideos = async (page: number = 1) => {
    try {
      setIsLoading(true);
      
      // Chamar a edge function para buscar vídeos
      const { data, error } = await supabase.functions.invoke('vimeo-batch-import', {
        body: {
          folderPath: folderPath,
          limit: pagination.per_page,
          page: page
        }
      });

      if (error) throw error;
      
      if (data.success) {
        setVideos(data.data.videos);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || "Erro ao buscar vídeos");
      }
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      toast.error("Não foi possível carregar os vídeos", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar vídeos ao montar o componente
  useEffect(() => {
    fetchVimeoVideos();
  }, []);

  // Filtrar vídeos com base nos critérios
  const filteredVideos = videos.filter(video => {
    // Filtrar por busca
    const matchesSearch = searchTerm.trim() === "" || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por tipo
    let matchesTab = true;
    if (activeTab === "selecionados") {
      matchesTab = !!selectedVideos[video.id];
    } else if (activeTab === "nao_selecionados") {
      matchesTab = !selectedVideos[video.id];
    }
    
    return matchesSearch && matchesTab;
  });

  // Funções para seleção de vídeos
  const handleSelectAll = () => {
    const allSelected = filteredVideos.every(video => selectedVideos[video.id]);
    
    const updatedSelection = { ...selectedVideos };
    filteredVideos.forEach(video => {
      updatedSelection[video.id] = !allSelected;
    });
    
    setSelectedVideos(updatedSelection);
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Importar vídeos selecionados
  const importSelectedVideos = async () => {
    const selectedVideoIds = Object.entries(selectedVideos)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
      
    if (selectedVideoIds.length === 0) {
      toast.warning("Selecione pelo menos um vídeo para importar");
      return;
    }
    
    if (!selectedEquipmentId) {
      toast.warning("Selecione um equipamento para associar aos vídeos");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Buscar informações detalhadas apenas dos vídeos selecionados
      const selectedVids = videos.filter(v => selectedVideos[v.id]);
      
      // Importar cada vídeo selecionado
      let successCount = 0;
      let errorCount = 0;
      
      for (const video of selectedVids) {
        try {
          // Preparar dados para inserção
          const videoData = {
            titulo: video.title,
            descricao_curta: video.description?.substring(0, 150) || '',
            descricao_detalhada: video.description || '',
            url_video: video.video_url,
            preview_url: video.thumbnail_url,
            duracao: formatDuration(video.duration),
            equipamentos: [selectedEquipmentId],
            tipo_video: 'video_pronto',
            data_upload: new Date().toISOString(),
            tags: extractTags(video.title + ' ' + video.description)
          };
          
          // Inserir no banco de dados
          const { error } = await supabase
            .from('videos')
            .insert(videoData);
            
          if (error) throw error;
          
          successCount++;
        } catch (err) {
          console.error(`Erro ao importar vídeo ${video.id}:`, err);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} vídeos importados com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`Falha ao importar ${errorCount} vídeos`);
      }
      
      // Limpar seleções após importação
      setSelectedVideos({});
      
    } catch (error) {
      console.error("Erro durante a importação:", error);
      toast.error("Erro ao importar vídeos", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para formatar duração em minutos:segundos
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Função para extrair tags do título e descrição
  const extractTags = (text: string): string[] => {
    // Exemplo simples - extrair palavras relevantes
    const words = text.toLowerCase().split(/\s+/);
    const relevantWords = words.filter(w => 
      w.length > 3 && !['para', 'como', 'este', 'essa', 'isso', 'aqui', 'onde', 'quando'].includes(w)
    );
    
    // Pegar até 5 tags relevantes
    return [...new Set(relevantWords)].slice(0, 5);
  };

  // Funções para paginação
  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.total_pages) return;
    fetchVimeoVideos(page);
  };

  return (
    <Layout title="Importação de Vídeos em Lote">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vídeos do Vimeo</h1>
            <p className="text-muted-foreground">
              Selecione vídeos para importar para a biblioteca de conteúdo
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecione Equipamento" />
              </SelectTrigger>
              <SelectContent>
                {loadingEquipments ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  equipments.map(equip => (
                    <SelectItem key={equip.id} value={equip.id}>
                      {equip.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={importSelectedVideos} 
              disabled={!selectedEquipmentId || Object.values(selectedVideos).filter(Boolean).length === 0 || isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Importar Selecionados ({Object.values(selectedVideos).filter(Boolean).length})
            </Button>
          </div>
        </div>
        
        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={folderPath} onValueChange={(val) => {
              setFolderPath(val);
              fetchVimeoVideos(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="clinica">Clínica</SelectItem>
                <SelectItem value="procedimentos">Procedimentos</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => fetchVimeoVideos(pagination.page)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Tabs para filtros */}
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos os Vídeos</TabsTrigger>
            <TabsTrigger value="selecionados">Selecionados</TabsTrigger>
            <TabsTrigger value="nao_selecionados">Não Selecionados</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="m-0">
            {/* Cabeçalho com seleção */}
            <div className="flex justify-between items-center mb-4 p-2 border-b">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={filteredVideos.length > 0 && filteredVideos.every(video => selectedVideos[video.id])}
                  onCheckedChange={handleSelectAll}
                />
                <span>Selecionar Todos ({filteredVideos.length})</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {Object.values(selectedVideos).filter(Boolean).length} vídeos selecionados
              </div>
            </div>
            
            {/* Grid de vídeos */}
            {isLoading && videos.length === 0 ? (
              <div className="py-12 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhum vídeo encontrado</h3>
                <p className="text-muted-foreground">
                  Ajuste os critérios de busca ou escolha outra pasta.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className={`overflow-hidden ${selectedVideos[video.id] ? 'ring-2 ring-primary' : ''}`}>
                    <div className="relative">
                      <div className="aspect-video overflow-hidden bg-muted">
                        {video.thumbnail_url ? (
                          <img 
                            src={video.thumbnail_url} 
                            alt={video.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <VideoIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant={selectedVideos[video.id] ? "default" : "secondary"} 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => toggleVideoSelection(video.id)}
                        >
                          {selectedVideos[video.id] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <h3 className="font-medium line-clamp-1">{video.title}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(video.duration)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {video.upload_date}
                        </span>
                      </div>
                      {video.description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Paginação */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center mx-2">
                    <span>
                      Página {pagination.page} de {pagination.total_pages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VideoBatchImport;
