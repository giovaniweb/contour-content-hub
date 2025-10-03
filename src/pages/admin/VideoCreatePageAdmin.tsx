import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoUploader from '@/components/video-storage/VideoUploader';
import BatchVideoUploader from '@/components/video-storage/BatchVideoUploader';
import { ROUTES } from '@/routes';

const VideoCreatePageAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('individual');

  const handleUploadComplete = () => {
    navigate(ROUTES.ADMIN.VIDEOS.ROOT);
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN.VIDEOS.ROOT);
  };

  return (
    <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Header */}
        <Card className="aurora-glass-enhanced border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl mb-2">Upload de Vídeos</CardTitle>
                <p className="text-slate-300">Sistema profissional de upload com processamento automático</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="aurora-button-enhanced border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Vídeos
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Card className="aurora-glass-enhanced border-cyan-500/30">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 aurora-glass border-slate-600">
                <TabsTrigger 
                  value="individual" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-cyan-600/30"
                >
                  <Upload className="h-5 w-5" />
                  Upload Individual
                </TabsTrigger>
                <TabsTrigger 
                  value="batch" 
                  className="flex items-center gap-2 text-white data-[state=active]:bg-cyan-600/30"
                >
                  <Users className="h-5 w-5" />
                  Upload em Lote
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual" className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600/30 rounded-full mb-4">
                    <Upload className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Upload Individual</h3>
                  <p className="text-slate-300">
                    Sistema completo com IA para thumbnails, extração de metadados e formatação inteligente
                  </p>
                </div>
                <VideoUploader />
              </TabsContent>
              
              <TabsContent value="batch" className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/30 rounded-full mb-4">
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Upload em Lote</h3>
                  <p className="text-slate-300">
                    Processamento paralelo de múltiplos vídeos com monitoramento em tempo real
                  </p>
                </div>
                <BatchVideoUploader 
                  onUploadComplete={handleUploadComplete}
                  onCancel={handleCancel}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Export explícito para evitar problemas de lazy loading
export { VideoCreatePageAdmin };
export default VideoCreatePageAdmin;