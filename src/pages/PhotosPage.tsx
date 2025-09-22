
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Sparkles, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { PhotoGrid } from '@/components/photos/PhotoGrid';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import { Pagination } from '@/components/ui/pagination';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useToast } from '@/hooks/use-toast';

const PhotosPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { photos, totalCount, isLoading, error } = useUserPhotos({
    page: currentPage,
    itemsPerPage,
    searchTerm,
    selectedEquipment
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEquipment]);

  if (error) {
    toast({
      title: "Erro ao carregar fotos",
      description: error,
      variant: "destructive"
    });
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

  const statusBadges = [
    {
      icon: Image,
      label: 'Acervo Visual',
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30'
    },
    {
      icon: Sparkles,
      label: `${totalCount} Fotos`,
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
        {isLoading ? (
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
        ) : photos.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/70">
                Mostrando {startIndex}-{endIndex} de {totalCount} fotos
              </p>
            </div>
            
            <PhotoGrid 
              photos={photos}
              onPhotoClick={(photo) => console.log('View photo:', photo)}
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
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
