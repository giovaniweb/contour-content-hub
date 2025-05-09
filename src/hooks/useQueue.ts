
import { useState } from 'react';
import { VideoQueueItem, VideoUploadProgress } from '@/types/video-storage';

export interface UseQueueReturn<T> {
  queue: T[];
  addToQueue: (item: T) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  isInQueue: (id: string) => boolean;
  updateItem: (id: string, updates: Partial<T>) => void;
  getItem: (id: string) => T | undefined;
  updateVideoQueue: (fileName: string, updates: Partial<VideoUploadProgress>) => void;
}

export function useQueue<T extends { id: string }>(initialQueue: T[] = []): UseQueueReturn<T> {
  const [queue, setQueue] = useState<T[]>(initialQueue);

  const addToQueue = (item: T) => {
    setQueue(prev => [...prev, item]);
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const isInQueue = (id: string) => {
    return queue.some(item => item.id === id);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    setQueue(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const getItem = (id: string) => {
    return queue.find(item => item.id === id);
  };

  // Update video queue item by filename
  const updateVideoQueue = (fileName: string, updates: Partial<VideoUploadProgress>) => {
    setQueue(prev => 
      prev.map(item => {
        if ((item as unknown as VideoQueueItem).file?.name === fileName) {
          return {
            ...item,
            progress: {
              ...(item as unknown as VideoQueueItem).progress,
              ...updates
            }
          };
        }
        return item;
      })
    );
  };

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    isInQueue,
    updateItem,
    getItem,
    updateVideoQueue
  };
}
