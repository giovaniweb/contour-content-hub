import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { photoService, Photo, UpdatePhotoData } from '@/services/photoService';
import AppLayout from '@/components/layout/AppLayout';
import TagInput from '@/components/ui/TagInput';

const AdminPhotoEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState<UpdatePhotoData>({
    titulo: '',
    descricao_curta: '',
    categoria: '',
    tags: []
  });

  useEffect(() => {
    if (id) {
      loadPhoto();
    }
  }, [id]);

  const loadPhoto = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await photoService.getAllPhotos();
      
      if (error) {
        toast({
          title: "Erro ao carregar foto",
          description: error,
          variant: "destructive"
        });
        navigate('/admin/photos');
        return;
      }
      
      const foundPhoto = data?.find(p => p.id === id);
      if (!foundPhoto) {
        toast({
          title: "Foto não encontrada",
          description: "A foto solicitada não foi encontrada.",
          variant: "destructive"
        });
        navigate('/admin/photos');
        return;
      }
      
      setPhoto(foundPhoto);
      setFormData({
        titulo: foundPhoto.titulo,
        descricao_curta: foundPhoto.descricao_curta || '',
        categoria: foundPhoto.categoria || '',
        tags: foundPhoto.tags || []
      });
    } catch (error) {
      console.error('Erro ao carregar foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar a foto.",
        variant: "destructive"
      });
      navigate('/admin/photos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !photo) return;
    
    try {
      setSaving(true);
      const { data, error } = await photoService.updatePhoto(id, formData);
      
      if (error) {
        toast({
          title: "Erro ao salvar",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Foto atualizada",
        description: "A foto foi atualizada com sucesso."
      });
      
      navigate('/admin/photos');
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a foto.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      const { error } = await photoService.deletePhoto(id);
      
      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Foto excluída",
        description: "A foto foi excluída com sucesso."
      });
      
      navigate('/admin/photos');
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a foto.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleInputChange = (field: keyof UpdatePhotoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <AppLayout requireAdmin={true}>
        <div className="container mx-auto py-6">
          <div className="space-y-6">
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
            <Card>
              <CardHeader>
                <div className="h-6 bg-slate-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-20 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!photo) {
    return (
      <AppLayout requireAdmin={true}>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-50 mb-4">Foto não encontrada</h1>
            <Button onClick={() => navigate('/admin/photos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Fotos
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout requireAdmin={true}>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/photos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-slate-50">Editar Foto</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
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
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview da foto */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="text-foreground">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-700/50 rounded-lg overflow-hidden">
                <img
                  src={photo.thumbnail_url || photo.url_imagem}
                  alt={photo.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p><span className="text-slate-300">ID:</span> {photo.id}</p>
                <p><span className="text-slate-300">Criado:</span> {new Date(photo.created_at).toLocaleString('pt-BR')}</p>
                <p><span className="text-slate-300">Atualizado:</span> {new Date(photo.updated_at).toLocaleString('pt-BR')}</p>
                <p><span className="text-slate-300">Downloads:</span> {photo.downloads_count || 0}</p>
                <p><span className="text-slate-300">Favoritos:</span> {photo.favoritos_count || 0}</p>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de edição */}
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="text-foreground">Informações da Foto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Digite o título da foto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao_curta">Descrição</Label>
                <Textarea
                  id="descricao_curta"
                  value={formData.descricao_curta}
                  onChange={(e) => handleInputChange('descricao_curta', e.target.value)}
                  placeholder="Digite a descrição da foto"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  placeholder="Digite a categoria da foto"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput
                  value={formData.tags || []}
                  onChange={(tags) => handleInputChange('tags', tags)}
                  placeholder="Digite as tags separadas por vírgula"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPhotoEdit;