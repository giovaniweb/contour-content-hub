
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import VideoList from '@/components/video-storage/VideoList';
import VideoUploader from '@/components/video-storage/VideoUploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const VideoStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('equipment');

  // Open upload dialog automatically if equipment parameter is present in URL
  useEffect(() => {
    if (equipmentId && isAdmin()) {
      setShowUploadDialog(true);
    }
  }, [equipmentId, isAdmin]);

  const handleUploadClick = () => {
    if (isAdmin()) {
      setShowUploadDialog(true);
    } else {
      toast({
        title: "Acesso restrito",
        description: "Apenas administradores podem fazer upload de vídeos.",
        variant: "destructive"
      });
    }
  };

  const handleUploadComplete = (videoId: string) => {
    setShowUploadDialog(false);
    // Muda para a aba "Meus Vídeos" após o upload
    setActiveTab('mine');
    
    toast({
      title: "Upload concluído com sucesso",
      description: "Seu vídeo foi enviado e está sendo processado.",
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
          
          {/* Botão de upload agora verifica se o usuário é admin */}
          <Button 
            onClick={handleUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Enviar Vídeo
          </Button>
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
          <DialogContent className="sm:max-w-lg">
            <VideoUploader
              onUploadComplete={handleUploadComplete}
              onCancel={() => setShowUploadDialog(false)}
              equipmentId={equipmentId || undefined}
            />
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default VideoStorage;
