import React, { useState } from 'react';
import { Video, Upload, Grid, Search, Filter, Play, Download, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { EmptyState } from '@/components/ui/empty-state';

const VideoStorage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusBadges = [
    {
      icon: Video,
      label: 'Biblioteca Pro',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Play,
      label: 'Streaming HD',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
    }
  ];

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['user_videos'],
    queryFn: async () => {
      // Para demonstração, retornamos dados mockados
      // Em produção, conectaria com a tabela videos do Supabase
      return [
        {
          id: '1',
          titulo: 'Procedimento de Harmonização Facial',
          descricao: 'Demonstração completa do procedimento',
          categoria: 'Procedimentos',
          url_video: '/placeholder-video.mp4',
          thumbnail_url: '/placeholder-thumbnail.jpg',
          data_upload: new Date().toISOString(),
          duracao: '15:30'
        }
      ];
    },
  });

  const filteredVideos = videos.filter(video =>
    video.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Video}
        title="Biblioteca de Vídeos"
        subtitle="Gerencie e organize seus vídeos profissionais"
        statusBadges={statusBadges}
      />

      {/* Controls */}
      <div className="aurora-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar vídeos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button className="aurora-button">
              <Upload className="h-4 w-4 mr-2" />
              Upload Vídeo
            </Button>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="aurora-card">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple mx-auto"></div>
            <p className="text-slate-400 mt-4">Carregando vídeos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Video}
              title={searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
              description={searchTerm ? 'Tente buscar por outros termos' : 'Comece fazendo upload dos seus primeiros vídeos'}
              actionLabel="Fazer Upload"
              onAction={() => console.log('Upload video')}
            />
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div key={video.id} className="group aurora-glass p-4 rounded-lg backdrop-blur-md bg-slate-800/30 border border-white/10">
                  <div className="relative aspect-video rounded-lg overflow-hidden aurora-glass mb-3">
                    <video
                      className="w-full h-full object-cover"
                      poster={video.thumbnail_url}
                    >
                      <source src={video.url_video} type="video/mp4" />
                    </video>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" className="aurora-button">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-200 group-hover:text-aurora-electric-purple transition-colors duration-200 line-clamp-2">
                      {video.titulo}
                    </h3>
                    
                    {video.categoria && (
                      <span className="inline-block px-2 py-1 text-xs bg-aurora-neon-blue/20 text-aurora-neon-blue rounded-full">
                        {video.categoria}
                      </span>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(video.data_upload).toLocaleDateString()}
                      </span>
                      <span>{video.duracao || '00:00'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuroraPageLayout>
  );
};

export default VideoStorage;