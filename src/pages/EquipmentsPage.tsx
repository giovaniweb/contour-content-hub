
import React, { useState } from 'react';
import { Wrench, Plus, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEquipments } from '@/hooks/useEquipments';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import EquipmentGrid from '@/components/equipment/EquipmentGrid';
import EquipmentList from '@/components/equipment/EquipmentList';
import { EmptyState } from '@/components/ui/empty-state';

const EquipmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { equipments, loading, error } = useEquipments();

  const filteredEquipments = equipments.filter(equipment =>
    equipment.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadges = [
    {
      icon: Sparkles,
      label: 'Ativos',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald'
    },
    {
      icon: Zap,
      label: 'Equipamentos',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 aurora-glow'
    }
  ];

  if (error) {
    return (
      <AuroraPageLayout>
        <StandardPageHeader
          icon={Wrench}
          title="Equipamentos"
          subtitle="Erro ao carregar equipamentos"
        />
        <div className="container mx-auto px-6">
          <div className="text-center py-12 aurora-glass rounded-3xl border border-aurora-electric-purple/30">
            <p className="aurora-body text-red-400 mb-6">{error.message}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="aurora-button aurora-glow hover:aurora-glow-intense"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Wrench}
        title="Equipamentos"
        subtitle="Explore nossa coleção de equipamentos"
        statusBadges={statusBadges}
      />

      <SearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        additionalControls={
          <Button className="aurora-button aurora-glow hover:aurora-glow-intense rounded-xl flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        }
      />

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 aurora-glass rounded-3xl border border-aurora-electric-purple/30">
            <div className="aurora-sphere-outer w-16 h-16 rounded-full mx-auto mb-6 relative">
              <div className="aurora-sphere-middle absolute inset-2 rounded-full">
                <div className="aurora-sphere-core absolute inset-2 rounded-full">
                  <div className="aurora-sphere-nucleus absolute inset-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
            <p className="aurora-body text-white/80 aurora-shimmer">Carregando equipamentos...</p>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
            <EmptyState
              icon={Wrench}
              title="Nenhum equipamento encontrado"
              description="Comece adicionando seus primeiros equipamentos"
              actionLabel="Adicionar Primeiro Equipamento"
              onAction={() => console.log('Add equipment')}
            />
          </div>
        ) : (
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8 aurora-glow">
            {viewMode === 'grid' ? (
              <EquipmentGrid equipments={filteredEquipments} />
            ) : (
              <EquipmentList equipments={filteredEquipments} />
            )}
          </div>
        )}
      </div>
    </AuroraPageLayout>
  );
};

export default EquipmentsPage;
