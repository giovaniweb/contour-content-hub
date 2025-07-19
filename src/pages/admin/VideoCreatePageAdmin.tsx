import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/layout/AdminLayout';
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
    <AdminLayout>
      <div className="aurora-dark-bg min-h-screen">
        <div className="aurora-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="aurora-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Vídeos
            </Button>
          </div>
          <div className="aurora-glass rounded-3xl p-8 backdrop-blur-2xl border border-aurora-electric-purple/20">
            <div className="mb-8">
              <h1 className="aurora-text-gradient text-3xl font-light mb-2">
                Upload de Vídeos
              </h1>
              <p className="aurora-body text-white/70">
                Sistema profissional de upload com processamento automático de thumbnails e metadados.
              </p>
            </div>

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
              
              <TabsContent value="individual">
                <VideoUploader />
              </TabsContent>
              
              <TabsContent value="batch">
                <BatchVideoUploader 
                  onUploadComplete={handleUploadComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Export explícito para evitar problemas de lazy loading
export { VideoCreatePageAdmin };
export default VideoCreatePageAdmin;