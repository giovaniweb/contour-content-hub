
import { useState, useCallback } from 'react';
import { VideoUploadProgress } from '@/types/video-storage';

interface QueueItem<T> {
  id: string;
  data: T;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
  progress?: VideoUploadProgress;
}

interface UseQueueReturn<T> {
  queue: QueueItem<T>[];
  addToQueue: (id: string, data: T) => void;
  removeFromQueue: (id: string) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem<T>>) => void;
  clearQueue: () => void;
  getNextItem: () => QueueItem<T> | undefined;
  processQueue: (processor: (item: T) => Promise<void>) => Promise<void>;
  updateVideoQueue: (id: string, progress: VideoUploadProgress) => void;
}

export function useQueue<T>(): UseQueueReturn<T> {
  const [queue, setQueue] = useState<QueueItem<T>[]>([]);

  const addToQueue = useCallback((id: string, data: T) => {
    setQueue(prev => [...prev, { id, data, status: 'queued' }]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQueueItem = useCallback((id: string, updates: Partial<QueueItem<T>>) => {
    setQueue(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const updateVideoQueue = useCallback((id: string, progress: VideoUploadProgress) => {
    setQueue(prev => 
      prev.map(item => 
        item.id === id ? { ...item, progress } : item
      )
    );
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const getNextItem = useCallback(() => {
    return queue.find(item => item.status === 'queued');
  }, [queue]);

  const processQueue = useCallback(async (processor: (item: T) => Promise<void>) => {
    const nextItem = getNextItem();
    if (!nextItem) return;

    try {
      updateQueueItem(nextItem.id, { status: 'processing' });
      await processor(nextItem.data);
      updateQueueItem(nextItem.id, { status: 'completed' });
    } catch (error) {
      updateQueueItem(nextItem.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [getNextItem, updateQueueItem]);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    updateQueueItem,
    clearQueue,
    getNextItem,
    processQueue,
    updateVideoQueue
  };
}

export default useQueue;
