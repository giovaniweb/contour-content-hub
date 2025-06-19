
import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';

const PhotosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusBadges = [
    {
      icon: Sparkles,
      label: 'Antes/Depois',
      variant: 'secondary' as const,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    {
      icon: Image,
      label: 'Galeria',
      variant: 'secondary' as const,
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
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
        <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
          <EmptyState
            icon={Camera}
            title="Nenhuma foto encontrada"
            description="Comece enviando ou capturando suas primeiras fotos"
            actionLabel="Enviar Primeira Foto"
            onAction={() => console.log('Upload photo')}
          />
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default PhotosPage;
