
import React, { useState } from 'react';
import { Wrench, Plus, Sparkles, Zap, FileText, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEquipments } from '@/hooks/useEquipments';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import SearchAndFilters from '@/components/layout/SearchAndFilters';
import EquipmentGrid from '@/components/equipment/EquipmentGrid';
import EquipmentList from '@/components/equipment/EquipmentList';
import ScientificArticlesUserManager from '@/components/scientific-articles/ScientificArticlesUserManager';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useUserVideos } from '@/hooks/useUserVideos';
import { useUserEquipments } from '@/hooks/useUserEquipments';
import { EmptyState } from '@/components/ui/empty-state';

const EquipmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('equipments');
  const { equipments, loading, error } = useEquipments();
  const { photos } = useUserPhotos();
  const { videos } = useUserVideos();

  const filteredEquipments = equipments.filter(equipment =>
    equipment.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.tecnologia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipment.beneficios?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadges = [
    {
      icon: Sparkles,
      label: `${filteredEquipments.length} Equipamentos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-glow-emerald'
    },
    {
      icon: Image,
      label: `${photos.length} Fotos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30 aurora-glow-blue'
    },
    {
      icon: Video,
      label: `${videos.length} Vídeos`,
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 aurora-glow'
    }
  ];

  if (error) {
    return (
      <AuroraPageLayout>
        <div className="container mx-auto px-6 py-8">
          <StandardPageHeader
            icon={Wrench}
            title="Equipamentos"
            subtitle="Erro ao carregar equipamentos"
          />
          <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-red-400 mx-auto mb-4 opacity-50" />
              <h3 className="aurora-heading text-xl text-white mb-2">Erro ao carregar</h3>
              <p className="aurora-body text-red-400 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="aurora-button aurora-glow hover:aurora-glow-intense"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  return (
    <AuroraPageLayout>
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-aurora-electric-purple/20 rounded-full blur-3xl animate-aurora-float"></div>
        <div className="absolute -top-1/4 -right-1/4 w-80 h-80 bg-aurora-neon-blue/20 rounded-full blur-3xl animate-aurora-pulse delay-700"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-72 h-72 bg-aurora-emerald/20 rounded-full blur-3xl animate-aurora-wave delay-1000"></div>
      </div>

      <div className="relative z-10">
        <StandardPageHeader
          icon={Wrench}
          title="Equipamentos"
          subtitle="Descubra nossa coleção de equipamentos de última geração"
          statusBadges={statusBadges}
        />

        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-4 mb-6 aurora-glass rounded-xl">
              <TabsTrigger value="equipments" className="aurora-tab-trigger">
                <Wrench className="h-4 w-4 mr-2" />
                Equipamentos
              </TabsTrigger>
              <TabsTrigger value="articles" className="aurora-tab-trigger">
                <FileText className="h-4 w-4 mr-2" />
                Artigos
              </TabsTrigger>
              <TabsTrigger value="photos" className="aurora-tab-trigger">
                <Image className="h-4 w-4 mr-2" />
                Fotos
              </TabsTrigger>
              <TabsTrigger value="videos" className="aurora-tab-trigger">
                <Video className="h-4 w-4 mr-2" />
                Vídeos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="equipments">
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

              {loading ? (
                <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
                  <div className="text-center py-16">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="aurora-sphere-outer w-16 h-16 rounded-full relative">
                        <div className="aurora-sphere-middle absolute inset-2 rounded-full bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue animate-spin">
                          <div className="aurora-sphere-core absolute inset-2 rounded-full bg-gradient-to-r from-aurora-neon-blue to-aurora-emerald">
                            <div className="aurora-sphere-nucleus absolute inset-4 rounded-full bg-white animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="aurora-body text-white/80 aurora-shimmer">Carregando equipamentos...</p>
                  </div>
                </div>
              ) : filteredEquipments.length === 0 ? (
                <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8">
                  <EmptyState
                    icon={Wrench}
                    title={searchTerm ? "Nenhum equipamento encontrado" : "Nenhum equipamento disponível"}
                    description={searchTerm ? `Não encontramos equipamentos para "${searchTerm}"` : "Comece adicionando seus primeiros equipamentos"}
                    actionLabel={searchTerm ? "Limpar busca" : "Adicionar Primeiro Equipamento"}
                    onAction={() => searchTerm ? setSearchTerm('') : console.log('Add equipment')}
                  />
                </div>
              ) : (
                <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8 aurora-glow backdrop-blur-xl">
                  {viewMode === 'grid' ? (
                    <EquipmentGrid equipments={filteredEquipments} />
                  ) : (
                    <EquipmentList equipments={filteredEquipments} />
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="articles">
              <ScientificArticlesUserManager />
            </TabsContent>

            <TabsContent value="photos">
              <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8 aurora-glow backdrop-blur-xl">
                <iframe 
                  src="/photos" 
                  className="w-full h-[800px] rounded-xl border-0"
                  title="Fotos"
                />
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="aurora-glass rounded-3xl border border-aurora-electric-purple/30 p-8 aurora-glow backdrop-blur-xl">
                <iframe 
                  src="/videos" 
                  className="w-full h-[800px] rounded-xl border-0"
                  title="Vídeos"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default EquipmentsPage;
