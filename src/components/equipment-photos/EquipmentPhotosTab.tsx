import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';
import { 
  Heart, 
  Download, 
  Eye, 
  Archive,
  Share2,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getEquipmentPhotos, 
  downloadPhoto,
  type EquipmentPhoto 
} from '@/api/equipment/photos';
import PhotoCard from './PhotoCard';

interface EquipmentPhotosTabProps {
  equipmentId: string;
}

const EquipmentPhotosTab: React.FC<EquipmentPhotosTabProps> = ({ equipmentId }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<EquipmentPhoto | null>(null);
  const queryClient = useQueryClient();

  // Fetch photos
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['equipment-photos', equipmentId],
    queryFn: () => getEquipmentPhotos(equipmentId)
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async ({ photoId, downloadType }: { photoId: string; downloadType: 'single' | 'zip' }) => {
      await downloadPhoto(photoId, downloadType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-photos', equipmentId] });
      toast({
        title: "Download registrado",
        description: "Download iniciado com sucesso!"
      });
    }
  });

  const handlePhotoSelect = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedPhotos.size === 0) return;
    
    try {
      // For multiple photos, create a zip download
      if (selectedPhotos.size > 1) {
        for (const photoId of selectedPhotos) {
          await downloadPhoto(photoId, 'zip');
        }
        toast({
          title: "Download ZIP iniciado",
          description: `Iniciando download de ${selectedPhotos.size} fotos em formato ZIP`
        });
      } else {
        const photoId = Array.from(selectedPhotos)[0];
        await downloadPhoto(photoId, 'single');
        toast({
          title: "Download iniciado",
          description: "Download da foto iniciado com sucesso!"
        });
      }
      setSelectedPhotos(new Set());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no download",
        description: "Não foi possível iniciar o download."
      });
    }
  };

  const handleDownloadPhoto = async (photoId: string) => {
    try {
      // Get photo data to download actual file
      const photo = photos.find(p => p.id === photoId);
      if (photo?.image_url) {
        // Force download by fetching the image and creating blob
        const response = await fetch(photo.image_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${photo.title || 'photo'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      }
      
      // Record download
      downloadMutation.mutate({ photoId, downloadType: 'single' });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="aurora-card animate-pulse">
            <CardContent className="p-0">
              <div className="w-full h-48 aurora-glass rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 aurora-glass rounded w-3/4"></div>
                <div className="h-3 aurora-glass rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="aurora-heading text-xl font-semibold text-white">
            Galeria de Fotos ({photos.length})
          </h3>
          {selectedPhotos.size > 0 && (
            <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple">
              {selectedPhotos.size} selecionadas
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedPhotos.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Button
                onClick={handleDownloadSelected}
                size="sm"
                className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 hover:bg-aurora-emerald/30"
              >
                <Archive className="h-4 w-4 mr-2" />
                Download ZIP ({selectedPhotos.size})
              </Button>
              <Button
                onClick={() => setSelectedPhotos(new Set())}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                Cancelar
              </Button>
            </motion.div>
          )}

          <div className="flex items-center gap-1 bg-aurora-dark-blue/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
          >
            {selectedPhotos.size === photos.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
          </Button>
        </div>
      </div>

      {/* Grid de fotos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                isSelected={selectedPhotos.has(photo.id)}
                onSelect={handlePhotoSelect}
                onDownload={handleDownloadPhoto}
                onPreview={setSelectedPhoto}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Lista view */
        <div className="space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`aurora-card hover:aurora-glow-blue transition-all duration-500 aurora-glass ${
                selectedPhotos.has(photo.id) ? 'ring-2 ring-aurora-electric-purple' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedPhotos.has(photo.id)}
                      onCheckedChange={() => handlePhotoSelect(photo.id)}
                    />
                    
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h4 className="aurora-heading font-semibold text-white">
                        {photo.title}
                      </h4>
                      {photo.description && (
                        <p className="aurora-body text-white/60 text-sm mt-1">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {photo.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {photo.downloads_count}
                        </span>
                        <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-aurora-electric-purple hover:text-white hover:bg-aurora-electric-purple/20"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-aurora-emerald hover:text-white hover:bg-aurora-emerald/20"
                        onClick={() => handleDownloadPhoto(photo.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de preview da foto */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-6 bg-aurora-dark-blue">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="aurora-heading text-xl font-semibold text-white mb-2">
                      {selectedPhoto.title}
                    </h3>
                    {selectedPhoto.description && (
                      <p className="aurora-body text-white/80 mb-4">
                        {selectedPhoto.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDownloadPhoto(selectedPhoto.id)}
                    className="aurora-button aurora-glow hover:aurora-glow-intense"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {photos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 aurora-glass rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-aurora-electric-purple" />
          </div>
          <h3 className="aurora-heading text-lg font-semibold text-white mb-2">
            Nenhuma foto encontrada
          </h3>
          <p className="aurora-body text-white/60">
            Ainda não há fotos para este equipamento.
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentPhotosTab;