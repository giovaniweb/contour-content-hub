
import React, { useState, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Check, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/use-permissions';
import { VideoQueueItem } from '@/types/video-storage';
import { batchUploadVideos } from '@/services/videoStorage/videoUploadService';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { formatFileNameToTitle } from '@/utils/fileUtils';

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
        // Format filename using the new pattern
        const formattedName = formatFileNameToTitle(file.name);
          
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
    <div className="aurora-glass-enhanced p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-aurora-electric-purple to-aurora-emerald bg-clip-text text-transparent mb-2">
          🚀 Upload em Lote Inteligente
        </h3>
        <p className="text-aurora-lavender/80">Processamento paralelo com monitoramento em tempo real</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 aurora-glass-enhanced p-6">
            <Label className="text-aurora-lavender font-medium flex items-center mb-3">
              📁 Seleção de Arquivos
            </Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileChange}
              className="bg-aurora-deep-purple/30 border-aurora-electric-purple/30 text-aurora-lavender file:bg-aurora-electric-purple/20 file:text-aurora-lavender file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {['MP4', 'MOV', 'AVI', 'MKV'].map(format => (
                <span key={format} className="px-2 py-1 bg-aurora-electric-purple/20 text-aurora-lavender text-xs rounded-full">
                  {format}
                </span>
              ))}
            </div>
          </div>
          
          <div className="aurora-glass-enhanced p-6">
            <Label className="text-aurora-lavender font-medium flex items-center mb-3">
              ⚙️ Configuração Global
            </Label>
            <Select value={defaultEquipmentId} onValueChange={handleSetEquipmentForAll}>
              <SelectTrigger className="bg-aurora-deep-purple/30 border-aurora-electric-purple/30 text-aurora-lavender">
                <SelectValue placeholder="Equipamento padrão" />
              </SelectTrigger>
              <SelectContent className="bg-aurora-deep-purple border-aurora-electric-purple/30">
                <SelectItem value="none">Nenhum equipamento</SelectItem>
                {equipmentOptions.map(eq => (
                  <SelectItem key={eq.id} value={eq.id}>{eq.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-aurora-lavender/60 mt-2">
              Aplica para todos novos arquivos
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
          <div className="aurora-glass-enhanced py-16 rounded-xl flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <Upload className="h-20 w-20 text-aurora-electric-purple" />
            </div>
            <h4 className="text-aurora-lavender font-medium text-lg mb-2">Fila de Upload Vazia</h4>
            <p className="text-aurora-lavender/60 mb-6 text-center max-w-md">
              Selecione múltiplos vídeos para processar em lote com inteligência Aurora
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:from-aurora-electric-purple/80 hover:to-aurora-neon-blue/80 text-white border-0 px-8 py-3 text-lg"
            >
              ✨ Selecionar Vídeos
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-aurora-electric-purple/30">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-aurora-deep-purple/30 border-aurora-electric-purple/50 text-aurora-lavender hover:bg-aurora-electric-purple/20 hover:text-white"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        
        <Button 
          onClick={handleBatchUpload} 
          disabled={uploadQueue.length === 0 || isUploading}
          className="bg-gradient-to-r from-aurora-electric-purple to-aurora-emerald hover:from-aurora-electric-purple/80 hover:to-aurora-emerald/80 text-white border-0 px-8 py-3 text-lg disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Upload className="mr-3 h-5 w-5" /> 
              🚀 Processando {uploadQueue.length} vídeos...
            </>
          ) : (
            <>
              <Upload className="mr-3 h-5 w-5" /> 
              ✨ Processar {uploadQueue.length} {uploadQueue.length === 1 ? 'vídeo' : 'vídeos'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BatchVideoUploader;
