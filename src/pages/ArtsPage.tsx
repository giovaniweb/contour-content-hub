
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
      icon: Palette,
      label: 'Design Criativo',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: FileImage,
      label: 'Materiais Pro',
      variant: 'secondary' as const,
      color: 'bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30'
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
              className="flex items-center gap-2 aurora-glass border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/20"
            >
              <Brush className="h-4 w-4" />
              Criar Arte
            </Button>
            <Button className="flex items-center gap-2 aurora-button-enhanced">
              <Upload className="h-4 w-4" />
              Enviar Material
            </Button>
          </>
        }
      />

      <div className="container mx-auto px-6 py-8">
        <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
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
