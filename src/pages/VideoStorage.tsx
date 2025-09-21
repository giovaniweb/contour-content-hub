import React, { useState } from 'react';
import { Video, Upload, Grid, Search, Filter, Play, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';

const VideoStorage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const { getEquipmentName } = useEquipmentFilter();

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
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          titulo,
          descricao_curta,
          descricao_detalhada,
          thumbnail_url,
          url_video,
          categoria,
          tags,
          downloads_count,
          data_upload,
          duracao,
          equipamentos
        `)
        .order('data_upload', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vídeos:', error);
        return [];
      }

      return data || [];
    },
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEquipment = !selectedEquipment || 
                            (video.equipamentos && video.equipamentos.includes(selectedEquipment));
    
    return matchesSearch && matchesEquipment;
  });

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
            <EquipmentFilter
              value={selectedEquipment}
              onValueChange={setSelectedEquipment}
              className="w-48"
            />
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
                <div key={video.id} className="bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-400/50 overflow-hidden transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-400/10 rounded-2xl">
                  <div className="p-0">
                    <div className="relative aspect-video bg-slate-700/50 overflow-hidden rounded-t-2xl">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                          <Play className="h-12 w-12 text-cyan-400" />
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-3 right-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white border-white/30 hover:bg-white/20 bg-black/50 backdrop-blur-sm rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Duration badge */}
                      {video.duracao && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-600/90 text-white text-xs border-none">
                            {video.duracao}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">{video.titulo}</h3>
                      
                      {video.equipamentos && (
                        <p className="text-cyan-400 text-xs mb-3 font-medium">{getEquipmentName(video.equipamentos[0])}</p>
                      )}
                      
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/30">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-slate-600/50 hover:border-cyan-400/50 hover:text-white rounded-lg"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-pink-500/20 hover:border-pink-400/50 hover:text-pink-300 rounded-lg px-3"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300 rounded-lg px-3"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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