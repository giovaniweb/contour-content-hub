
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Plus, Upload, Video, FilmIcon, Clock, Library, Search, Users } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { VideoIcon } from '@/components/ui/icons';

const VideoStorage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const equipmentId = searchParams.get('equipment');
  const [searchQuery, setSearchQuery] = useState('');

  // Open upload dialog automatically if equipment parameter is present in URL
  useEffect(() => {
    if (equipmentId && isAdmin()) {
      setShowUploadDialog(true);
      setUploadMode('single');
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

  const handleUploadComplete = () => {
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

  const mockVideos = isAdmin() ? [
    { id: 1, title: 'Como utilizar o equipamento X', views: 124, date: '2025-05-01', thumbnail: 'https://via.placeholder.com/300x160?text=Video+Thumbnail' },
    { id: 2, title: 'Demonstração do procedimento Y', views: 89, date: '2025-04-28', thumbnail: 'https://via.placeholder.com/300x160?text=Demo+Video' },
    { id: 3, title: 'Tutorial de configuração Z', views: 56, date: '2025-04-25', thumbnail: 'https://via.placeholder.com/300x160?text=Tutorial+Video' },
  ] : [];

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <VideoIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Biblioteca de Vídeos
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie seus vídeos em um só lugar
              </p>
            </div>
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Sua Coleção</h2>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar vídeos..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b">
              <TabsList className="h-12 bg-transparent border-b-0 p-0 px-6 flex">
                <TabsTrigger 
                  value="all" 
                  className="h-12 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                >
                  Todos os Vídeos
                </TabsTrigger>
                <TabsTrigger 
                  value="mine" 
                  className="h-12 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                >
                  Meus Vídeos
                </TabsTrigger>
                <TabsTrigger 
                  value="recent" 
                  className="h-12 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Recentes
                </TabsTrigger>
                <TabsTrigger 
                  value="shared" 
                  className="h-12 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Compartilhados
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="p-6 space-y-6">
              {mockVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockVideos.map(video => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-md transition-all">
                      <div className="relative aspect-video">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <FilmIcon className="h-12 w-12 text-white" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70">
                          {video.views} visualizações
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Adicionado em {new Date(video.date).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Video className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
                  <p className="mt-4 text-muted-foreground">
                    Nenhum vídeo disponível. Entre em contato com um administrador para adicionar vídeos.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="mine" className="p-6 space-y-4">
              {isAdmin() && mockVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockVideos.slice(0, 1).map(video => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-md transition-all">
                      <div className="relative aspect-video">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <FilmIcon className="h-12 w-12 text-white" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70">
                          {video.views} visualizações
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Adicionado em {new Date(video.date).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-3 py-16">
                  <p className="text-muted-foreground">
                    {isAdmin() 
                      ? "Você ainda não enviou nenhum vídeo" 
                      : "Você não possui vídeos. Apenas administradores podem fazer upload de vídeos."}
                  </p>
                  {isAdmin() && (
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Enviar seu primeiro vídeo
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="p-6 space-y-4">
              <div className="text-center py-16">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
                <p className="mt-4 text-muted-foreground">
                  Nenhum vídeo visualizado recentemente.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="shared" className="p-6 space-y-4">
              <div className="text-center py-16">
                <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
                <p className="mt-4 text-muted-foreground">
                  Nenhum vídeo compartilhado com você.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialog de upload só é mostrado para administradores */}
      {isAdmin() && (
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className={uploadMode === 'batch' ? "sm:max-w-3xl" : "sm:max-w-lg"}>
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold mb-4">
                {uploadMode === 'single' ? 'Enviar Vídeo' : 'Upload em Lote'}
              </h2>
              <p className="text-muted-foreground mb-6">
                Funcionalidade de upload em desenvolvimento.
              </p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancelar</Button>
                <Button onClick={handleUploadComplete}>Simular upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default VideoStorage;
