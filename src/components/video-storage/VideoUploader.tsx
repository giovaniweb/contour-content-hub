import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { uploadVideo } from '@/services/videoStorageService';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { VideoUploadProgress } from '@/types/video-storage';
import { AlertCircle, Check, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/use-permissions';
import { Navigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

// Define an interface for equipment
interface Equipment {
  id: string;
  nome: string;
}

interface VideoUploaderProps {
  onUploadComplete?: (videoId: string) => void;
  onCancel?: () => void;
  equipmentId?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadComplete, onCancel, equipmentId }) => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [equipment, setEquipment] = useState<string>(equipmentId || 'none');
  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);

  // Fetch equipment options
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .order('nome');
        
        if (error) {
          console.error('Error fetching equipments:', error);
          return;
        }
        
        setEquipmentOptions(data || []);
        
        // If we have an equipmentId from props, set it
        if (equipmentId) {
          setEquipment(equipmentId);
        }
      } catch (err) {
        console.error('Error fetching equipment options:', err);
      }
    };
    
    fetchEquipments();
  }, [equipmentId]);

  // Verificação para impedir que usuários não-admin acessem este componente
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Você não tem permissão para fazer upload de vídeos."
      });
      
      if (onCancel) {
        onCancel();
      }
    }
  }, [isAdmin, toast, onCancel]);

  // Extract title from filename when a file is selected
  useEffect(() => {
    if (file && !title) {
      // Remove file extension and replace underscores/hyphens with spaces
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      const formattedName = nameWithoutExtension
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        // Capitalize first letter of each word
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setTitle(formattedName);
    }
  }, [file, title]);

  // Se não for admin, não renderiza o componente
  if (!isAdmin()) {
    return null;
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos de vídeo."
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!isAdmin()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Apenas administradores podem fazer upload de vídeos."
      });
      return;
    }

    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de vídeo para upload."
      });
      return;
    }

    if (!title) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Por favor, insira um título para o vídeo."
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({
      loaded: 0,
      total: 0,
      percentage: 0,
      status: "uploading",
      fileName: file.name,
      progress: 0,
      message: "Iniciando upload..."
    });

    // Add equipment to tags if selected
    let videoTags = [...tags];
    let selectedEquipmentId = equipment === 'none' ? null : equipment;
    
    if (selectedEquipmentId) {
      const selectedEquipment = equipmentOptions.find(eq => eq.id === selectedEquipmentId);
      if (selectedEquipment && !videoTags.includes(selectedEquipment.nome)) {
        videoTags.push(selectedEquipment.nome);
      }
    }

    // Create metadata object that matches Json type requirements
    const metadataObj = {
      equipment_id: selectedEquipmentId || "",
      equipment_name: equipmentOptions.find(eq => eq.id === selectedEquipmentId)?.nome || "",
      original_filename: file.name
      // Include other metadata as needed
    };

    // Convert to string for storage (Json type often requires string serialization)
    const metadata = JSON.stringify(metadataObj);

    const result = await uploadVideo(
      file, 
      title, 
      description, 
      videoTags,
      (progress) => {
        setUploadProgress(prev => ({
          ...prev!,
          progress: Math.round(progress),
          message: `Enviando arquivo: ${Math.round(progress)}%`
        }));
      },
      isPublic,
      metadata // Pass the serialized metadata
    );

    if (result.success && result.videoId) {
      setUploadProgress(prev => ({
        ...prev!,
        progress: 100,
        status: 'processing',
        message: 'Upload completo. Processando vídeo...',
        id: result.videoId
      }));
      
      // If we have an equipment ID, link the video to it
      if (selectedEquipmentId) {
        try {
          // Update the videos_storage record to include equipment info
          await supabase.from('videos_storage')
            .update({ 
              metadata: metadataObj // Use the metadata object
            })
            .eq('id', result.videoId);
        } catch (error) {
          console.error('Error linking video to equipment:', error);
        }
      }
      
      toast({
        title: "Upload completo",
        description: "O vídeo foi enviado e está sendo processado."
      });
      
      if (onUploadComplete) {
        onUploadComplete(result.videoId);
      }
    } else {
      setUploadProgress(prev => ({
        ...prev!,
        status: 'error',
        message: 'Falha no upload',
        error: result.error
      }));
      
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: result.error || "Ocorreu um erro ao fazer o upload do vídeo."
      });
      
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setIsPublic(false);
    setUploadProgress(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de Vídeo (Administrador)</CardTitle>
        <CardDescription>Envie um novo vídeo para a biblioteca de vídeos</CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadProgress ? (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">
                Arraste seu arquivo de vídeo aqui ou <span className="text-primary">clique para selecionar</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, MOV, AVI ou MKV. Máximo 100MB.
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska" 
                className="hidden" 
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded mb-4">
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="equipment">Equipamento</Label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um equipamento relacionado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum equipamento</SelectItem>
                    {equipmentOptions.map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Associe este vídeo a um equipamento específico
                </p>
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título do vídeo"
                />
                {file && !title && (
                  <p className="text-xs text-muted-foreground mt-1">
                    O título será gerado automaticamente com base no nome do arquivo
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione uma descrição para o vídeo"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={addTag}
                    placeholder="Adicione tags (pressione Enter)"
                  />
                  <Button 
                    type="button"
                    onClick={addTag}
                  >
                    Adicionar
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                {equipment !== 'none' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    O nome do equipamento selecionado será adicionado automaticamente como tag
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPublic">Disponibilizar para todos os usuários</Label>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{uploadProgress.fileName}</p>
              <Badge variant={
                uploadProgress.status === 'uploading' ? 'default' : 
                uploadProgress.status === 'processing' ? 'secondary' : 
                uploadProgress.status === 'ready' ? 'success' : 
                'destructive'
              }>
                {uploadProgress.status === 'uploading' ? 'Enviando' : 
                 uploadProgress.status === 'processing' ? 'Processando' : 
                 uploadProgress.status === 'ready' ? 'Concluído' : 
                 'Erro'}
              </Badge>
            </div>
            
            <Progress value={uploadProgress.progress} className="w-full" />
            
            <p className="text-sm text-muted-foreground">{uploadProgress.message}</p>
            
            {uploadProgress.error && (
              <div className="bg-destructive/10 p-3 rounded flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{uploadProgress.error}</p>
              </div>
            )}
            
            {uploadProgress.status === 'processing' && (
              <div className="bg-muted p-3 rounded">
                <p className="text-sm">
                  O vídeo está sendo processado. Isso pode levar alguns minutos dependendo do tamanho e 
                  da complexidade do arquivo. Você pode fechar esta janela e verificar o status do 
                  processamento depois na sua biblioteca de vídeos.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            resetForm();
            if (onCancel) onCancel();
          }}
        >
          {uploadProgress?.status === 'error' ? 'Tentar novamente' : 'Cancelar'}
        </Button>
        
        {!uploadProgress && (
          <Button 
            onClick={handleUpload} 
            disabled={!file || !title || isUploading}
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Fazer Upload
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoUploader;
