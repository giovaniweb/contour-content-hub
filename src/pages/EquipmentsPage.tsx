
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
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      icon: Zap,
      label: 'Equipamentos',
      variant: 'secondary' as const,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>
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
          <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        }
      />

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Carregando equipamentos...</p>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <EmptyState
              icon={Wrench}
              title="Nenhum equipamento encontrado"
              description="Comece adicionando seus primeiros equipamentos"
              actionLabel="Adicionar Primeiro Equipamento"
              onAction={() => console.log('Add equipment')}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
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
