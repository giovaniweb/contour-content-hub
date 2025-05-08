
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { usePermissions } from '@/hooks/use-permissions';
import { useVideoSwipe } from '@/hooks/use-video-swipe';
import VideoSwipeCard from '@/components/video-swipe/VideoSwipeCard';
import VideoSwipeControls from '@/components/video-swipe/VideoSwipeControls';
import VideoSwipeLoading from '@/components/video-swipe/VideoSwipeLoading';
import VideoSwipeEmpty from '@/components/video-swipe/VideoSwipeEmpty';

const VideoSwipe: React.FC = () => {
  const { 
    videos, 
    currentVideo, 
    loading, 
    direction, 
    variants,
    fetchVideos, 
    handleLike, 
    handleSkip, 
    handleDelete 
  } = useVideoSwipe();
  
  const { isAdmin } = usePermissions();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Descobrir Vídeos</h1>
          <VideoSwipeLoading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Descobrir Vídeos</h1>
        
        {videos.length === 0 ? (
          <VideoSwipeEmpty onRefresh={fetchVideos} />
        ) : (
          <div className="relative h-[70vh] w-full max-w-3xl mx-auto overflow-hidden bg-black rounded-xl">
            <AnimatePresence initial={false} custom={direction}>
              {currentVideo && (
                <VideoSwipeCard 
                  video={currentVideo} 
                  direction={direction} 
                  variants={variants} 
                />
              )}
            </AnimatePresence>
            
            <VideoSwipeControls 
              onLike={handleLike}
              onSkip={handleSkip}
              onDelete={handleDelete}
              currentVideo={currentVideo}
              isAdmin={isAdmin()}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VideoSwipe;
