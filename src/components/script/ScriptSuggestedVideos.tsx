
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Video {
  id?: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
}

interface ScriptSuggestedVideosProps {
  videos: Video[];
}

const ScriptSuggestedVideos: React.FC<ScriptSuggestedVideosProps> = ({ videos }) => {
  if (videos.length === 0) {
    return (
      <TabsContent value="sugestoes" className="mt-0 p-0">
        <div className="text-center p-4 text-muted-foreground">
          Nenhum vídeo sugerido disponível para este roteiro.
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="sugestoes" className="mt-0 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-video overflow-hidden bg-muted">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium line-clamp-2">{video.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
};

export default ScriptSuggestedVideos;
