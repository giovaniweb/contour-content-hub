
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { StoredVideo } from '@/types/video-storage';
import { SwipeAnimationVariants } from '@/hooks/video-swipe/use-swipe-animations';

interface VideoSwipeCardProps {
  video: StoredVideo;
  direction: 'left' | 'right' | null;
  variants: SwipeAnimationVariants;
}

const VideoSwipeCard: React.FC<VideoSwipeCardProps> = ({ video, direction, variants }) => {
  return (
    <motion.div
      key={video.id}
      custom={direction}
      variants={variants as Variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="absolute w-full h-full"
    >
      <video
        src={video.file_urls?.original}
        className="w-full h-full object-contain bg-black"
        autoPlay
        muted
        controls
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white text-xl font-bold">{video.title}</h3>
        <p className="text-white/80 line-clamp-2">{video.description || "Sem descrição"}</p>
      </div>
    </motion.div>
  );
};

export default VideoSwipeCard;
