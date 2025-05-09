
import { create } from 'zustand';
import { StoredVideo } from '@/types/video-storage';
import { EditableVideo } from './types';
import { transformStoredVideosToEditable } from './transformUtils';

interface BatchVideoState {
  videos: EditableVideo[];
  loading: boolean;
  error: string | null;
  setVideos: (videos: StoredVideo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const batchVideoState = create<BatchVideoState>((set) => ({
  videos: [],
  loading: false,
  error: null,
  setVideos: (videos: StoredVideo[]) => set({ 
    videos: transformStoredVideosToEditable(videos),
    loading: false,
    error: null
  }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error, loading: false }),
  resetState: () => set({
    videos: [],
    loading: false,
    error: null
  })
}));

export default batchVideoState;
