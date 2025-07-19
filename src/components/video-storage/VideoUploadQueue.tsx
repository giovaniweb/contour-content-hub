import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { videoUploadQueueService, VideoUploadQueueItem } from '@/services/videoUploadQueue';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadQueueProps {
  onClearCompleted?: () => void;
}

const VideoUploadQueue: React.FC<VideoUploadQueueProps> = ({ onClearCompleted }) => {
  const [queueItems, setQueueItems] = useState<VideoUploadQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar fila
  const loadQueue = async () => {
    try {
      const items = await videoUploadQueueService.getUserQueue();
      setQueueItems(items);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar fila de uploads'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();

    // Subscription para atualizações em tempo real
    const subscription = videoUploadQueueService.subscribeToUserQueue((payload) => {
      console.log('Atualização na fila:', payload);
      loadQueue(); // Recarregar quando houver mudanças
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Remover item da fila
  const handleRemoveItem = async (queueId: string) => {
    try {
      await videoUploadQueueService.removeFromQueue(queueId);
      toast({
        title: 'Sucesso',
        description: 'Item removido da fila'
      });
      loadQueue();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao remover item da fila'
      });
    }
  };

  // Limpar concluídos
  const handleClearCompleted = async () => {
    try {
      await videoUploadQueueService.clearCompleted();
      toast({
        title: 'Sucesso',
        description: 'Uploads concluídos removidos'
      });
      loadQueue();
      onClearCompleted?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao limpar uploads concluídos'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Upload className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'uploading': return 'Enviando';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  const completedCount = queueItems.filter(item => item.status === 'completed').length;

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">Carregando fila...</div>
        </CardContent>
      </Card>
    );
  }

  if (queueItems.length === 0) {
    return null; // Não mostra se não há itens
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-50">
          Fila de Uploads ({queueItems.length})
        </CardTitle>
        {completedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCompleted}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            Limpar Concluídos ({completedCount})
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {queueItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center space-x-3 flex-1">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 truncate">
                  {item.file_name}
                </div>
                <div className="text-xs text-slate-400">
                  {getStatusText(item.status)}
                  {item.file_size && ` • ${(item.file_size / 1024 / 1024).toFixed(1)} MB`}
                </div>
                {item.error_message && (
                  <div className="text-xs text-red-400 mt-1">
                    {item.error_message}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(item.status === 'uploading' || item.status === 'processing') && (
              <div className="w-24 mx-3">
                <Progress value={item.progress} className="h-2" />
                <div className="text-xs text-slate-400 text-center mt-1">
                  {item.progress}%
                </div>
              </div>
            )}

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(item.id)}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VideoUploadQueue;