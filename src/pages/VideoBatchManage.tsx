
import React from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Fix the import to use default import
import useBatchVideoManage from '@/hooks/useBatchVideoManage';

// Import our components
import VideoSearch from '@/components/video-batch/VideoSearch';
import BatchActionBar from '@/components/video-batch/BatchActionBar';
import VideoList from '@/components/video-batch/VideoList';
import BatchEditDialog from '@/components/video-batch/BatchEditDialog';

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
  const { toast } = useToast();
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

  // Check for admin permissions
  React.useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Acesso Restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive"
      });
      navigate('/videos');
    }
  }, [isAdmin, navigate, toast]);

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento em Lote</h1>
            <Button variant="outline" onClick={() => navigate('/videos')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Carregando vídeos...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento em Lote</h1>
          <Button variant="outline" onClick={() => navigate('/videos')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Vídeos</CardTitle>
            <CardDescription>Edite, exclua ou gerencie múltiplos vídeos</CardDescription>
          </CardHeader>
          <CardContent>
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
              onDelete={handleBatchDelete}
            />
            
            {/* Videos list */}
            <VideoList 
              videos={videos as any[]}
              selectedVideos={selectedVideos}
              equipments={equipments}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onUpdateVideo={handleUpdate}
            />
            
            {videos.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-right">
                Total: {videos.length} vídeos
              </div>
            )}
          </CardContent>
        </Card>
        
        <BatchEditDialog 
          isOpen={showBatchEditDialog}
          onOpenChange={setShowBatchEditDialog}
          equipmentOptions={equipments}
          batchEquipmentId={batchEquipmentId}
          setBatchEquipmentId={setBatchEquipmentId}
          selectedCount={selectedVideos.length}
          onApply={handleBatchEquipmentUpdate}
        />
      </div>
    </Layout>
  );
};

export default VideoBatchManage;
