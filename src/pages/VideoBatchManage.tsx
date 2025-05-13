
import React from 'react';
import ContentLayout from '@/components/layout/ContentLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
// Import our components
import VideoSearch from '@/components/video-batch/VideoSearch';
import BatchActionBar from '@/components/video-batch/BatchActionBar';
import VideoList from '@/components/video-batch/VideoList';
import BatchEditDialog from '@/components/video-batch/BatchEditDialog';
import useBatchVideoManage from '@/hooks/useBatchVideoManage';

// Define EditableVideo type locally to resolve type conflicts
interface EditableVideo {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags: string[];
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
  metadata?: any;
}

const VideoBatchManage: React.FC = () => {
  const navigate = useNavigate();

  const {
    videos,
    loading,
    searchQuery,
    setSearchQuery,
    selectedVideos,
    setSelectedVideos,
    batchEquipmentId,
    setBatchEquipmentId,
    showBatchEditDialog,
    setShowBatchEditDialog,
    loadVideos,
    handleSelectAll,
    handleSelect,
    handleEdit,
    handleUpdate,
    handleSave,
    handleCancel,
    handleDelete,
    handleBatchDelete,
    handleBatchEquipmentUpdate,
    isAdmin,
    equipments
  } = useBatchVideoManage();

  if (loading) {
    return (
      <ContentLayout title="Gerenciamento em Lote" subtitle="Carregando...">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Carregando vídeos...</p>
        </div>
      </ContentLayout>
    );
  }
  
  return (
    <ContentLayout title="Gerenciamento em Lote" subtitle="Edite, exclua ou gerencie múltiplos vídeos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate(ROUTES.VIDEOS.ROOT)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
        
        {/* Search and filters */}
        <VideoSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={loadVideos}
        />
        
        {/* Batch actions */}
        <BatchActionBar 
          selectedCount={selectedVideos.length}
          onClearSelection={() => setSelectedVideos([])}
          onShowEditDialog={() => setShowBatchEditDialog(true)}
          onDelete={() => handleBatchDelete().catch(err => console.error(err))}
        />
        
        {/* Videos list */}
        <VideoList 
          videos={videos as any[]}
          selectedVideos={selectedVideos}
          equipments={equipments}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onSave={(videoId) => handleSave(videoId).catch(err => console.error(err))}
          onCancel={handleCancel}
          onDelete={(videoId) => handleDelete(videoId).catch(err => console.error(err))}
          onUpdateVideo={(index, updates) => {
            // Convert index to string if needed by the underlying implementation
            const id = typeof index === 'number' ? videos[index].id : index;
            handleUpdate(id, updates);
          }}
        />
        
        {videos.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-right">
            Total: {videos.length} vídeos
          </div>
        )}
        
        <BatchEditDialog 
          isOpen={showBatchEditDialog}
          onOpenChange={setShowBatchEditDialog}
          equipmentOptions={equipments}
          batchEquipmentId={batchEquipmentId}
          setBatchEquipmentId={setBatchEquipmentId}
          selectedCount={selectedVideos.length}
          onApply={() => handleBatchEquipmentUpdate().catch(err => console.error(err))}
        />
      </div>
    </ContentLayout>
  );
};

export default VideoBatchManage;
