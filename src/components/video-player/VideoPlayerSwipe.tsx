
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import VideoSwipeViewer from '@/components/video-storage/VideoSwipeViewer';
import { StoredVideo } from '@/types/video-storage';

interface VideoPlayerSwipeProps {
  videos: StoredVideo[];
  onLike: (video: StoredVideo) => void;
  onSkip: (video: StoredVideo) => void;
  onEnd: () => void;
}

export const VideoPlayerSwipe: React.FC<VideoPlayerSwipeProps> = ({ 
  videos, 
  onLike, 
  onSkip, 
  onEnd 
}) => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Descobrir vídeos</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
        
        <div className="h-[70vh] w-full max-w-3xl mx-auto overflow-hidden bg-black rounded-xl">
          <VideoSwipeViewer 
            videos={videos}
            onLike={onLike}
            onSkip={onSkip}
            onEnd={onEnd}
          />
        </div>
      </div>
    </Layout>
  );
};
