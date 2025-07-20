import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Heart, Download, Archive, Check, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface EquipmentArtsTabProps {
  equipmentId: string;
  equipmentName: string;
}

interface MaterialArt {
  id: string;
  titulo: string;
  descricao?: string;
  categoria?: string;
  tags?: string[];
  arquivo_url: string;
  preview_url?: string;
  downloads_count?: number;
  favoritos_count?: number;
  data_upload: string;
  file_type?: string;
  size?: number;
  // Campos da tabela materiais
  nome?: string;
  tipo?: string;
}

export const EquipmentArtsTab: React.FC<EquipmentArtsTabProps> = ({ 
  equipmentId, 
  equipmentName 
}) => {
  const [selectedArt, setSelectedArt] = useState<MaterialArt | null>(null);
  const [likedArts, setLikedArts] = useState<Set<string>>(new Set());
  const [selectedArts, setSelectedArts] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: arts, isLoading, error } = useQuery({
    queryKey: ['equipment-arts', equipmentId, equipmentName],
    queryFn: async () => {
      console.log('🎨 Buscando artes para equipamento:', equipmentName);
      
      // Buscar fotos que tenham categoria igual ao nome do equipamento ou categorias de arte/design/marketing
      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .or(`categoria.eq.${equipmentName},categoria.eq.arte,categoria.eq.design,categoria.eq.marketing,tags.cs.{"${equipmentName}"},tags.cs.{"arte"},tags.cs.{"design"},tags.cs.{"marketing"}`)
        .order('data_upload', { ascending: false });

      console.log('🎨 Query result:', { data, error, equipmentName });

      if (error) throw error;
      
      const mappedData = data?.map((item: any) => ({
        ...item,
        titulo: item.titulo || item.nome || 'Sem título',
        downloads_count: item.downloads_count || 0,
        favoritos_count: item.favoritos_count || 0,
        arquivo_url: item.url_imagem, // usar url_imagem como arquivo_url
        preview_url: item.thumbnail_url
      })) as MaterialArt[];
      
      console.log('🎨 Mapped data:', mappedData);
      return mappedData;
    },
  });

  // Filtrar artes pelo equipamento
  const filteredArts = useMemo(() => {
    if (!arts) return [];
    
    console.log('🎨 Filtering arts:', { arts, equipmentName });
    
    const filtered = arts.filter(art => 
      art.categoria === equipmentName ||
      art.tags?.includes(equipmentName) || 
      art.categoria === 'arte' ||
      art.categoria === 'design' ||
      art.categoria === 'marketing'
    );
    
    console.log('🎨 Filtered arts result:', filtered);
    return filtered;
  }, [arts, equipmentName]);

  // Carregar contagem de curtidas
  useEffect(() => {
    const loadLikesCount = async () => {
      if (filteredArts.length === 0) return;
      
      const { data, error } = await supabase
        .from('favoritos')
        .select('foto_id')
        .in('foto_id', filteredArts.map(a => a.id))
        .eq('tipo', 'material');
      
      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(like => {
          counts[like.foto_id] = (counts[like.foto_id] || 0) + 1;
        });
        setLikesCount(counts);
      }
    };
    
    loadLikesCount();
  }, [filteredArts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleLike = async (artId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (likedArts.has(artId)) {
      toast({
        title: "Arte já curtida",
        description: "Você já curtiu esta arte anteriormente.",
      });
      return;
    }

    try {
      setLikedArts(prev => new Set(prev).add(artId));
      setLikesCount(prev => ({
        ...prev,
        [artId]: (prev[artId] || 0) + 1
      }));
      toast({
        title: "Arte curtida!",
        description: "Obrigado por curtir esta arte.",
      });
    } catch (error) {
      console.error('Error liking art:', error);
    }
  };

  const downloadFile = async (url: string, filename: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao baixar ${filename}`);
    }
    return response.blob();
  };

  const handleSingleDownload = async (artUrl: string, artTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setIsDownloading(true);
      const blob = await downloadFile(artUrl, artTitle);
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${artTitle}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast({
        title: "Download concluído",
        description: "O download da arte foi concluído.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a arte.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMultipleDownload = async () => {
    if (selectedArts.size === 0) {
      toast({
        title: "Nenhuma arte selecionada",
        description: "Selecione pelo menos uma arte para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDownloading(true);
      const zip = new JSZip();
      
      const selectedArtsList = filteredArts.filter(a => selectedArts.has(a.id));
      
      for (const art of selectedArtsList) {
        try {
          const blob = await downloadFile(art.arquivo_url, art.titulo || art.nome || 'arquivo');
          zip.file(`${art.titulo || art.nome || 'arquivo'}`, blob);
        } catch (error) {
          console.error(`Erro ao baixar ${art.titulo || art.nome}:`, error);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `artes_${equipmentName}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      setSelectedArts(new Set());
      
      toast({
        title: "Download concluído",
        description: `${selectedArtsList.length} artes foram baixadas em um arquivo ZIP.`,
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível criar o arquivo ZIP.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleArtSelection = (artId: string) => {
    setSelectedArts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artId)) {
        newSet.delete(artId);
      } else {
        newSet.add(artId);
      }
      return newSet;
    });
  };

  const selectAllArts = () => {
    const allArtIds = filteredArts.map(a => a.id);
    setSelectedArts(new Set(allArtIds));
  };

  const clearSelection = () => {
    setSelectedArts(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando artes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar artes</p>
      </div>
    );
  }

  if (filteredArts.length === 0) {
    return (
      <EmptyState
        icon={Palette}
        title="Nenhuma arte encontrada"
        description={`Ainda não há materiais artísticos cadastrados para este equipamento.`}
        actionLabel="Ver todas as artes"
        onAction={() => window.open('/arts', '_blank')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="text-slate-300 text-sm">
          {filteredArts.length} arte(s) relacionada(s) ao equipamento "{equipmentName}"
        </div>
        
        <div className="flex items-center gap-2">
          {selectedArts.size > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMultipleDownload}
                disabled={isDownloading}
                className="aurora-button rounded-xl"
              >
                <Archive className="h-4 w-4 mr-1" />
                {isDownloading ? 'Baixando...' : `Baixar ${selectedArts.size} ZIP`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="rounded-xl border-red-400/30 text-red-400 hover:bg-red-400/20"
              >
                Limpar
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={selectedArts.size > 0 ? clearSelection : selectAllArts}
            className="aurora-button rounded-xl"
          >
            {selectedArts.size > 0 ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </Button>
        </div>
      </div>

      {/* Grid de Artes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredArts.map((art) => (
          <Card key={art.id} className="hover:shadow-md transition-shadow overflow-hidden">
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <Checkbox
                checked={selectedArts.has(art.id)}
                onCheckedChange={() => toggleArtSelection(art.id)}
                className="bg-black/50 border-cyan-400/50"
              />
            </div>

            <div className="aspect-square relative overflow-hidden">
              <img
                src={art.preview_url || art.arquivo_url}
                alt={art.titulo || art.nome || 'Arte'}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedArt(art)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>{art.titulo || art.nome}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img
                        src={art.arquivo_url}
                        alt={art.titulo || art.nome || 'Arte'}
                        className="w-full h-auto max-h-[60vh] object-contain"
                      />
                      {art.descricao && (
                        <p className="text-muted-foreground">{art.descricao}</p>
                      )}
                      {art.tags && art.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {art.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleLike(art.id, e)}
                  className="h-8 w-8 p-0"
                >
                  <Heart className={`h-3 w-3 ${likedArts.has(art.id) ? 'fill-current text-pink-400' : ''}`} />
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleSingleDownload(art.arquivo_url, art.titulo || art.nome || 'arquivo', e)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <CardHeader className="p-3">
              <CardTitle className="text-sm leading-tight line-clamp-2">
                {art.titulo || art.nome}
              </CardTitle>
              <CardDescription className="text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(art.data_upload)}
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                {art.categoria && (
                  <Badge variant="outline" className="text-xs">
                    {art.categoria}
                  </Badge>
                )}
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {likesCount[art.id] || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {art.downloads_count || 0}
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-xs"
                      onClick={() => setSelectedArt(art)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>{art.titulo || art.nome}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img
                        src={art.arquivo_url}
                        alt={art.titulo || art.nome || 'Arte'}
                        className="w-full h-auto max-h-[60vh] object-contain"
                      />
                      {art.descricao && (
                        <p className="text-muted-foreground">{art.descricao}</p>
                      )}
                      {art.tags && art.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {art.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};