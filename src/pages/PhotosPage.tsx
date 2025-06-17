
import React, { useState } from 'react';
import { Image, Upload, Grid, Search, Camera, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import BeforeAfterManager from '@/components/before-after/BeforeAfterManager';

const PhotosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'before-after'>('before-after');

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Image className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Galeria de Fotos</h1>
            <p className="text-slate-400">Gerencie suas fotos e resultados</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={viewMode === 'before-after' ? 'default' : 'outline'}
          onClick={() => setViewMode('before-after')}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Antes & Depois
        </Button>
        <Button
          variant={viewMode === 'gallery' ? 'default' : 'outline'}
          onClick={() => setViewMode('gallery')}
          className="flex items-center gap-2"
        >
          <Image className="h-4 w-4" />
          Galeria Geral
        </Button>
      </div>

      {/* Content based on selected view */}
      {viewMode === 'before-after' ? (
        <BeforeAfterManager />
      ) : (
        <div className="space-y-6">
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
                Enviar Fotos
              </Button>
            </div>
          </div>

          {/* Gallery Placeholder */}
          <Card className="p-8">
            <CardContent className="text-center">
              <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2 text-slate-50">Galeria em Desenvolvimento</h3>
              <p className="text-slate-400 mb-4">
                Esta seção estará disponível em breve para organizar todas as suas fotos
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Fotos
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PhotosPage;
