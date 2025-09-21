
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { PhotoGrid } from '@/components/photos/PhotoGrid';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import { photoService, Photo } from '@/services/photoService';
import { useToast } from '@/hooks/use-toast';

const PhotosPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, searchTerm, selectedEquipment]);

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
    let filtered = photos;

    // Filter by equipment
    if (selectedEquipment) {
      filtered = filtered.filter(photo => {
        // Check new equipamentos array (contains equipment names)
        if (photo.equipamentos && photo.equipamentos.length > 0) {
          return photo.equipamentos.includes(selectedEquipment);
        }
        // Fallback to categoria field for backward compatibility
        return photo.categoria === selectedEquipment;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(photo => 
        photo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        photo.equipamentos?.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPhotos(filtered);
  };

  const statusBadges = [
    {
      icon: Image,
      label: 'Acervo Visual',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Sparkles,
      label: `${photos.length} Fotos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
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
            <EquipmentFilter
              value={selectedEquipment}
              onValueChange={setSelectedEquipment}
              className="w-64"
            />
            <Button 
              variant="outline" 
              className="flex items-center gap-2 aurora-glass border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/20"
            >
              <Camera className="h-4 w-4" />
              Capturar Foto
            </Button>
            <Button className="flex items-center gap-2 aurora-button-enhanced">
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
                <div className="aspect-video bg-slate-600/50 animate-pulse" />
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
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
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
