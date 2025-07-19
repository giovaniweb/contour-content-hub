import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Download, Search, Calendar, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EquipmentArtsTabProps {
  equipmentId: string;
  equipmentName: string;
}

interface Photo {
  id: string;
  titulo: string;
  descricao_curta?: string;
  categoria?: string;
  tags?: string[];
  url_imagem: string;
  thumbnail_url?: string;
  downloads_count: number;
  favoritos_count: number;
  data_upload: string;
}

export const EquipmentArtsTab: React.FC<EquipmentArtsTabProps> = ({ 
  equipmentId, 
  equipmentName 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArt, setSelectedArt] = useState<Photo | null>(null);

  const { data: arts, isLoading, error } = useQuery({
    queryKey: ['equipment-arts', equipmentId],
    queryFn: async () => {
      // Buscar fotos que tenham categoria "arte" ou tags relacionadas
      const { data, error } = await supabase
        .from('fotos')
        .select('*')
        .or(`categoria.eq.arte,categoria.eq.design,tags.cs.{"arte","design","criativo"}`)
        .order('data_upload', { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
  });

  const filteredArts = arts?.filter(art =>
    art.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.descricao_curta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDownload = (art: Photo) => {
    if (art.url_imagem) {
      const link = document.createElement('a');
      link.href = art.url_imagem;
      link.download = `${art.titulo}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Artes e Design</h2>
          <p className="text-muted-foreground">
            {filteredArts.length} arte(s) relacionada(s) ao {equipmentName}
          </p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-[300px]"
          />
        </div>
      </div>

      {filteredArts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma arte encontrada</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? 'Nenhuma arte corresponde aos critérios de busca' 
                : `Ainda não há artes relacionadas ao ${equipmentName}`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArts.map((art) => (
            <Card key={art.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={art.thumbnail_url || art.url_imagem}
                  alt={art.titulo}
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
                        <DialogTitle>{art.titulo}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <img
                          src={art.url_imagem}
                          alt={art.titulo}
                          className="w-full h-auto max-h-[60vh] object-contain"
                        />
                        {art.descricao_curta && (
                          <p className="text-muted-foreground">{art.descricao_curta}</p>
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
                    onClick={() => handleDownload(art)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="p-3">
                <CardTitle className="text-sm leading-tight line-clamp-2">
                  {art.titulo}
                </CardTitle>
                <CardDescription className="text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(art.data_upload).toLocaleDateString()}
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
                    <span>{art.downloads_count} downloads</span>
                    <span>{art.favoritos_count} favoritos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};