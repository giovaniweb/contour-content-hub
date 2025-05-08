
import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StoredVideo } from '@/types/video-storage';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import VideoSwipeViewer from '@/components/video-storage/VideoSwipeViewer';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// Now we'll import the new components we're creating
import { VideoPlayerLoading } from '@/components/video-player/VideoPlayerLoading';
import { VideoPlayerEmpty } from '@/components/video-player/VideoPlayerEmpty';
import { VideoPlayerCarousel } from '@/components/video-player/VideoPlayerCarousel';
import { VideoPlayerSwipe } from '@/components/video-player/VideoPlayerSwipe';
import { useVideoPlayer } from '@/hooks/use-video-player';

const VideoPlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('id');
  const mode = searchParams.get('mode') || 'single';
  
  const { 
    videos, 
    loading, 
    currentVideoIndex,
    handleLike,
    handleSkip,
    handleVideoEnd,
    handleCarouselSelect,
    setCurrentVideoIndex
  } = useVideoPlayer(videoId, mode);
  
  if (loading) {
    return <VideoPlayerLoading />;
  }

  if (videos.length === 0) {
    return <VideoPlayerEmpty />;
  }

  // Show swipe mode
  if (mode === 'swipe') {
    return <VideoPlayerSwipe videos={videos} onLike={handleLike} onSkip={handleSkip} onEnd={handleVideoEnd} />;
  }

  // Show carousel mode
  return <VideoPlayerCarousel 
    videos={videos} 
    currentVideoIndex={currentVideoIndex}
    onLike={handleLike}
    onSelect={handleCarouselSelect}
  />;
};

export default VideoPlayer;
