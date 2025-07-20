
import React, { useState } from 'react';
import { Palette, Upload, Grid, Search, Filter, Brush, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CarouselViewer from '@/components/downloads/CarouselViewer';

const Arts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownload = (material: any) => {
    const link = document.createElement('a');
    link.href = material.file_url;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <Palette className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Artes Gráficas
              </h1>
              <p className="text-slate-400 aurora-body">
                Crie e gerencie artes para suas campanhas de marketing
              </p>
            </div>
          </div>
        </div>

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
                  <div key={material.id} className="group">
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden aurora-glass">
                      {material.is_carousel ? (
                        <CarouselViewer 
                          images={material.carousel_images || []} 
                          title={material.title}
                        />
                      ) : (
                        <img
                          src={material.thumbnail_url || material.file_url}
                          alt={material.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleDownload(material)} className="aurora-button">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="font-medium text-slate-200 group-hover:text-aurora-electric-purple transition-colors duration-200 line-clamp-1">
                        {material.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {material.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1 flex-wrap">
                          {material.tags?.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(material.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default Arts;
