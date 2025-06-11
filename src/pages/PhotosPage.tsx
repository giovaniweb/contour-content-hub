
import React, { useState } from 'react';
import { Image, Upload, Grid, Search, Camera, Filter } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PhotosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Image className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Galeria de Fotos</h1>
            <p className="text-slate-400">Gerencie suas fotos e imagens</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar fotos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Capturar Foto
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Foto
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Image}
        title="Nenhuma foto encontrada"
        description="Comece enviando ou capturando suas primeiras fotos"
        actionLabel="Enviar Primeira Foto"
        actionIcon={Upload}
        onAction={() => console.log('Upload photo')}
      />
    </div>
  );
};

export default PhotosPage;
