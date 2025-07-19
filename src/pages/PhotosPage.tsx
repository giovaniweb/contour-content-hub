
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { PhotoGrid } from '@/components/photos/PhotoGrid';
import { photoService, Photo } from '@/services/photoService';
import { useToast } from '@/hooks/use-toast';

const PhotosPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchTerm]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await photoService.getUserPhotos();
      
      if (error) {
        toast({
          title: "Erro ao carregar fotos",
          description: error,
          variant: "destructive"
        });
      } else {
        setPhotos(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    if (!searchTerm.trim()) {
      setFilteredPhotos(photos);
      return;
    }

    const filtered = photos.filter(photo => 
      photo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredPhotos(filtered);
  };

  const statusBadges = [
    {
      icon: Sparkles,
      label: `${photos.length} Fotos`,
      variant: 'secondary' as const,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      icon: Image,
      label: 'Galeria',
      variant: 'secondary' as const,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Camera}
        title="Galeria de Fotos"
        subtitle="Organize suas fotos antes e depois"
        statusBadges={statusBadges}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        additionalControls={
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl"
            >
              <Camera className="h-4 w-4" />
              Capturar Foto
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl">
              <Upload className="h-4 w-4" />
              Enviar Fotos
            </Button>
          </>
        }
      />

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl overflow-hidden border border-cyan-500/20">
                <div className="aspect-square bg-slate-600/50 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-600/50 rounded animate-pulse" />
                  <div className="h-3 bg-slate-600/50 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPhotos.length > 0 ? (
          <PhotoGrid 
            photos={filteredPhotos}
            onPhotoClick={(photo) => console.log('View photo:', photo)}
          />
        ) : (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <EmptyState
              icon={Camera}
              title={searchTerm ? "Nenhuma foto encontrada" : "Nenhuma foto ainda"}
              description={searchTerm ? `Nenhuma foto corresponde à busca "${searchTerm}"` : "Comece enviando suas primeiras fotos"}
              actionLabel={searchTerm ? "Limpar Busca" : "Enviar Primeira Foto"}
              onAction={() => searchTerm ? setSearchTerm('') : console.log('Upload photo')}
            />
          </div>
        )}
      </div>
    </AuroraPageLayout>
  );
};

export default PhotosPage;
