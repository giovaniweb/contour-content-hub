
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import BatchFileUploader from "@/components/downloads/BatchFileUploader";
import FileMetadataForm from "@/components/downloads/FileMetadataForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, Palette, Printer, FileText, Eye, Calendar, Images, Upload as UploadIcon } from "lucide-react";
import CarouselUploader from "@/components/downloads/CarouselUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ListDownloads: React.FC = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["downloads_storage"],
    queryFn: async () => {
      const { data } = await supabase
        .from("downloads_storage")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'arte-digital':
        return { 
          icon: <Palette className="h-4 w-4" />, 
          label: 'Arte Digital', 
          color: 'text-aurora-electric-purple border-aurora-electric-purple/30' 
        };
      case 'para-impressao':
        return { 
          icon: <Printer className="h-4 w-4" />, 
          label: 'Para Impressão', 
          color: 'text-aurora-emerald border-aurora-emerald/30' 
        };
      default:
        return { 
          icon: <FileText className="h-4 w-4" />, 
          label: 'Outro', 
          color: 'text-white/60 border-white/30' 
        };
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="aurora-glass animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-[16/9] bg-white/20 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="aurora-heading text-xl font-semibold text-white">
          Materiais Disponíveis ({data?.length || 0})
        </h2>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((material) => {
          const categoryInfo = getCategoryInfo(material.category);
          
          return (
            <Card key={material.id} className="aurora-glass border-aurora-electric-purple/30 aurora-glow hover:border-aurora-electric-purple/50 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] rounded-t-lg overflow-hidden bg-black/20">
                  {material.thumbnail_url ? (
                    <img 
                      src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.thumbnail_url}`}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-white/40" />
                    </div>
                  )}
                  
                  {/* Download overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="aurora-button aurora-glow hover:aurora-glow-intense"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.file_url}`;
                        link.download = material.title;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="outline" 
                      className={`${categoryInfo.color} bg-black/50 backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-1">
                        {categoryInfo.icon}
                        {categoryInfo.label}
                      </div>
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="aurora-heading font-semibold text-white mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  
                  {material.description && (
                    <p className="aurora-body text-white/70 text-sm mb-3 line-clamp-2">
                      {material.description}
                    </p>
                  )}

                  {/* Tags */}
                  {material.tags && material.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-aurora-neon-blue/30 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-white/30 text-white/60">
                          +{material.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(material.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <Badge variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30 text-xs">
                      {material.file_type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data && data.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 aurora-glass rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-aurora-electric-purple" />
          </div>
          <h3 className="aurora-heading text-lg font-semibold text-white mb-2">
            Nenhum material encontrado
          </h3>
          <p className="aurora-body text-white/60">
            Envie seus primeiros materiais de marketing para começar.
          </p>
        </div>
      )}
    </div>
  );
};

const BatchDownloadManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'carousel'>('single');

  return (
    <AppLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="text-center lg:text-left">
            <h1 className="aurora-heading text-3xl font-bold text-white mb-4">
              Materiais de Marketing
            </h1>
            <p className="aurora-body text-white/70 text-lg">
              Gerencie seus materiais PSD, PDF, JPG e PNG para campanhas e redes sociais
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => window.location.href = '/downloads/manage'}
              variant="outline"
              className="border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerenciar Materiais
            </Button>
          </div>
        </div>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-aurora-electric-purple" />
              Upload de Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showMetadataForm ? (
              <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'single' | 'carousel')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                  <TabsTrigger value="single" className="flex items-center gap-2">
                    <UploadIcon className="h-4 w-4" />
                    Upload Individual
                  </TabsTrigger>
                  <TabsTrigger value="carousel" className="flex items-center gap-2">
                    <Images className="h-4 w-4" />
                    Carrossel
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="single" className="mt-6">
                  <BatchFileUploader
                    onComplete={(files) => {
                      setUploadedFiles(files.filter((f) => f.url));
                      setShowMetadataForm(true);
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="carousel" className="mt-6">
                  <CarouselUploader
                    onComplete={(files) => {
                      setUploadedFiles(files.filter((f) => f.url));
                      setShowMetadataForm(true);
                    }}
                    maxFiles={10}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <FileMetadataForm
                uploadedFiles={uploadedFiles}
                onFinish={() => window.location.reload()}
              />
            )}
          </CardContent>
        </Card>
        
        <ListDownloads />
      </div>
    </AppLayout>
  );
};

export default BatchDownloadManager;
