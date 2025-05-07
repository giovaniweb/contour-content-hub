
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import VideoList from '@/components/video-storage/VideoList';
import VideoUploader from '@/components/video-storage/VideoUploader';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Plus, Upload, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const VideoStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Added useNavigate hook
  const equipmentId = searchParams.get('equipment');

  // Open upload dialog automatically if equipment parameter is present in URL
  useEffect(() => {
    if (equipmentId && isAdmin()) {
      setShowUploadDialog(true);
      setUploadMode('single'); // Default to single mode when coming from equipment page
    }
  }, [equipmentId, isAdmin]);

  const handleUploadClick = () => {
    if (isAdmin()) {
      setShowUploadDialog(true);
      setUploadMode('single');
    } else {
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem fazer upload de vídeos.",
        variant: "destructive"
      });
    }
  };
  
  const handleBatchUploadClick = () => {
    if (isAdmin()) {
      setShowUploadDialog(true);
      setUploadMode('batch');
    } else {
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem fazer upload de vídeos.",
        variant: "destructive"
      });
    }
  };

  const handleUploadComplete = (videoId?: string) => {
    setShowUploadDialog(false);
    // Muda para a aba "Meus Vídeos" após o upload
    setActiveTab('mine');
    
    toast({
      title: "Upload concluído com sucesso",
      description: uploadMode === 'batch' 
        ? "Os vídeos foram enviados e estão sendo processados." 
        : "Seu vídeo foi enviado e está sendo processado.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Video className="h-6 w-6" />
              Biblioteca de Vídeos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus vídeos em um só lugar
            </p>
          </div>
          
          {isAdmin() && (
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleUploadClick}
                className="flex items-center gap-2"
                variant="default"
              >
                <Upload className="h-4 w-4" />
                Enviar Vídeo
              </Button>
              
              <Button 
                onClick={handleBatchUploadClick}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Upload className="h-4 w-4" />
                Upload em Lote
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/videos/batch-manage')}
              >
                <Pencil className="h-4 w-4" />
                Gerenciar em Lote
              </Button>
            </div>
          )}
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Todos os Vídeos</TabsTrigger>
              <TabsTrigger value="mine">Meus Vídeos</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <VideoList
              emptyStateMessage="Nenhum vídeo disponível. Entre em contato com um administrador para adicionar vídeos."
            />
          </TabsContent>
          
          <TabsContent value="mine" className="space-y-4">
            <VideoList
              onlyMine
              emptyStateMessage={
                <div className="text-center space-y-3 py-8">
                  <p className="text-muted-foreground">
                    {isAdmin() 
                      ? "Você ainda não enviou nenhum vídeo" 
                      : "Você não possui vídeos. Apenas administradores podem fazer upload de vídeos."}
                  </p>
                  {isAdmin() && (
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Enviar seu primeiro vídeo
                    </Button>
                  )}
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog de upload só é mostrado para administradores */}
      {isAdmin() && (
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className={uploadMode === 'batch' ? "sm:max-w-3xl" : "sm:max-w-lg"}>
            {uploadMode === 'single' ? (
              <VideoUploader
                onUploadComplete={handleUploadComplete}
                onCancel={() => setShowUploadDialog(false)}
                equipmentId={equipmentId || undefined}
              />
            ) : (
              <BatchVideoUploader
                onUploadComplete={handleUploadComplete}
                onCancel={() => setShowUploadDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default VideoStorage;
