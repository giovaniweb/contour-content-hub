
import React from 'react';
import { Camera, Upload, Grid, Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PhotosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Galeria de Fotos</h1>
            <p className="text-muted-foreground">Gerencie suas fotos e imagens</p>
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Fotos
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar fotos..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty State */}
        <EmptyState
          icon={Camera}
          title="Nenhuma foto encontrada"
          description="Comece enviando suas primeiras fotos para a galeria"
          actionLabel="Enviar Primeira Foto"
          actionIcon={Upload}
          onAction={() => console.log('Upload photos')}
        />
      </div>
    </div>
  );
};

export default PhotosPage;
