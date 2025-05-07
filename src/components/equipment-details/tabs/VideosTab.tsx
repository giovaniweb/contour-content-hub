
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Video, Download, Eye } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface VideoData {
  id: string;
  titulo: string;
  descricao_curta?: string;
  url_video?: string;
  preview_url?: string;
  duracao?: string;
  area_corpo?: string;
  finalidade?: string[];
}

interface VideosTabProps {
  setActiveTab: (tab: string) => void;
}

export const VideosTab: React.FC<VideosTabProps> = ({ setActiveTab }) => {
  const { id } = useParams<{ id: string }>();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .contains('equipamentos', [id]);
          
        if (error) {
          throw error;
        }
        
        console.log('Videos fetched:', data);
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error("Erro ao carregar vídeos", {
          description: "Não foi possível carregar os vídeos associados a este equipamento."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [id]);

  const handleDownload = (video: VideoData) => {
    try {
      const videoUrl = video.url_video;
      if (!videoUrl) {
        toast.error("Link de download não disponível");
        return;
      }
      
      // Create an anchor element and set the href to the video URL
      const link = window.document.createElement('a');
      link.href = videoUrl;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast.success("Abrindo vídeo", {
        description: "O vídeo está sendo aberto em uma nova aba."
      });
    } catch (error) {
      console.error("Erro ao abrir vídeo:", error);
      toast.error("Erro ao abrir vídeo", {
        description: "Não foi possível abrir o link do vídeo."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Sem vídeos</h3>
        <p className="text-muted-foreground mt-2">
          Não há vídeos disponíveis para este equipamento.
        </p>
        <div className="flex justify-center mt-4 gap-2">
          <Button onClick={() => setActiveTab('import')}>
            Importar Vídeo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Vídeos Disponíveis</h3>
        <Button variant="outline" onClick={() => setActiveTab('import')}>
          Importar Mais Vídeos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden h-full">
            <div className="aspect-video bg-gray-100 relative">
              {video.preview_url ? (
                <img 
                  src={video.preview_url} 
                  alt={video.titulo} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" onClick={() => handleDownload(video)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
              {video.duracao && (
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duracao}
                </span>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <h4 className="font-medium truncate">{video.titulo}</h4>
              </div>
              {video.descricao_curta && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {video.descricao_curta}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {video.area_corpo && (
                  <Badge variant="outline" className="text-xs">
                    {video.area_corpo}
                  </Badge>
                )}
                {video.finalidade && video.finalidade.map((fin, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {fin}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
