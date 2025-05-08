
import React from 'react';
import VideoListSkeleton from '@/components/video-storage/VideoListSkeleton';

const VideoSwipeLoading: React.FC = () => {
  return <VideoListSkeleton count={1} />;
};

export default VideoSwipeLoading;
