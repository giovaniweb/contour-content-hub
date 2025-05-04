
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";

interface VideosTabProps {
  videos: any[];
  equipmentName: string;
}

export const VideosTab: React.FC<VideosTabProps> = ({ videos, equipmentName }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Video className="h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium mb-1">Nenhum vídeo encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Não há vídeos cadastrados para este equipamento.
        </p>
        <Button asChild>
          <Link to={`/admin/content?equipment=${equipmentName}&type=video`}>
            <Upload className="mr-2 h-4 w-4" />
            Adicionar vídeo
          </Link>
        </Button>
      </div>
    );
  }

  return (
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
              <Button variant="secondary" size="sm" asChild>
                <a href={video.url_video} target="_blank" rel="noreferrer">
                  Assistir
                </a>
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h4 className="font-medium truncate">{video.titulo}</h4>
            {video.descricao_curta && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {video.descricao_curta}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
