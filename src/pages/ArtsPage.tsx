
import React, { useState } from 'react';
import { Palette, Upload, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { EquipmentFilter } from '@/components/filters/EquipmentFilter';
import { useEquipmentFilter } from '@/hooks/useEquipmentFilter';

const ArtsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  
  const { equipmentOptions, isLoading } = useEquipmentFilter();

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
        title="Artes Gráficas"
        subtitle="Crie e gerencie artes para suas campanhas de marketing"
        statusBadges={statusBadges}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        additionalControls={
          <Button className="flex items-center gap-2 aurora-button-enhanced">
            <Upload className="h-4 w-4" />
            Enviar Material
          </Button>
        }
      />

      {/* Filtros Específicos */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="min-w-[200px]">
            <EquipmentFilter
              value={selectedEquipment}
              onValueChange={setSelectedEquipment}
              placeholder="Filtrar por equipamento"
              className="w-full"
            />
          </div>
          
          {selectedEquipment && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedEquipment('')}
              className="bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
        <EmptyState
          icon={Palette}
          title="Nenhum material encontrado"
          description="Comece criando ou enviando seus primeiros materiais"
          actionLabel="Criar Primeiro Material"
          onAction={() => console.log('Create material')}
        />
      </div>
    </AuroraPageLayout>
  );
};

export default ArtsPage;
