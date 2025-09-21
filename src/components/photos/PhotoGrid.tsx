import React, { useState } from 'react';
import { Photo } from '@/services/photoService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { getEquipmentName } = useEquipmentFilter();

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set([...prev, photoId]));
  };

  const handleImageError = (photoId: string) => {
    setFailedImages(prev => new Set([...prev, photoId]));
  };

  const handleLike = async (photoId: string) => {
    console.log('Like functionality needs implementation');
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
        <Card key={photo.id} className="bg-slate-800/50 border-2 border-slate-700/50 hover:border-cyan-400/50 overflow-hidden transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-400/10 rounded-2xl">
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-video bg-slate-700/50 overflow-hidden rounded-t-2xl">
              <img
                src={photo.thumbnail_url || photo.url_imagem}
                alt={photo.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Hover overlay apenas com botão de visualizar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-3 right-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPhotoClick?.(photo)}
                    className="text-white border-white/30 hover:bg-white/20 bg-black/50 backdrop-blur-sm rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Badge com contagem se aplicável */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-purple-600/90 text-white text-xs border-none">
                    {photo.tags.length} {photo.tags.length === 1 ? 'tag' : 'tags'}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white text-sm mb-1 truncate">{photo.titulo}</h3>
              
              {photo.categoria && (
                <p className="text-cyan-400 text-xs mb-3 font-medium">{getEquipmentName(photo.categoria)}</p>
              )}
              
              {/* Action Buttons - Alinhados horizontalmente */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPhotoClick?.(photo)}
                  className="flex-1 bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-slate-600/50 hover:border-cyan-400/50 hover:text-white rounded-lg"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLike(photo.id)}
                  className="bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-pink-500/20 hover:border-pink-400/50 hover:text-pink-300 rounded-lg px-3"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(photo)}
                  className="bg-slate-700/50 border-slate-700/30 text-slate-200 hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300 rounded-lg px-3"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};