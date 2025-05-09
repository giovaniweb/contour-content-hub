
import { create } from 'zustand';
import { BatchVideoState } from './types';

export const useBatchVideoStore = create<BatchVideoState>((set) => ({
  videos: [],
  loading: false,
  error: null,
  setVideos: (videos) => set({ videos }),
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
