import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';
import VideoUploader from '@/components/video-storage/VideoUploader';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import { ROUTES } from '@/routes';

const VideoCreatePageAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('individual');

  const handleUploadComplete = () => {
    navigate(ROUTES.ADMIN_VIDEOS.ROOT);
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_VIDEOS.ROOT);
  };

  return (
    <ContentLayout
      title="Upload de Vídeos"
      subtitle="Sistema profissional de upload com processamento automático de thumbnails e metadados"
      actions={
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Vídeos
        </Button>
      }
    >
      <GlassContainer className="max-w-5xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="individual" 
              className="flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              Upload Individual
            </TabsTrigger>
            <TabsTrigger 
              value="batch" 
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Upload em Lote
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Individual</h3>
              <p className="text-muted-foreground">
                Sistema completo com IA para thumbnails, extração de metadados e formatação inteligente
              </p>
            </div>
            <VideoUploader />
          </TabsContent>
          
          <TabsContent value="batch" className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload em Lote</h3>
              <p className="text-muted-foreground">
                Processamento paralelo de múltiplos vídeos com monitoramento em tempo real
              </p>
            </div>
            <BatchVideoUploader 
              onUploadComplete={handleUploadComplete}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </GlassContainer>
    </ContentLayout>
  );
};

// Export explícito para evitar problemas de lazy loading
export { VideoCreatePageAdmin };
export default VideoCreatePageAdmin;