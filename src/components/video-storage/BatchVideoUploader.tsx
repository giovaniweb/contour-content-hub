
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Check, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/use-permissions';
import { VideoQueueItem } from '@/types/video-storage';
import { batchUploadVideos } from '@/services/videoStorageService';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

interface BatchVideoUploaderProps {
  onUploadComplete?: () => void;
  onCancel?: () => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const BatchVideoUploader: React.FC<BatchVideoUploaderProps> = ({ onUploadComplete, onCancel }) => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [uploadQueue, setUploadQueue] = useState<VideoQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [equipmentOptions, setEquipmentOptions] = useState<{ id: string; nome: string }[]>([]);
  const [defaultEquipmentId, setDefaultEquipmentId] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      } catch (err) {
        console.error('Error fetching equipment options:', err);
      }
    };
    
    fetchEquipments();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      
      const filteredFiles = fileList.filter(file => file.type.startsWith('video/'));
      
      if (filteredFiles.length !== fileList.length) {
        toast({
          variant: "default",
          title: "Alguns arquivos ignorados",
          description: "Apenas arquivos de vídeo foram adicionados à fila."
        });
      }
      
      const newQueueItems: VideoQueueItem[] = filteredFiles.map(file => {
        // Remove file extension and replace underscores/hyphens with spaces
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        const formattedName = nameWithoutExtension
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          // Capitalize first letter of each word
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
          
        return {
          id: uuidv4(),
          file,
          title: formattedName,
          description: '',
          tags: [],
          equipmentId: defaultEquipmentId,
          status: 'queued'
        };
      });
      
      setUploadQueue(prevQueue => [...prevQueue, ...newQueueItems]);
      
      // Clear the input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadQueue(currentQueue => currentQueue.filter((_, i) => i !== index));
  };
  
  const updateQueueItem = (index: number, updates: Partial<VideoQueueItem>) => {
    setUploadQueue(currentQueue => 
      currentQueue.map((item, i) => i === index ? { ...item, ...updates } : item)
    );
  };
  
  const handleSetEquipmentForAll = (equipmentId: string) => {
    setDefaultEquipmentId(equipmentId);
    
    if (uploadQueue.length > 0) {
      const shouldUpdate = window.confirm(
        "Deseja aplicar este equipamento para todos os vídeos na fila?"
      );
      
      if (shouldUpdate) {
        setUploadQueue(currentQueue => 
          currentQueue.map(item => ({ ...item, equipmentId }))
        );
      }
    }
  };
  
  const handleBatchUpload = async () => {
    if (uploadQueue.length === 0) {
      toast({
        variant: "destructive",
        title: "Fila vazia",
        description: "Adicione pelo menos um vídeo para fazer upload."
      });
      return;
    }
    
    setIsUploading(true);
    setCurrentUploadIndex(0);
    setUploadProgress(0);
    
    try {
      await batchUploadVideos(
        uploadQueue,
        (index, progress: UploadProgress) => {
          setCurrentUploadIndex(index);
          setUploadProgress(progress.percentage);
          updateQueueItem(index, { 
            status: 'uploading',
            progress
          });
        },
        (index, success, videoId, error) => {
          if (success) {
            updateQueueItem(index, { 
              status: 'complete',
              videoId,
              progress: {
                loaded: 100,
                total: 100,
                percentage: 100
              }
            });
          } else {
            updateQueueItem(index, { 
              status: 'error',
              error: error || 'Erro desconhecido no upload',
              progress: {
                loaded: 0,
                total: 100,
                percentage: 0
              }
            });
          }
        }
      );
      
      toast({
        title: "Uploads concluídos",
        description: `${uploadQueue.filter(item => item.status === 'complete').length} de ${uploadQueue.length} vídeos enviados com sucesso.`
      });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload batch error:', error);
      toast({
        variant: "destructive",
        title: "Erro no processo de upload",
        description: "Ocorreu um erro durante o upload em lote. Verifique a fila para mais detalhes."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetQueue = () => {
    if (isUploading) {
      const confirm = window.confirm('Cancelar uploads em andamento?');
      if (!confirm) return;
    }
    
    setUploadQueue([]);
    setIsUploading(false);
    setCurrentUploadIndex(0);
    setUploadProgress(0);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'complete': return 'success';
      case 'error': return 'destructive';
      case 'uploading': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'complete': return 'Concluído';
      case 'error': return 'Erro';
      case 'uploading': return 'Enviando';
      default: return 'Pendente';
    }
  };

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

  // Se não for admin, não renderiza o componente
  if (!isAdmin()) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload em Lote (Administrador)</CardTitle>
        <CardDescription>Envie múltiplos vídeos de uma só vez</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileChange}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              MP4, MOV, AVI ou MKV. Máximo 100MB por arquivo.
            </p>
          </div>
          
          <div className="w-1/3">
            <Select value={defaultEquipmentId} onValueChange={handleSetEquipmentForAll}>
              <SelectTrigger>
                <SelectValue placeholder="Equipamento padrão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum equipamento</SelectItem>
                {equipmentOptions.map(eq => (
                  <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Equipamento padrão para novos arquivos
            </p>
          </div>
        </div>
        
        {uploadQueue.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Fila de Upload ({uploadQueue.length} vídeos)</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetQueue}
                disabled={isUploading}
              >
                Limpar Fila
              </Button>
            </div>
            
            {isUploading && (
              <div className="mb-4 p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso total: {currentUploadIndex + 1} de {uploadQueue.length}</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <div className="max-h-[350px] overflow-y-auto border rounded-md divide-y">
              {uploadQueue.map((item, index) => (
                <div key={index} className={`p-3 ${index === currentUploadIndex && isUploading ? 'bg-muted/50' : ''}`}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1">
                      <Input
                        value={item.title}
                        onChange={(e) => updateQueueItem(index, { title: e.target.value })}
                        placeholder="Título do vídeo"
                        disabled={isUploading}
                        className="mb-2"
                      />
                      
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1">
                          <Select 
                            value={item.equipmentId} 
                            onValueChange={(val) => updateQueueItem(index, { equipmentId: val })}
                            disabled={isUploading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um equipamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum equipamento</SelectItem>
                              {equipmentOptions.map(eq => (
                                <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="w-32 flex items-center justify-center">
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {getStatusLabel(item.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateQueueItem(index, { description: e.target.value })}
                        placeholder="Descrição (opcional)"
                        disabled={isUploading}
                        rows={2}
                      />
                    </div>
                    
                    {!isUploading && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isUploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span className="truncate" title={item.file.name}>
                      {item.file.name} ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    
                    {item.status === 'uploading' && item.progress && (
                      <div className="flex items-center gap-2">
                        <span>{Math.round(item.progress.percentage)}%</span>
                        <Progress value={item.progress.percentage} className="w-20 h-1" />
                      </div>
                    )}
                    
                    {item.status === 'error' && (
                      <span className="text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {item.error}
                      </span>
                    )}
                    
                    {item.status === 'complete' && (
                      <span className="text-success flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-muted py-12 rounded-lg flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Adicione vídeos para iniciar o upload em lote</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Selecionar arquivos
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        
        <Button 
          onClick={handleBatchUpload} 
          disabled={uploadQueue.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Enviar {uploadQueue.length} {uploadQueue.length === 1 ? 'vídeo' : 'vídeos'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BatchVideoUploader;
