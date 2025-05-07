
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  Pencil,
  Save,
  Search,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { StoredVideo } from '@/types/video-storage';
import { getVideos, updateVideo, deleteVideo } from '@/services/videoStorageService';
import { usePermissions } from '@/hooks/use-permissions';
import { useNavigate } from 'react-router-dom';
import { useEquipments } from '@/hooks/useEquipments';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface EditableVideo extends StoredVideo {
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  editEquipmentId: string;
  editTags: string[];
  originalEquipmentId?: string;
}

const VideoBatchManage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const { equipments } = useEquipments();
  const [videos, setVideos] = useState<EditableVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchEquipmentId, setBatchEquipmentId] = useState<string>('');
  const [showBatchEditDialog, setShowBatchEditDialog] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Acesso Restrito",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive"
      });
      navigate('/videos');
      return;
    }
    
    loadVideos();
  }, [isAdmin, navigate]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await getVideos();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Transform videos to add editing state
      const editableVideos: EditableVideo[] = await Promise.all(response.videos.map(async (video) => {
        // Extract equipment ID from metadata
        let equipmentId = 'none';
        if (video.metadata && (video.metadata as any).equipment_id) {
          equipmentId = (video.metadata as any).equipment_id;
        }
        
        return {
          ...video,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editTags: [...video.tags],
          editEquipmentId: equipmentId,
          originalEquipmentId: equipmentId === 'none' ? undefined : equipmentId
        };
      }));
      
      setVideos(editableVideos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar vídeos",
        description: error.message || "Ocorreu um erro ao carregar a lista de vídeos."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(v => v.id));
    }
  };

  const handleSelect = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };
  
  const handleEdit = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isEditing: true
        };
      }
      return video;
    }));
  };
  
  const handleSave = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    try {
      // Update video basic info
      const updateResult = await updateVideo(videoId, {
        title: video.editTitle,
        description: video.editDescription,
        tags: video.editTags,
      });
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
      
      // If equipment changed, update the metadata
      if (video.editEquipmentId !== video.originalEquipmentId) {
        if (video.editEquipmentId === 'none') {
          // Remove equipment association
          await supabase.from('videos_storage')
            .update({
              metadata: {
                ...(video.metadata || {}),
                equipment_id: null
              }
            })
            .eq('id', videoId);
            
          // Also remove from videos table if applicable
          await supabase.from('videos')
            .update({
              equipment_id: null
            })
            .eq('id', videoId);
        } else {
          // Add/update equipment association
          const selectedEquipment = equipments.find(eq => eq.id === video.editEquipmentId);
          
          await supabase.from('videos_storage')
            .update({
              metadata: {
                ...(video.metadata || {}),
                equipment_id: video.editEquipmentId
              }
            })
            .eq('id', videoId);
            
          // Update videos table if applicable
          if (selectedEquipment) {
            // Check if record exists in videos table
            const { data: existingVideo } = await supabase
              .from('videos')
              .select()
              .eq('id', videoId)
              .single();
              
            if (existingVideo) {
              await supabase.from('videos')
                .update({
                  equipment_id: video.editEquipmentId,
                  equipamentos: [selectedEquipment.nome]
                })
                .eq('id', videoId);
            } else {
              // Create record if it doesn't exist
              await supabase.from('videos')
                .insert({
                  id: videoId,
                  titulo: video.title,
                  descricao: video.description,
                  url_video: video.file_urls?.original || '',
                  equipamentos: [selectedEquipment.nome],
                  equipment_id: video.editEquipmentId
                });
            }
          }
        }
      }
      
      // Update local state
      setVideos(videos.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            title: v.editTitle,
            description: v.editDescription,
            tags: v.editTags,
            isEditing: false,
            originalEquipmentId: v.editEquipmentId === 'none' ? undefined : v.editEquipmentId
          };
        }
        return v;
      }));
      
      toast({
        title: "Vídeo atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar alterações",
        description: error.message || "Não foi possível salvar as alterações."
      });
    }
  };
  
  const handleCancel = (videoId: string) => {
    setVideos(videos.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          isEditing: false,
          editTitle: video.title,
          editDescription: video.description || '',
          editTags: [...video.tags],
          editEquipmentId: video.originalEquipmentId || 'none'
        };
      }
      return video;
    }));
  };
  
  const handleDelete = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const result = await deleteVideo(videoId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setVideos(videos.filter(v => v.id !== videoId));
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
      
      toast({
        title: "Vídeo excluído",
        description: "O vídeo foi excluído permanentemente."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir vídeo",
        description: error.message || "Não foi possível excluir o vídeo."
      });
    }
  };
  
  const handleBatchDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedVideos.length} vídeos selecionados? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      // Process deletes sequentially to avoid rate limiting
      for (const videoId of selectedVideos) {
        const result = await deleteVideo(videoId);
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      // Update state after all deletes
      setVideos(videos.filter(v => !selectedVideos.includes(v.id)));
      setSelectedVideos([]);
      
      if (failCount === 0) {
        toast({
          title: "Vídeos excluídos",
          description: `${successCount} vídeos foram excluídos com sucesso.`
        });
      } else {
        toast({
          variant: "warning",
          title: "Processo concluído com avisos",
          description: `${successCount} vídeos excluídos, ${failCount} falhas.`
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na operação em lote",
        description: error.message || "Ocorreu um erro durante o processamento."
      });
    }
  };
  
  const handleBatchEquipmentUpdate = async () => {
    if (selectedVideos.length === 0 || !batchEquipmentId) return;
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      const selectedEquipment = batchEquipmentId === 'none' 
        ? null 
        : equipments.find(eq => eq.id === batchEquipmentId);
      
      // Process updates sequentially
      for (const videoId of selectedVideos) {
        try {
          if (batchEquipmentId === 'none') {
            // Remove equipment association
            await supabase.from('videos_storage')
              .update({
                metadata: {
                  equipment_id: null
                }
              })
              .eq('id', videoId);
              
            // Also remove from videos table if applicable
            await supabase.from('videos')
              .update({
                equipment_id: null,
                equipamentos: []
              })
              .eq('id', videoId);
          } else if (selectedEquipment) {
            // Add/update equipment association
            await supabase.from('videos_storage')
              .update({
                metadata: {
                  equipment_id: batchEquipmentId
                }
              })
              .eq('id', videoId);
              
            // Check if record exists in videos table
            const { data: existingVideo } = await supabase
              .from('videos')
              .select()
              .eq('id', videoId)
              .single();
              
            if (existingVideo) {
              await supabase.from('videos')
                .update({
                  equipment_id: batchEquipmentId,
                  equipamentos: [selectedEquipment.nome]
                })
                .eq('id', videoId);
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error updating video ${videoId}:`, error);
          failCount++;
        }
      }
      
      // Update local state
      setVideos(videos.map(video => {
        if (selectedVideos.includes(video.id)) {
          return {
            ...video,
            editEquipmentId: batchEquipmentId,
            originalEquipmentId: batchEquipmentId === 'none' ? undefined : batchEquipmentId
          };
        }
        return video;
      }));
      
      setShowBatchEditDialog(false);
      
      if (failCount === 0) {
        toast({
          title: "Equipamentos atualizados",
          description: `${successCount} vídeos foram atualizados com sucesso.`
        });
      } else {
        toast({
          variant: "warning",
          title: "Processo concluído com avisos",
          description: `${successCount} vídeos atualizados, ${failCount} falhas.`
        });
      }
      
      // Reload videos to get fresh data
      loadVideos();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na operação em lote",
        description: error.message || "Ocorreu um erro durante o processamento."
      });
    }
  };

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      (video.description || '').toLowerCase().includes(query) ||
      video.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento em Lote</h1>
            <Button variant="outline" onClick={() => navigate('/videos')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Carregando vídeos...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento em Lote</h1>
          <Button variant="outline" onClick={() => navigate('/videos')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Vídeos</CardTitle>
            <CardDescription>Edite, exclua ou gerencie múltiplos vídeos</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex w-full md:w-1/2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, descrição ou tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 items-center md:ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadVideos}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
                </Button>
              </div>
            </div>
            
            {/* Batch actions */}
            {selectedVideos.length > 0 && (
              <div className="bg-muted mb-4 p-3 rounded-md flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">{selectedVideos.length} selecionados</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedVideos([])}
                  >
                    Limpar seleção
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowBatchEditDialog(true)}
                  >
                    <Pencil className="h-3 w-3 mr-1" /> Editar equipamento
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleBatchDelete}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Excluir
                  </Button>
                </div>
              </div>
            )}
            
            {/* Videos list */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3 flex items-center">
                <div className="flex items-center w-12">
                  <Checkbox 
                    checked={
                      filteredVideos.length > 0 && 
                      selectedVideos.length === filteredVideos.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="flex-1 font-medium">Título</div>
                <div className="hidden md:block w-32 text-center">Equipamento</div>
                <div className="w-32 text-center">Status</div>
                <div className="w-24 text-right">Ações</div>
              </div>
              
              {filteredVideos.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  Nenhum vídeo encontrado.
                </div>
              ) : (
                <div className="divide-y">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="p-3 hover:bg-muted/30">
                      {video.isEditing ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center">
                            <div className="w-12">
                              <Checkbox 
                                checked={selectedVideos.includes(video.id)}
                                onCheckedChange={() => handleSelect(video.id)}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                value={video.editTitle}
                                onChange={(e) => setVideos(videos.map(v => 
                                  v.id === video.id ? { ...v, editTitle: e.target.value } : v
                                ))}
                                placeholder="Título do vídeo"
                              />
                            </div>
                          </div>
                          
                          <div className="ml-12">
                            <div className="mb-2">
                              <Label htmlFor={`desc-${video.id}`} className="mb-1 block text-sm">
                                Descrição
                              </Label>
                              <Textarea
                                id={`desc-${video.id}`}
                                value={video.editDescription}
                                onChange={(e) => setVideos(videos.map(v => 
                                  v.id === video.id ? { ...v, editDescription: e.target.value } : v
                                ))}
                                placeholder="Descrição do vídeo"
                              />
                            </div>
                            
                            <div className="mb-3">
                              <Label htmlFor={`equip-${video.id}`} className="mb-1 block text-sm">
                                Equipamento
                              </Label>
                              <Select
                                value={video.editEquipmentId}
                                onValueChange={(value) => setVideos(videos.map(v => 
                                  v.id === video.id ? { ...v, editEquipmentId: value } : v
                                ))}
                              >
                                <SelectTrigger id={`equip-${video.id}`}>
                                  <SelectValue placeholder="Selecione um equipamento" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Nenhum equipamento</SelectItem>
                                  {equipments.map(eq => (
                                    <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                onClick={() => handleSave(video.id)}
                              >
                                <Save className="h-3 w-3 mr-1" /> Salvar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancel(video.id)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-12">
                            <Checkbox 
                              checked={selectedVideos.includes(video.id)}
                              onCheckedChange={() => handleSelect(video.id)}
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-medium truncate" title={video.title}>
                              {video.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {video.description || "Sem descrição"}
                            </p>
                          </div>
                          <div className="hidden md:block w-32 text-center text-sm">
                            {video.originalEquipmentId && video.originalEquipmentId !== 'none' ? (
                              equipments.find(eq => eq.id === video.originalEquipmentId)?.nome || 'N/A'
                            ) : (
                              <span className="text-muted-foreground">Nenhum</span>
                            )}
                          </div>
                          <div className="w-32 text-center">
                            <Badge variant={
                              video.status === 'ready' ? 'success' :
                              video.status === 'error' ? 'destructive' :
                              'secondary'
                            }>
                              {video.status === 'ready' ? 'Pronto' :
                               video.status === 'processing' ? 'Processando' :
                               video.status === 'uploading' ? 'Enviando' :
                               'Erro'}
                            </Badge>
                          </div>
                          <div className="w-24 text-right flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(video.id)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(video.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {filteredVideos.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-right">
                Total: {filteredVideos.length} vídeos
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={showBatchEditDialog} onOpenChange={setShowBatchEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar equipamento</DialogTitle>
              <DialogDescription>
                Selecione um equipamento para associar aos {selectedVideos.length} vídeos selecionados.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Select value={batchEquipmentId} onValueChange={setBatchEquipmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum equipamento</SelectItem>
                  {equipments.map(eq => (
                    <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBatchEditDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleBatchEquipmentUpdate} 
                disabled={!batchEquipmentId}
              >
                Aplicar para {selectedVideos.length} vídeos
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default VideoBatchManage;
