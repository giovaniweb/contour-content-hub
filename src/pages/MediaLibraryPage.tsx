
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MediaLibraryPage: React.FC = () => {
  return (
    <Layout title="Biblioteca de Mídia">
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Biblioteca de Mídia</h1>
        
        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Imagens</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img 
                          src={`/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png`}
                          alt={`Video ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Video className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm">Vídeo de Tratamento Facial {index + 1}</h3>
                        <p className="text-xs text-muted-foreground">Duração: 2:45 • Adicionado: 12/05/2025</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden group cursor-pointer">
                      <div className="aspect-square bg-muted relative">
                        <img 
                          src={`/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png`}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate">imagem_{index + 1}.png</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <FileText className="h-10 w-10 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Documento {index + 1}</h3>
                        <p className="text-xs text-muted-foreground">PDF • 2.4MB • Adicionado: 10/05/2025</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Relatório</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Cliente</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MediaLibraryPage;
