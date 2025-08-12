import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Player from '@vimeo/player';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

  const vimeoId = getVimeoId(vimeoUrl);

  useEffect(() => {
    if (!containerRef.current || !vimeoId) return;

    // Destroy previous instance if any
    if (playerRef.current) {
      playerRef.current.unload().catch(() => {});
      playerRef.current.destroy().catch(() => {});
      playerRef.current = null;
    }

    const player = new Player(containerRef.current, {
      id: parseInt(vimeoId, 10),
      controls: true,
      autoplay: autoPlay,
      muted: autoPlay, // helps with browser autoplay policies
      byline: false,
      title: false,
      portrait: false,
      responsive: true
    });

    playerRef.current = player;
    setIsLoading(true);

    // Load metadata
    player.getDuration().then((d) => setDuration(Math.floor(d))).catch(() => {});

    // Events
    const onTimeUpdate = (data: { seconds: number }) => {
      const secs = Math.floor(data.seconds || 0);
      setCurrentTime(secs);
      onProgress?.(secs);
    };

    const onEnded = () => {
      onComplete?.();
    };

    const onLoaded = () => {
      setIsLoading(false);
      // Ensure duration after load
      player.getDuration().then((d) => setDuration(Math.floor(d))).catch(() => {});
    };

    player.on('timeupdate', onTimeUpdate);
    player.on('ended', onEnded);
    player.on('loaded', onLoaded);

    // Cleanup
    return () => {
      try {
        player.off('timeupdate', onTimeUpdate);
        player.off('ended', onEnded);
        player.off('loaded', onLoaded);
        player.unload().catch(() => {});
        player.destroy().catch(() => {});
      } catch (_) {}
      playerRef.current = null;
    };
  }, [vimeoId, autoPlay, onProgress, onComplete]);

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

          {/* Vimeo Player container - native controls only (no duplicate overlay) */}
          <div ref={containerRef} className="w-full h-full" />
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