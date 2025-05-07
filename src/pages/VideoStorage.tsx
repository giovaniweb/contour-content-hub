
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

const VideoStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

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
          
          <Button 
            onClick={() => setShowUploadDialog(true)}
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
              emptyStateMessage="Nenhum vídeo disponível. Seja o primeiro a enviar um vídeo!"
            />
          </TabsContent>
          
          <TabsContent value="mine" className="space-y-4">
            <VideoList
              onlyMine
              emptyStateMessage={
                <div className="text-center space-y-3 py-8">
                  <p className="text-muted-foreground">Você ainda não enviou nenhum vídeo</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Enviar seu primeiro vídeo
                  </Button>
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <VideoUploader
            onUploadComplete={() => {
              setShowUploadDialog(false);
              // Muda para a aba "Meus Vídeos" após o upload
              setActiveTab('mine');
            }}
            onCancel={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default VideoStorage;
