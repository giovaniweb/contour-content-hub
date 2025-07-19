import { supabase } from '@/integrations/supabase/client';

export type VideoUploadStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'error';

export interface VideoUploadQueueItem {
  id: string;
  user_id: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  status: VideoUploadStatus;
  progress: number;
  video_id?: string;
  error_message?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const videoUploadQueueService = {
  // Adicionar item à fila
  async addToQueue(file: File, metadata: Record<string, any> = {}): Promise<VideoUploadQueueItem> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('video_upload_queue')
      .insert({
        user_id: userData.user.id,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending' as VideoUploadStatus,
        progress: 0,
        metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data as VideoUploadQueueItem;
  },

  // Buscar fila do usuário
  async getUserQueue(): Promise<VideoUploadQueueItem[]> {
    const { data, error } = await supabase
      .from('video_upload_queue')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as VideoUploadQueueItem[];
  },

  // Atualizar status do item
  async updateStatus(
    queueId: string, 
    status: VideoUploadStatus, 
    progress?: number,
    errorMessage?: string
  ): Promise<void> {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (progress !== undefined) updateData.progress = progress;
    if (errorMessage) updateData.error_message = errorMessage;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('video_upload_queue')
      .update(updateData)
      .eq('id', queueId);

    if (error) throw error;
  },

  // Marcar como concluído e vincular vídeo
  async markCompleted(queueId: string, videoId: string): Promise<void> {
    const { error } = await supabase
      .from('video_upload_queue')
      .update({
        status: 'completed',
        progress: 100,
        video_id: videoId,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', queueId);

    if (error) throw error;
  },

  // Remover item da fila
  async removeFromQueue(queueId: string): Promise<void> {
    const { error } = await supabase
      .from('video_upload_queue')
      .delete()
      .eq('id', queueId);

    if (error) throw error;
  },

  // Limpar itens concluídos (automaticamente após 24h)
  async clearCompleted(): Promise<void> {
    const { error } = await supabase
      .from('video_upload_queue')
      .delete()
      .eq('status', 'completed')
      .lt('completed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
  },

  // Subscription para mudanças em tempo real
  subscribeToUserQueue(callback: (payload: any) => void) {
    return supabase
      .channel('video_upload_queue')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_upload_queue'
        },
        callback
      )
      .subscribe();
  }
};