
import React from 'react';
import { Palette, Upload, Grid, Search, Brush } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ArtsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Galeria de Artes</h1>
            <p className="text-muted-foreground">Crie e gerencie suas artes e designs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              Criar Arte
            </Button>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Enviar Arte
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar artes..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty State */}
        <EmptyState
          icon={Palette}
          title="Nenhuma arte encontrada"
          description="Comece criando ou enviando suas primeiras artes"
          actionLabel="Criar Primeira Arte"
          actionIcon={Brush}
          onAction={() => console.log('Create art')}
        />
      </div>
    </div>
  );
};

export default ArtsPage;
