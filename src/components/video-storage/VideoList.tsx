
import React, { useState, useEffect } from 'react';
import { getVideos, getMyVideos } from '@/services/videoStorageService';
import { StoredVideo, VideoFilterOptions, VideoSortOptions } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import VideoCard from './VideoCard';
import VideoListSkeleton from './VideoListSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VideoListProps {
  onlyMine?: boolean;
  initialFilters?: VideoFilterOptions;
  onSelectVideo?: (video: StoredVideo) => void;
  emptyStateMessage?: string | React.ReactNode; // Alterado para permitir ReactNode
}

const VideoList: React.FC<VideoListProps> = ({ 
  onlyMine = false, 
  initialFilters,
  onSelectVideo,
  emptyStateMessage = "Nenhum vídeo encontrado"
}) => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<VideoFilterOptions>(initialFilters || {});
  const [sort, setSort] = useState<VideoSortOptions>({ field: 'created_at', direction: 'desc' });

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = onlyMine
        ? await getMyVideos({...filters, search: searchTerm}, sort, page)
        : await getVideos({...filters, search: searchTerm}, sort, page);

      if (result.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar vídeos",
          description: result.error
        });
      } else {
        setVideos(result.videos);
        setTotalVideos(result.total);
      }
    } catch (err) {
      console.error('Erro ao buscar vídeos:', err);
      setError('Ocorreu um erro ao carregar os vídeos.');
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Não foi possível carregar os vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [onlyMine, page, sort, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVideos();
  };

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [
      'title' | 'size' | 'created_at' | 'updated_at',
      'asc' | 'desc'
    ];
    setSort({ field, direction });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Buscar</Button>
          </form>
        </div>
        
        <div className="w-full md:w-1/3">
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Mais recente</SelectItem>
              <SelectItem value="created_at-asc">Mais antigo</SelectItem>
              <SelectItem value="title-asc">Título (A-Z)</SelectItem>
              <SelectItem value="title-desc">Título (Z-A)</SelectItem>
              <SelectItem value="size-desc">Maior tamanho</SelectItem>
              <SelectItem value="size-asc">Menor tamanho</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <VideoListSkeleton count={6} />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/50">
          {typeof emptyStateMessage === 'string' ? (
            <p className="text-muted-foreground">{emptyStateMessage}</p>
          ) : (
            emptyStateMessage
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onClick={() => onSelectVideo && onSelectVideo(video)}
              onUpdate={() => fetchVideos()}
            />
          ))}
        </div>
      )}
      
      {totalVideos > videos.length && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
          >
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoList;
