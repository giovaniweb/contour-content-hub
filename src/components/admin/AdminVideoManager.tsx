
import React, { useState } from 'react';
import { Upload, Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import VideoGrid from '@/components/video-storage/VideoGrid';
import BulkActionBar from '@/components/video-storage/BulkActionBar';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import VideoPlayer from '@/components/video-storage/VideoPlayer';
import VideoEditDialog from '@/components/video-storage/VideoEditDialog';
import { Pagination } from '@/components/ui/pagination';
import { useVideoManager } from '@/hooks/useVideoManager';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/services/videoStorage/videoService';

// Utility function to filter valid equipments
const filterValidEquipments = (equipments: any[]) => {
  return equipments.filter(equipment => 
    equipment && 
    equipment.id && 
    equipment.id.trim() !== "" && 
    equipment.nome && 
    equipment.nome.trim() !== ""
  );
};

const AdminVideoManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    videos,
    selectedVideos,
    loading,
    filters,
    page,
    total,
    equipments,
    handleSelectVideo,
    handleSelectAll,
    handleClearSelection,
    handleDeleteVideo,
    handleBulkDelete,
    handleBulkUpdateEquipment,
    handleBulkAddTags,
    handleFilterChange,
    setPage,
    loadVideos
  } = useVideoManager();

  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter valid equipments - this is the main fix for the Select.Item error
  const validEquipments = filterValidEquipments(equipments);

  // Apply filters
  const handleSearch = () => {
    handleFilterChange({
      ...filters,
      search: searchQuery,
      equipment: selectedEquipmentFilter ? [selectedEquipmentFilter] : undefined
    });
  };

  const handlePlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsEditDialogOpen(true);
  };

  // Fixed: Now properly accepts only videoId string and calls the hook function
  const handleDelete = async (videoId: string) => {
    console.log('[AdminVideoManager] handleDelete chamado com videoId:', videoId);
    try {
      await handleDeleteVideo(videoId);
      console.log('[AdminVideoManager] handleDeleteVideo completado com sucesso');
    } catch (error) {
      console.error('[AdminVideoManager] Erro em handleDelete:', error);
    }
  };

  const handleDownload = async (video: Video) => {
    if (video.url_video) {
      // Incrementar contador de downloads diretamente
      try {
        const { error } = await supabase
          .from('videos')
          .update({ downloads_count: (video.downloads_count || 0) + 1 })
          .eq('id', video.id);
        
        if (error) {
          console.error('Erro ao incrementar downloads:', error);
        } else {
          loadVideos(); // Recarregar para atualizar o contador
        }
      } catch (error) {
        console.error('Erro ao incrementar downloads:', error);
      }
      
      // Abrir URL para download
      window.open(video.url_video, '_blank');
      
      toast({
        title: 'Download iniciado',
        description: 'O download do vídeo foi iniciado.'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'URL do vídeo não disponível para download.'
      });
    }
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    loadVideos();
  };

  if (showUploader) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-50">Upload em Massa de Vídeos</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowUploader(false)}
          >
            Voltar para Lista
          </Button>
        </div>
        
        <BatchVideoUploader 
          onUploadComplete={handleUploadComplete}
          onCancel={() => setShowUploader(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/admin/videos/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Vídeo
          </Button>
          <Button 
            onClick={() => setShowUploader(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload em Massa
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar vídeos..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Select value={selectedEquipmentFilter} onValueChange={(value) => {
            setSelectedEquipmentFilter(value);
            handleFilterChange({
              ...filters,
              search: searchQuery,
              equipment: value === 'all' ? undefined : [value]
            });
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os equipamentos</SelectItem>
              {validEquipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-400">{total}</div>
            <div className="text-sm text-slate-400">Total de Vídeos</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{videos.length}</div>
            <div className="text-sm text-slate-400">Vídeos Filtrados</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{validEquipments.length}</div>
            <div className="text-sm text-slate-400">Equipamentos</div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de ações em massa - now passing validEquipments */}
      <BulkActionBar
        selectedCount={selectedVideos.length}
        equipments={validEquipments}
        onClearSelection={handleClearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkUpdateEquipment={handleBulkUpdateEquipment}
        onBulkAddTags={handleBulkAddTags}
      />

      {/* Grid de vídeos */}
      <VideoGrid
        videos={videos}
        selectedVideos={selectedVideos}
        onSelectVideo={handleSelectVideo}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete} // Now properly passes videoId string
        onPlay={handlePlay}
        onDownload={handleDownload}
        isLoading={loading}
      />

      {/* Paginação */}
      <Pagination
        totalItems={total}
        itemsPerPage={20}
        currentPage={page}
        onPageChange={setPage}
      />

      {/* Player de vídeo */}
      {selectedVideo && (
        <VideoPlayer
          open={isPlayerOpen}
          onOpenChange={setIsPlayerOpen}
          video={selectedVideo}
        />
      )}

      {/* Dialog de edição */}
      {selectedVideo && (
        <VideoEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          video={selectedVideo}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={() => {
            setIsEditDialogOpen(false);
            loadVideos();
          }}
        />
      )}
    </div>
  );
};

export default AdminVideoManager;
