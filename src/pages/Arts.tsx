
import React, { useState } from 'react';
import { Palette, Upload, Grid, Search, Filter, Brush, Download, Eye, FileText, Wand2, Heart, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselViewer from '@/components/downloads/CarouselViewer';
import CaptionGenerator from '@/components/downloads/CaptionGenerator';
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Arts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipments, setEquipments] = useState<any[]>([]);
  const [likedMaterials, setLikedMaterials] = useState<Set<string>>(new Set());

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

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['arts_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloads_storage')
        .select('*')
        .eq('category', 'arte-digital')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Buscar equipamentos para mostrar nomes
  const { data: equipmentsData } = useQuery({
    queryKey: ['equipments_list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipamentos')
        .select('id, nome')
        .eq('ativo', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  React.useEffect(() => {
    if (equipmentsData) {
      setEquipments(equipmentsData);
    }
  }, [equipmentsData]);

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getEquipmentNames = (equipmentIds: string[]) => {
    if (!equipmentIds || equipmentIds.length === 0) return [];
    return equipmentIds.map(id => {
      const equipment = equipments.find(eq => eq.id === id);
      return equipment?.nome || 'Equipamento';
    });
  };

  const handleDownload = async (material: any) => {
    try {
      // Determinar a URL correta da imagem
      const imageUrl = material.file_url?.includes('http') 
        ? material.file_url
        : `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.file_url}`;
      
      // Fetch da imagem como blob para forçar download
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Criar link de download forçado
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${material.title}.${getFileExtension(material.file_url)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename?.split('.').pop() || 'jpg';
  };

  const handleLike = (materialId: string) => {
    setLikedMaterials(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(materialId)) {
        newLiked.delete(materialId);
      } else {
        newLiked.add(materialId);
      }
      return newLiked;
    });
  };

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Palette}
        title="Artes Gráficas"
        subtitle="Crie e gerencie artes para suas campanhas de marketing"
        statusBadges={statusBadges}
      />

      <div className="space-y-8">

        {/* Controls */}
        <div className="aurora-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar artes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              <Button className="aurora-button">
                <Brush className="h-4 w-4 mr-2" />
                Criar Arte
              </Button>
            </div>
          </div>
        </div>

        {/* Arts Grid */}
        <div className="aurora-card">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple mx-auto"></div>
              <p className="text-slate-400 mt-4">Carregando artes...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-8 text-center py-12">
              <Grid className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                {searchTerm ? 'Nenhuma arte encontrada' : 'Nenhuma arte disponível'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? 'Tente buscar por outros termos' : 'Comece criando suas primeiras artes gráficas'}
              </p>
              <Button className="aurora-button">
                <Brush className="h-4 w-4 mr-2" />
                Criar Primeira Arte
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.map((material) => (
                  <div key={material.id} className="group aurora-glass backdrop-blur-md bg-slate-800/30 border border-white/10 rounded-lg overflow-hidden hover:border-aurora-electric-purple/50 transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {/* Photo Count Badge - Top Left */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
                          {material.is_carousel ? `${(material.carousel_images || []).length} fotos` : '1 foto'}
                        </div>
                      </div>

                      {/* Action Buttons - Bottom Right Over Image */}
                      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLike(material.id)}
                            className={`backdrop-blur-sm transition-all duration-200 ${
                              likedMaterials.has(material.id)
                                ? 'bg-aurora-electric-purple/30 border-aurora-electric-purple/60 text-aurora-electric-purple hover:bg-aurora-electric-purple/40'
                                : 'bg-black/60 border-white/30 text-white hover:bg-aurora-electric-purple/30 hover:text-aurora-electric-purple hover:border-aurora-electric-purple/50'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${likedMaterials.has(material.id) ? 'fill-current' : ''}`} />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-black/60 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl bg-slate-900 border-aurora-electric-purple/30">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                  <Eye className="h-5 w-5 text-aurora-electric-purple" />
                                  {material.title}
                                </DialogTitle>
                              </DialogHeader>
                              
                              {material.is_carousel ? (
                                <CarouselViewer 
                                  images={material.carousel_images || []} 
                                  title={material.title}
                                  material={material}
                                  equipments={equipments}
                                />
                              ) : (
                                <CarouselViewer 
                                  images={[material.file_url]} 
                                  title={material.title}
                                  material={material}
                                  equipments={equipments}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" onClick={() => handleDownload(material)} className="bg-aurora-electric-purple/80 border-aurora-electric-purple text-white hover:bg-aurora-electric-purple backdrop-blur-sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {material.is_carousel ? (
                        <CarouselViewer 
                          images={material.carousel_images || []} 
                          title={material.title}
                          material={material}
                          equipments={equipments}
                        />
                      ) : (
                        <img
                          src={material.thumbnail_url?.includes('http') 
                            ? material.thumbnail_url 
                            : material.thumbnail_url 
                              ? `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.thumbnail_url}`
                              : material.file_url?.includes('http')
                                ? material.file_url
                                : `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.file_url}`
                          }
                          alt={material.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes(material.thumbnail_url || '')) {
                              const fallbackUrl = material.file_url?.includes('http') 
                                ? material.file_url
                                : `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.file_url}`;
                              target.src = fallbackUrl;
                            } else {
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDEwOEgxMTJMMTQ0IDcyWiIgZmlsbD0iIzU1NSIvPgo8Y2lyY2xlIGN4PSIxMzYiIGN5PSI2NCIgcj0iMTIiIGZpbGw9IiM1NTUiLz4KPHN2Zz4K';
                            }
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      {/* Title */}
                      <h3 className="font-semibold text-white group-hover:text-aurora-electric-purple transition-colors duration-200 line-clamp-2">
                        {material.title}
                      </h3>
                      
                      {/* Equipment Tags */}
                      {material.equipment_ids && material.equipment_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {getEquipmentNames(material.equipment_ids).slice(0, 2).map((equipName, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-aurora-neon-blue/20 text-aurora-neon-blue rounded-full border border-aurora-neon-blue/30"
                            >
                              {equipName}
                            </span>
                          ))}
                          {material.equipment_ids.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded-full border border-slate-600/30">
                              +{material.equipment_ids.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Date - Bottom Right */}
                      <div className="flex justify-end pt-2">
                        <span className="text-xs text-slate-400">
                          {new Date(material.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuroraPageLayout>
  );
};

export default Arts;
