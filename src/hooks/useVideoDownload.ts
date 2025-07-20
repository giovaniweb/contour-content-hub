import { useMutation } from '@tanstack/react-query';
import { downloadVideo } from '@/services/videoStorage/videoDownloadService';
import { useToast } from '@/hooks/use-toast';

export const useVideoDownload = () => {
  const { toast } = useToast();

  const downloadMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const result = await downloadVideo(videoId);
      if (!result.success) {
        throw new Error(result.error || 'Erro no download');
      }
      return result;
    },
    onSuccess: (result) => {
      if (result.downloadUrl) {
        // Trigger the actual download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Download iniciado",
        description: "O download do vídeo foi iniciado com sucesso!"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro no download",
        description: error.message || "Não foi possível baixar o vídeo"
      });
    }
  });

  return {
    downloadVideo: (videoId: string) => downloadMutation.mutate(videoId),
    isDownloading: downloadMutation.isPending
  };
};