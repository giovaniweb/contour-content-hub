
import React, { useState } from 'react';
import { Palette, Upload, Brush, Sparkles, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';

const ArtsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const statusBadges = [
    {
      icon: Sparkles,
      label: 'Materiais',
      variant: 'secondary' as const,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      icon: FileImage,
      label: 'Marketing',
      variant: 'secondary' as const,
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Palette}
        title="Materiais e Artes"
        subtitle="Crie e gerencie seus materiais de marketing"
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
              <Brush className="h-4 w-4" />
              Criar Arte
            </Button>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl">
              <Upload className="h-4 w-4" />
              Enviar Material
            </Button>
          </>
        }
      />

      <div className="container mx-auto px-6 py-8">
        <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
          <EmptyState
            icon={Palette}
            title="Nenhum material encontrado"
            description="Comece criando ou enviando seus primeiros materiais"
            actionLabel="Criar Primeiro Material"
            onAction={() => console.log('Create material')}
          />
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default ArtsPage;
