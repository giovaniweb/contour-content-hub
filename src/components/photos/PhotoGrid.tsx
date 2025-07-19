import React, { useState } from 'react';
import { Photo } from '@/services/photoService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { saveLike } = usePhotoLikes();

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set([...prev, photoId]));
  };

  const handleImageError = (photoId: string) => {
    setFailedImages(prev => new Set([...prev, photoId]));
  };

  const handleLike = async (photoId: string) => {
    await saveLike(photoId);
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url_imagem;
    link.download = `${photo.titulo}.jpg`;
    link.click();
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Nenhuma foto encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <Card key={photo.id} className="bg-slate-800/50 border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-colors group">
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-video bg-slate-700/50 overflow-hidden">
              <img
                src={photo.thumbnail_url || photo.url_imagem}
                alt={photo.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay com ações */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(photo.id)}
                  className="text-pink-400 border-pink-400/20 hover:bg-pink-400/20"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPhotoClick?.(photo)}
                  className="text-white border-white/20 hover:bg-white/20"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(photo)}
                  className="text-green-400 border-green-400/20 hover:bg-green-400/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-2 truncate">{photo.titulo}</h3>
              
              {photo.descricao_curta && (
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">{photo.descricao_curta}</p>
              )}
              
              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {photo.tags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {photo.tags.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-500/20 text-slate-400"
                    >
                      +{photo.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {photo.favoritos_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {photo.downloads_count || 0}
                  </span>
                </div>
                <span>{new Date(photo.data_upload).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};