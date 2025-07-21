import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, Download, Calendar, Clock } from 'lucide-react';

const VideoStorage: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: "Procedimento de Harmonização Facial",
      description: "Demonstração completa do procedimento",
      duration: "15:30",
      date: "15/01/2024",
      thumbnailUrl: "/api/placeholder/300/200",
      category: "Procedimentos"
    },
    {
      id: 2,
      title: "Técnicas de Skinbooster",
      description: "Aplicação de skinbooster em diferentes áreas",
      duration: "12:45",
      date: "18/01/2024",
      thumbnailUrl: "/api/placeholder/300/200",
      category: "Técnicas"
    },
    {
      id: 3,
      title: "Consulta e Avaliação",
      description: "Como realizar uma consulta eficaz",
      duration: "08:20",
      date: "22/01/2024",
      thumbnailUrl: "/api/placeholder/300/200",
      category: "Consultas"
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meus Vídeos</h1>
        <p className="text-muted-foreground">
          Biblioteca pessoal de vídeos salvos e criados
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="sm" className="rounded-full">
                  <Play className="h-4 w-4 mr-2" />
                  Assistir
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{video.date}</span>
                </div>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                  {video.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Assistir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoStorage;
