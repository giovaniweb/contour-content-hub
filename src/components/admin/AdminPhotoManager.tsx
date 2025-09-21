import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, Camera, Heart, Download, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { photoService, Photo } from '@/services/photoService';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';

const AdminPhotoManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState('');
  // Remover uso do hook antigo - não é necessário aqui

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [searchQuery, selectedCategory]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await photoService.getAllPhotos({
        search: searchQuery,
        categoria: selectedCategory
      });
      
      if (error) {
        toast({
          title: "Erro ao carregar fotos",
          description: error,
          variant: "destructive"
        });
      } else {
        setPhotos(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadPhotos();
  };

  const handleDelete = async (photoId: string) => {
    try {
      const { error } = await photoService.deletePhoto(photoId);
      
      if (error) {
        toast({
          title: "Erro ao excluir foto",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Foto excluída",
          description: "A foto foi excluída com sucesso."
        });
        loadPhotos();
      }
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a foto.",
        variant: "destructive"
      });
    }
  };

  const handleView = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsViewDialogOpen(true);
  };

  const handleLike = async (photoId: string) => {
    // Implementar lógica de like específica para admin se necessário
    console.log('Like functionality needs admin implementation');
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url_imagem;
    link.download = `${photo.titulo}.jpg`;
    link.click();
  };

  const handleSelectPhoto = (photoId: string, checked: boolean) => {
    const newSelected = new Set(selectedPhotos);
    if (checked) {
      newSelected.add(photoId);
    } else {
      newSelected.delete(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPhotos(new Set(photos.map(photo => photo.id)));
    } else {
      setSelectedPhotos(new Set());
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedPhotos).map(photoId => photoService.deletePhoto(photoId)));
      toast({
        title: "Fotos excluídas",
        description: `${selectedPhotos.size} fotos foram excluídas com sucesso.`
      });
      setSelectedPhotos(new Set());
      loadPhotos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir as fotos.",
        variant: "destructive"
      });
    }
  };

  const handleBulkCategoryChange = async () => {
    if (!bulkCategory) return;
    try {
      await Promise.all(Array.from(selectedPhotos).map(photoId => 
        photoService.updatePhoto(photoId, { categoria: bulkCategory })
      ));
      toast({
        title: "Categoria atualizada",
        description: `${selectedPhotos.size} fotos foram atualizadas.`
      });
      setSelectedPhotos(new Set());
      setBulkCategory('');
      loadPhotos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as categorias.",
        variant: "destructive"
      });
    }
  };

  const uniqueCategories = Array.from(new Set(photos.map(photo => photo.categoria).filter(Boolean)));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="bg-slate-800/50 border-cyan-500/20">
            <CardContent className="p-0">
              <div className="aspect-video bg-slate-600/50 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-600/50 rounded animate-pulse" />
                <div className="h-3 bg-slate-600/50 rounded w-2/3 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate('/admin/photos/upload')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload de Fotos
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar fotos..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyan-400">{photos.length}</div>
            <div className="text-sm text-slate-400">Total de Fotos</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{photos.length}</div>
            <div className="text-sm text-slate-400">Fotos Filtradas</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-400">{uniqueCategories.length}</div>
            <div className="text-sm text-slate-400">Categorias</div>
          </CardContent>
        </Card>
      </div>

      {/* Ações em lote */}
      {selectedPhotos.size > 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="text-sm text-slate-300">
              {selectedPhotos.size} foto(s) selecionada(s)
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <Select value={bulkCategory} onValueChange={setBulkCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Nova categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category!}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleBulkCategoryChange}
                  disabled={!bulkCategory}
                  variant="outline"
                  size="sm"
                >
                  Alterar Categoria
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Selecionadas
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão em lote</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {selectedPhotos.size} foto(s)? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={() => setSelectedPhotos(new Set())}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Grid de fotos */}
      {photos.length > 0 ? (
        <div className="space-y-4">
          {/* Header com seleção */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedPhotos.size === photos.length && photos.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-slate-300">
              Selecionar todas ({photos.length})
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="bg-slate-800/50 border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-colors group">
                <CardContent className="p-0">
                  {/* Checkbox de seleção */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedPhotos.has(photo.id)}
                      onCheckedChange={(checked) => handleSelectPhoto(photo.id, checked as boolean)}
                      className="bg-white/20 border-white/50"
                    />
                  </div>
                  
                  {/* Image Container */}
                  <div className="relative aspect-video bg-slate-700/50 overflow-hidden">
                    <img
                      src={photo.thumbnail_url || photo.url_imagem}
                      alt={photo.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(photo.id)}
                        className="text-pink-400 border-pink-400/20 hover:bg-pink-400/20"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(photo)}
                        className="text-white border-white/20 hover:bg-white/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(photo)}
                        className="text-green-400 border-green-400/20 hover:bg-green-400/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/photos/edit/${photo.id}`)}
                        className="text-blue-400 border-blue-400/20 hover:bg-blue-400/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-400/20 hover:bg-red-400/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a foto "{photo.titulo}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(photo.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-2 truncate">{photo.titulo}</h3>
                  
                  {photo.descricao_curta && (
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{photo.descricao_curta}</p>
                  )}
                  
                  {/* Tags */}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-500/20 text-slate-400"
                        >
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>{photo.favoritos_count || 0} favoritos</span>
                      <span>{photo.downloads_count || 0} downloads</span>
                    </div>
                    <span>{new Date(photo.data_upload).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhuma foto encontrada</h3>
          <p className="text-slate-400 mb-4">
            {searchQuery || selectedCategory ? 'Nenhuma foto corresponde aos filtros aplicados.' : 'Comece fazendo upload das primeiras fotos.'}
          </p>
          <Button onClick={() => navigate('/admin/photos/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Upload de Fotos
          </Button>
        </div>
      )}

      {/* Dialog de visualização */}
      {selectedPhoto && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedPhoto.titulo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url_imagem}
                  alt={selectedPhoto.titulo}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Categoria:</strong> {selectedPhoto.categoria || 'N/A'}
                </div>
                <div>
                  <strong>Data:</strong> {new Date(selectedPhoto.data_upload).toLocaleDateString()}
                </div>
                <div>
                  <strong>Favoritos:</strong> {selectedPhoto.favoritos_count || 0}
                </div>
                <div>
                  <strong>Downloads:</strong> {selectedPhoto.downloads_count || 0}
                </div>
              </div>
              {selectedPhoto.descricao_curta && (
                <div>
                  <strong>Descrição:</strong>
                  <p className="mt-1">{selectedPhoto.descricao_curta}</p>
                </div>
              )}
              {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPhoto.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPhotoManager;