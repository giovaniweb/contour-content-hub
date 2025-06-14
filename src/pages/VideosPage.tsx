
import React, { useState } from 'react';
import { Video, Upload, Grid, Search, Play, Filter } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VideosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Video className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Biblioteca de Vídeos</h1>
            <p className="text-slate-400">Gerencie seus vídeos e produções</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar vídeos..." 
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
            <Play className="h-4 w-4" />
            Reproduzir
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Vídeo
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Video}
        title="Nenhum vídeo encontrado"
        description="Comece enviando seus primeiros vídeos"
        actionLabel="Enviar Primeiro Vídeo"
        actionIcon={Upload}
        onAction={() => console.log('Upload video')}
      />
    </div>
  );
};

export default VideosPage;
