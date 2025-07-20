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
    onSuccess: async (result) => {
      if (result.downloadUrl) {
        try {
          // Force download by fetching the video and creating blob
          const response = await fetch(result.downloadUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `video-${Date.now()}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(url);
        } catch (error) {
          // Fallback to direct link
          const link = document.createElement('a');
          link.href = result.downloadUrl;
          link.download = `video-${Date.now()}.mp4`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
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