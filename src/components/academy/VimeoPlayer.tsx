import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VimeoPlayerProps {
  vimeoUrl: string;
  title: string;
  onProgress?: (watchTimeSeconds: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
  vimeoUrl,
  title,
  onProgress,
  onComplete,
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

  const vimeoId = getVimeoId(vimeoUrl);
  const embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}?api=1&player_id=vimeo_player` : '';

  useEffect(() => {
    if (!vimeoId || !onProgress) return;

    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          onProgress(newTime);
          
          // Check if video is completed (90% watched)
          if (duration > 0 && newTime >= duration * 0.9 && onComplete) {
            onComplete();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, duration, onProgress, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!vimeoId) {
    return (
      <Card className="aurora-glass border-aurora-electric-purple/20">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">URL do Vimeo inválida</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="aurora-glass border-aurora-electric-purple/20 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black/50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple"></div>
            </div>
          )}
          
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1 flex items-center gap-2 text-sm text-white">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-aurora-electric-purple h-1 rounded-full transition-all"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>Tempo assistido: {formatTime(currentTime)}</span>
            {duration > 0 && (
              <span>Progresso: {Math.round((currentTime / duration) * 100)}%</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};