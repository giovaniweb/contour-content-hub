
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

const VideoGallerySection: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: 'Como aplicar Botox - Técnicas avançadas',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '15:30',
      category: 'Procedimentos'
    },
    {
      id: 2,
      title: 'Radiofrequência facial - Resultados',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '12:45',
      category: 'Equipamentos'
    },
    {
      id: 3,
      title: 'Cuidados pós-operatórios',
      thumbnail: '/placeholder-video-thumb.jpg',
      duration: '8:20',
      category: 'Educativo'
    }
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Galeria de Vídeos</h2>
        <p className="text-muted-foreground">Conteúdos educativos para profissionais da estética</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative aspect-video bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <Play className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            <CardContent className="p-4">
              <span className="text-xs text-primary font-medium">{video.category}</span>
              <h3 className="font-semibold mt-1">{video.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default VideoGallerySection;
