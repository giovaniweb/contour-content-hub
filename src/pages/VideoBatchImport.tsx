
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pagination } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useEquipments } from '@/hooks/useEquipments';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Search, 
  RefreshCw, 
  Settings, 
  CheckCircle2, 
  FileVideo, 
  FolderInput,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getVimeoConfig } from '@/services/integrationService';

interface VimeoVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: number;
  upload_date: string;
  video_url: string;
}

interface VimeoBatchResponse {
  success: boolean;
  data?: {
    videos: VimeoVideo[];
    pagination: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
  error?: string;
}

const VideoBatchImport: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { equipments } = useEquipments();
  const [isLoading, setIsLoading] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [importing, setImporting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  // Verificar se a integração com o Vimeo está configurada
  useEffect(() => {
    const checkVimeoConfig = async () => {
      try {
        const config = await getVimeoConfig();
        setIsConfigured(!!config?.access_token);
      } catch (error) {
        console.error("Erro ao verificar configuração do Vimeo:", error);
      }
    };
    
    checkVimeoConfig();
  }, []);

  // Atualizar o equipamento selecionado
  useEffect(() => {
    if (selectedEquipmentId && equipments.length > 0) {
      const equipment = equipments.find(eq => eq.id === selectedEquipmentId);
      setSelectedEquipment(equipment || null);
    } else {
      setSelectedEquipment(null);
    }
  }, [selectedEquipmentId, equipments]);

  const fetchVideos = async (page = 1) => {
    try {
      setIsLoading(true);
      setVideos([]);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/vimeo-batch-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          folderPath: folderPath || undefined,
          page,
          limit: 12
        })
      });
      
      const result: VimeoBatchResponse = await response.json();
      
      if (result.success && result.data) {
        setVideos(result.data.videos);
        setTotalPages(result.data.pagination.total_pages);
        setTotalVideos(result.data.pagination.total);
        setCurrentPage(result.data.pagination.page);
      } else {
        throw new Error(result.error || 'Falha ao buscar vídeos');
      }
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar vídeos",
        description: error instanceof Error ? error.message : 'Não foi possível carregar os vídeos do Vimeo'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVideos(page);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleImportVideos = async () => {
    if (!selectedEquipmentId) {
      toast({
        variant: "destructive",
        title: "Equipamento não selecionado",
        description: "Selecione um equipamento para associar aos vídeos"
      });
      return;
    }

    if (selectedVideos.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum vídeo selecionado",
        description: "Selecione pelo menos um vídeo para importar"
      });
      return;
    }

    try {
      setImporting(true);
      
      // Filtrar apenas os vídeos selecionados
      const videosToImport = videos.filter(video => selectedVideos.includes(video.id));
      
      // Criar registros para cada vídeo
      const importPromises = videosToImport.map(async (video) => {
        const videoData = {
          titulo: video.title,
          descricao_curta: video.description,
          url_video: video.video_url,
          preview_url: video.thumbnail_url,
          duracao: formatDuration(video.duration),
          equipamentos: [selectedEquipmentId],
          tipo_video: 'video_pronto',
          data_upload: new Date().toISOString(),
          vimeo_id: video.id
        };
        
        const { data, error } = await supabase
          .from('videos')
          .insert([videoData]);
          
        if (error) throw error;
        return data;
      });
      
      await Promise.all(importPromises);
      
      setImportSuccess(true);
      toast({
        title: "Vídeos importados com sucesso",
        description: `${selectedVideos.length} vídeos foram importados para ${selectedEquipment?.nome}`
      });
      
      // Limpar seleção
      setSelectedVideos([]);
    } catch (error) {
      console.error("Erro ao importar vídeos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao importar vídeos",
        description: "Não foi possível importar os vídeos selecionados"
      });
    } finally {
      setImporting(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    return (
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Se a importação foi bem-sucedida, mostrar tela de sucesso
  if (importSuccess) {
    return (
      <Layout>
        <div className="container py-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Importação concluída com sucesso!</CardTitle>
              <CardDescription>
                {selectedVideos.length} vídeos foram importados e associados ao equipamento {selectedEquipment?.nome}.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Os vídeos estão agora disponíveis na biblioteca de conteúdo e na página do equipamento.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to={`/equipment/${selectedEquipmentId}`}>
                  Ver página do equipamento
                </Link>
              </Button>
              <Button onClick={() => {
                setImportSuccess(false);
                setSelectedVideos([]);
                fetchVideos(1);
              }}>
                Importar mais vídeos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  // Se não estiver configurado, mostrar mensagem de configuração
  if (!isConfigured) {
    return (
      <Layout>
        <div className="container py-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Configuração do Vimeo Necessária</CardTitle>
              <CardDescription>
                Você precisa configurar a integração com o Vimeo antes de importar vídeos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertTitle>Configuração necessária</AlertTitle>
                <AlertDescription>
                  Para importar vídeos do Vimeo, você precisa configurar um token de acesso da API.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/admin/vimeo-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar integração com Vimeo
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Importação de Vídeos do Vimeo</h1>
            <p className="text-muted-foreground">
              Importe vídeos diretamente da sua conta Vimeo para o sistema.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin/vimeo-settings">
              <Settings className="mr-2 h-4 w-4" />
              Configurações do Vimeo
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="folder-path">ID da Pasta no Vimeo (opcional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="folder-path"
                    placeholder="Ex: 12345678"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FolderInput className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ID da pasta no Vimeo. Deixe em branco para listar todos os vídeos.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar vídeos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => fetchVideos(1)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Carregando...</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" /> Buscar Vídeos</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Buscando vídeos no Vimeo...</p>
            </div>
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Checkbox 
                  id="select-all" 
                  checked={selectedVideos.length === videos.length && videos.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="ml-2 text-sm">
                  Selecionar todos
                </label>
                {selectedVideos.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {selectedVideos.length} selecionados
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {totalVideos} vídeos encontrados
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredVideos.map((video) => (
                <div key={video.id} className={`border rounded-lg overflow-hidden ${selectedVideos.includes(video.id) ? 'ring-2 ring-primary' : ''}`}>
                  <div className="relative aspect-video bg-muted">
                    {video.thumbnail_url ? (
                      <img 
                        src={video.thumbnail_url} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileVideo className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Checkbox 
                        checked={selectedVideos.includes(video.id)}
                        onCheckedChange={() => handleSelectVideo(video.id)}
                        className="h-5 w-5 bg-white/90 border-0"
                      />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate" title={video.title}>{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {video.description || "Sem descrição"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
              />
              
              <Button 
                className="mt-4 sm:mt-0"
                onClick={handleImportVideos} 
                disabled={selectedVideos.length === 0 || !selectedEquipmentId || importing}
              >
                {importing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importando...</>
                ) : (
                  <><Download className="h-4 w-4 mr-2" /> Importar {selectedVideos.length} vídeos</>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-muted py-12 rounded-lg flex flex-col items-center justify-center">
            <FileVideo className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum vídeo encontrado</p>
            <Button onClick={() => fetchVideos(1)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Buscar vídeos
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoBatchImport;
