
import React, { useState } from 'react';
import { Upload, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoGrid from '@/components/video-storage/VideoGrid';
import BulkActionBar from '@/components/video-storage/BulkActionBar';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import VideoPlayer from '@/components/video-storage/VideoPlayer';
import VideoEditDialog from '@/components/video-storage/VideoEditDialog';
import { useVideoManager } from '@/hooks/useVideoManager';
import { Video } from '@/services/videoStorage/videoService';

const AdminVideoManager: React.FC = () => {
  const {
    videos,
    selectedVideos,
    loading,
    filters,
    equipments,
    handleSelectVideo,
    handleSelectAll,
    handleClearSelection,
    handleDeleteVideo,
    handleBulkDelete,
    handleBulkUpdateEquipment,
    handleBulkAddTags,
    handleFilterChange,
    loadVideos
  } = useVideoManager();

  const [showUploader, setShowUploader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Aplicar filtros
  const handleSearch = () => {
    handleFilterChange({
      ...filters,
      search: searchQuery,
      equipment: selectedEquipmentFilter || undefined
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

  const handleDownload = (video: Video) => {
    if (video.url_video) {
      window.open(video.url_video, '_blank');
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
            onClick={() => setShowUploader(true)}
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

          <Select value={selectedEquipmentFilter} onValueChange={setSelectedEquipmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os equipamentos</SelectItem>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Barra de ações em massa */}
      <BulkActionBar
        selectedCount={selectedVideos.length}
        equipments={equipments}
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
        onDelete={handleDeleteVideo}
        onPlay={handlePlay}
        onDownload={handleDownload}
        isLoading={loading}
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
