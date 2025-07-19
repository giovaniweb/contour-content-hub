import React, { useState, useRef } from 'react';
import { Upload, Image, X, Plus, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserEquipments } from '@/hooks/useUserEquipments';

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  titulo: string;
  descricao_curta: string;
  categoria: string;
  tags: string[];
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

const AdminPhotosUpload: React.FC = () => {
  const { toast } = useToast();
  const { equipments } = useUserEquipments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [batchEquipment, setBatchEquipment] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        const newPhoto: PhotoUpload = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          titulo: file.name.replace(/\.[^/.]+$/, ""),
          descricao_curta: '',
          categoria: '',
          tags: [],
          status: 'pending'
        };
        
        setPhotos(prev => [...prev, newPhoto]);
      }
    });
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updatePhoto = (id: string, updates: Partial<PhotoUpload>) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updates } : photo
    ));
  };

  const removePhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const addTag = (photoId: string) => {
    if (!tagInput.trim()) return;
    
    updatePhoto(photoId, {
      tags: [...(photos.find(p => p.id === photoId)?.tags || []), tagInput.trim()]
    });
    setTagInput('');
  };

  const removeTag = (photoId: string, tagIndex: number) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      const newTags = photo.tags.filter((_, index) => index !== tagIndex);
      updatePhoto(photoId, { tags: newTags });
    }
  };

  const applyBatchEquipment = () => {
    if (!batchEquipment) return;
    
    setPhotos(prev => prev.map(photo => ({ 
      ...photo, 
      categoria: batchEquipment 
    })));
    
    toast({
      title: "Equipamento aplicado",
      description: `Equipamento "${batchEquipment}" aplicado a todas as fotos.`,
    });
  };

  // Função para criar thumbnail
  const createThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Definir tamanho do thumbnail (300x300)
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(URL.createObjectURL(file));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadPhoto = async (photo: PhotoUpload): Promise<boolean> => {
    try {
      updatePhoto(photo.id, { status: 'uploading' });

      // Upload da imagem original
      const fileExt = photo.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('aesthetical-images')
        .upload(filePath, photo.file);

      if (uploadError) throw uploadError;

      // Criar e fazer upload do thumbnail
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      let thumbnailUrl = '';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = async () => {
          try {
            // Redimensionar para thumbnail
            const maxSize = 300;
            const ratio = Math.min(maxSize / img.width, maxSize / img.height);
            
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            
            canvas.toBlob(async (blob) => {
              if (blob) {
                const thumbnailFileName = `thumb_${fileName}`;
                const { error: thumbError } = await supabase.storage
                  .from('aesthetical-images')
                  .upload(thumbnailFileName, blob);

                if (!thumbError) {
                  const { data: thumbUrlData } = supabase.storage
                    .from('aesthetical-images')
                    .getPublicUrl(thumbnailFileName);
                  
                  thumbnailUrl = thumbUrlData.publicUrl;
                }
              }
              resolve();
            }, 'image/jpeg', 0.8);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(photo.file);
      });

      // Obter URL pública da imagem original
      const { data: urlData } = supabase.storage
        .from('aesthetical-images')
        .getPublicUrl(filePath);

      // Obter user_id atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('fotos')
        .insert({
          titulo: photo.titulo,
          descricao_curta: photo.descricao_curta,
          url_imagem: urlData.publicUrl,
          thumbnail_url: thumbnailUrl || urlData.publicUrl,
          categoria: photo.categoria,
          tags: photo.tags,
          downloads_count: 0,
          favoritos_count: 0,
          user_id: user.id
        });

      if (dbError) throw dbError;

      updatePhoto(photo.id, { status: 'success' });
      return true;
    } catch (error) {
      console.error('Erro no upload:', error);
      updatePhoto(photo.id, { 
        status: 'error', 
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      return false;
    }
  };

  const handleUploadAll = async () => {
    const pendingPhotos = photos.filter(p => p.status === 'pending');
    
    if (pendingPhotos.length === 0) {
      toast({
        title: "Nenhuma foto para upload",
        description: "Adicione fotos antes de fazer o upload.",
        variant: "destructive"
      });
      return;
    }

    // Validação
    const invalidPhotos = pendingPhotos.filter(p => 
      !p.titulo.trim() || !p.categoria.trim()
    );

    if (invalidPhotos.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e categoria para todas as fotos.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (const photo of pendingPhotos) {
      const success = await uploadPhoto(photo);
      if (success) successCount++;
    }

    setIsUploading(false);

    toast({
      title: "Upload concluído",
      description: `${successCount} de ${pendingPhotos.length} fotos foram enviadas com sucesso.`,
      variant: successCount === pendingPhotos.length ? "default" : "destructive"
    });

    // Remover fotos com sucesso
    setPhotos(prev => prev.filter(p => p.status !== 'success'));
  };

  const getStatusIcon = (status: PhotoUpload['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>;
      case 'success':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Upload className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Upload de Fotos - Admin
          </h1>
          <p className="text-slate-300">
            Faça upload de múltiplas fotos com informações detalhadas
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8 bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Image className="h-5 w-5" />
              Selecionar Fotos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-white mb-2">Clique para selecionar fotos ou arraste aqui</p>
              <p className="text-slate-400 text-sm">Suporta JPG, PNG, WebP</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Upload Queue */}
        {photos.length > 0 && (
          <Card className="mb-8 bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">
                Fotos para Upload ({photos.length})
              </CardTitle>
              <div className="flex gap-3 items-center">
                <div className="flex gap-2 items-center">
                  <Select value={batchEquipment} onValueChange={setBatchEquipment}>
                    <SelectTrigger className="w-48 bg-slate-600/50 border-slate-500 text-white">
                      <SelectValue placeholder="Equipamento em lote" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {equipments.map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.nome} className="text-white">
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={applyBatchEquipment}
                    disabled={!batchEquipment || photos.length === 0}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    Aplicar a Todas
                  </Button>
                </div>
                <Button 
                  onClick={handleUploadAll}
                  disabled={isUploading || photos.every(p => p.status !== 'pending')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {isUploading ? 'Enviando...' : 'Enviar Todas'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="relative w-24 h-24 bg-slate-600 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        {getStatusIcon(photo.status)}
                      </div>
                    </div>

                    {/* Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Título *</label>
                        <Input
                          value={photo.titulo}
                          onChange={(e) => updatePhoto(photo.id, { titulo: e.target.value })}
                          className="bg-slate-600/50 border-slate-500 text-white"
                          placeholder="Nome da foto"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Equipamento *</label>
                        <Select
                          value={photo.categoria}
                          onValueChange={(value) => updatePhoto(photo.id, { categoria: value })}
                        >
                          <SelectTrigger className="bg-slate-600/50 border-slate-500 text-white">
                            <SelectValue placeholder="Selecionar equipamento" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {equipments.map(equipment => (
                              <SelectItem key={equipment.id} value={equipment.nome} className="text-white">
                                {equipment.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Descrição</label>
                        <Textarea
                          value={photo.descricao_curta}
                          onChange={(e) => updatePhoto(photo.id, { descricao_curta: e.target.value })}
                          className="bg-slate-600/50 border-slate-500 text-white"
                          placeholder="Descrição breve..."
                          rows={2}
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="text-sm text-slate-300 mb-1 block">Tags</label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="bg-slate-600/50 border-slate-500 text-white"
                            placeholder="Digite uma tag..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(photo.id);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addTag(photo.id)}
                            className="bg-cyan-500 hover:bg-cyan-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                            >
                              {tag}
                              <button
                                onClick={() => removeTag(photo.id, index)}
                                className="ml-1 text-cyan-400 hover:text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePhoto(photo.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20 self-start"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {photo.status === 'error' && photo.errorMessage && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm">
                      Erro: {photo.errorMessage}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {photos.length === 0 && (
          <div className="text-center py-12">
            <Image className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma foto selecionada</h3>
            <p className="text-slate-400">
              Clique na área de upload acima para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPhotosUpload;