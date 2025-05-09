
import { create } from 'zustand';
import { EditableVideo } from './types';

// Update BatchVideoState to include the setter methods
export interface BatchVideoState {
  videos: EditableVideo[];
  loading: boolean;
  error: string | null;
  setVideos: (videos: EditableVideo[] | ((prev: EditableVideo[]) => EditableVideo[])) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBatchVideoStore = create<BatchVideoState>((set) => ({
  videos: [],
  loading: false,
  error: null,
  setVideos: (videos) => set((state) => ({
    videos: typeof videos === 'function' ? videos(state.videos) : videos
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const batchVideoState = {
  initialState: {
    videos: [],
    loading: false,
    error: null,
  }
};
