import React from 'react';
import Layout from '@/components/Layout';
import VideoUploader from '@/components/video-storage/VideoUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VideoImportPage: React.FC = () => {
  

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Importação de Vídeos</h1>
        <p className="text-muted-foreground">
          Envie novos vídeos para o sistema.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Importação</CardTitle>
            <CardDescription>
              Faça upload direto do seu computador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="upload">Upload Direto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="pt-4">
                <VideoUploader />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Dicas para upload de vídeos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Formatos Recomendados</h3>
                <p className="text-sm text-muted-foreground">
                  Recomendamos o upload de arquivos MP4 ou MOV com codificação H.264 para melhor compatibilidade.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Tamanhos Ideais</h3>
                <p className="text-sm text-muted-foreground">
                  Vídeos com resolução 1080p (1920x1080) oferecem excelente qualidade e tamanho de arquivo gerenciável.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">Metadados</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione um título descritivo e tags relevantes para facilitar a busca e organização dos vídeos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoImportPage;
