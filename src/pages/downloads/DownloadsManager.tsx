import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  FileText,
  Palette,
  Printer,
  Eye,
  Upload,
  Grid3X3,
  List,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_type: string;
  tags: string[];
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
  size: number;
  metadata: any;
}

const DownloadsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingMaterial, setEditingMaterial] = useState<DownloadMaterial | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch materials
  const { data: materials = [], isLoading, refetch } = useQuery({
    queryKey: ['downloads_storage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloads_storage')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DownloadMaterial[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('downloads_storage')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads_storage'] });
      toast({
        title: "Material excluído",
        description: "Material removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o material.",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DownloadMaterial> }) => {
      const { error } = await supabase
        .from('downloads_storage')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads_storage'] });
      setEditingMaterial(null);
      toast({
        title: "Material atualizado",
        description: "Informações salvas com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
      });
    }
  });

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    const matchesFileType = fileTypeFilter === 'all' || material.file_type === fileTypeFilter;
    
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'arte-digital':
        return { 
          icon: <Palette className="h-4 w-4" />, 
          label: 'Arte Digital', 
          color: 'text-aurora-electric-purple border-aurora-electric-purple/30 bg-aurora-electric-purple/10' 
        };
      case 'para-impressao':
        return { 
          icon: <Printer className="h-4 w-4" />, 
          label: 'Para Impressão', 
          color: 'text-aurora-emerald border-aurora-emerald/30 bg-aurora-emerald/10' 
        };
      default:
        return { 
          icon: <FileText className="h-4 w-4" />, 
          label: 'Outro', 
          color: 'text-white/60 border-white/30 bg-white/5' 
        };
    }
  };

  const handleEdit = (material: DownloadMaterial) => {
    setEditingMaterial(material);
    setEditForm({
      title: material.title,
      description: material.description,
      category: material.category,
      tags: material.tags.join(', '),
    });
  };

  const handleSaveEdit = () => {
    if (!editingMaterial) return;
    
    updateMutation.mutate({
      id: editingMaterial.id,
      updates: {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      }
    });
  };

  const handleDownload = (material: DownloadMaterial) => {
    const link = document.createElement('a');
    link.href = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.file_url}`;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="aurora-glass animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] bg-white/20 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/20 rounded"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="aurora-heading text-3xl font-bold text-white">
              Gerenciar Materiais
            </h1>
            <p className="aurora-body text-white/70 mt-2">
              Administre e organize seus materiais de marketing
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => window.location.href = '/downloads/batch'}
              className="aurora-button aurora-glow hover:aurora-glow-intense"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Material
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-white">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Título, descrição ou tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-aurora-electric-purple/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="arte-digital">Arte Digital</SelectItem>
                    <SelectItem value="para-impressao">Para Impressão</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Tipo</Label>
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-aurora-electric-purple/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="image">Imagens</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="file">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Visualização</Label>
                <div className="flex bg-slate-800/50 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{filteredMaterials.length} materiais</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredMaterials.map((material, index) => {
                const categoryInfo = getCategoryInfo(material.category);
                
                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="aurora-glass border-aurora-electric-purple/30 aurora-glow hover:border-aurora-electric-purple/50 transition-all duration-300 hover:scale-105 group">
                      <CardContent className="p-0">
                        {/* Thumbnail */}
                        <div className="relative aspect-[16/9] rounded-t-lg overflow-hidden bg-black/20">
                          {material.thumbnail_url ? (
                            <img 
                              src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.thumbnail_url}`}
                              alt={material.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-12 w-12 text-white/40" />
                            </div>
                          )}
                          
                          {/* Actions overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDownload(material)}
                              className="aurora-button aurora-glow hover:aurora-glow-intense"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(material)}
                              className="border-white/30 text-white hover:bg-white/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Category badge */}
                          <div className="absolute top-2 right-2">
                            <Badge className={categoryInfo.color}>
                              <div className="flex items-center gap-1">
                                {categoryInfo.icon}
                                {categoryInfo.label}
                              </div>
                            </Badge>
                          </div>

                          {/* Actions menu */}
                          <div className="absolute top-2 left-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                                  <MoreVertical className="h-4 w-4 text-white" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-800 border-aurora-electric-purple/30">
                                <DropdownMenuItem onClick={() => handleEdit(material)} className="text-white hover:bg-aurora-electric-purple/20">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(material)} className="text-white hover:bg-aurora-emerald/20">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteMutation.mutate(material.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="aurora-heading font-semibold text-white mb-2 line-clamp-2">
                            {material.title}
                          </h3>
                          
                          {material.description && (
                            <p className="aurora-body text-white/70 text-sm mb-3 line-clamp-2">
                              {material.description}
                            </p>
                          )}

                          {/* Tags */}
                          {material.tags && material.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {material.tags.slice(0, 3).map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline" 
                                  className="border-aurora-neon-blue/30 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {material.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-white/30 text-white/60">
                                  +{material.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(material.created_at).toLocaleDateString('pt-BR')}
                            </div>
                            <Badge variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30 text-xs">
                              {material.file_type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredMaterials.map((material, index) => {
                const categoryInfo = getCategoryInfo(material.category);
                
                return (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            {material.thumbnail_url ? (
                              <img 
                                src={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/downloads/${material.thumbnail_url}`}
                                alt={material.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                                <FileText className="h-8 w-8 text-white/40" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="aurora-heading font-semibold text-white truncate">
                                  {material.title}
                                </h3>
                                {material.description && (
                                  <p className="aurora-body text-white/70 text-sm mt-1 line-clamp-2">
                                    {material.description}
                                  </p>
                                )}
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownload(material)}
                                  className="text-aurora-emerald hover:bg-aurora-emerald/20"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(material)}
                                  className="text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteMutation.mutate(material.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Meta info */}
                            <div className="flex items-center gap-4 mt-3">
                              <Badge className={categoryInfo.color}>
                                <div className="flex items-center gap-1">
                                  {categoryInfo.icon}
                                  {categoryInfo.label}
                                </div>
                              </Badge>
                              
                              <Badge variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30">
                                {material.file_type.toUpperCase()}
                              </Badge>

                              <span className="text-xs text-white/60 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(material.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>

                            {/* Tags */}
                            {material.tags && material.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {material.tags.slice(0, 5).map((tag, index) => (
                                  <Badge 
                                    key={index}
                                    variant="outline" 
                                    className="border-aurora-neon-blue/30 text-aurora-neon-blue bg-aurora-neon-blue/5 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {material.tags.length > 5 && (
                                  <Badge variant="outline" className="text-xs border-white/30 text-white/60">
                                    +{material.tags.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 aurora-glass rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-aurora-electric-purple" />
            </div>
            <h3 className="aurora-heading text-lg font-semibold text-white mb-2">
              {searchTerm || categoryFilter !== 'all' || fileTypeFilter !== 'all' 
                ? 'Nenhum material encontrado' 
                : 'Nenhum material cadastrado'
              }
            </h3>
            <p className="aurora-body text-white/60 mb-4">
              {searchTerm || categoryFilter !== 'all' || fileTypeFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece enviando seus primeiros materiais de marketing.'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && fileTypeFilter === 'all' && (
              <Button 
                onClick={() => window.location.href = '/downloads/batch'}
                className="aurora-button aurora-glow hover:aurora-glow-intense"
              >
                <Plus className="h-4 w-4 mr-2" />
                Enviar Primeiro Material
              </Button>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
          <DialogContent className="max-w-md bg-slate-800 border-aurora-electric-purple/30">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Material</DialogTitle>
            </DialogHeader>
            
            {editingMaterial && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Título</Label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-700 border-aurora-electric-purple/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Descrição</Label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-aurora-electric-purple/30 text-white"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Categoria</Label>
                  <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-slate-700 border-aurora-electric-purple/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-aurora-electric-purple/30">
                      <SelectItem value="arte-digital">Arte Digital</SelectItem>
                      <SelectItem value="para-impressao">Para Impressão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Tags</Label>
                  <Input
                    value={editForm.tags}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Separe por vírgula"
                    className="bg-slate-700 border-aurora-electric-purple/30 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveEdit}
                    disabled={updateMutation.isPending}
                    className="aurora-button aurora-glow hover:aurora-glow-intense"
                  >
                    {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default DownloadsManager;