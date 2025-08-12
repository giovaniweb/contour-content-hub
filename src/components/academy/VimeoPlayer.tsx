import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Player from '@vimeo/player';

interface VimeoPlayerProps {
  vimeoUrl: string;
  title: string;
  onProgress?: (watchTimeSeconds: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  initialTime?: number;
  onDurationChange?: (durationSeconds: number) => void;
}

export const VimeoPlayer: React.FC<VimeoPlayerProps> = ({
  vimeoUrl,
  title,
  onProgress,
  onComplete,
  autoPlay = false,
  initialTime,
  onDurationChange
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  const lastSecondRef = useRef(-1);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);

  const watchedSetRef = useRef<Set<number>>(new Set());
  const isPlayingRef = useRef(false);
  const lastProgressAtRef = useRef(0);
  const durationRef = useRef(0);

  // Keep callback refs in sync without recreating player
  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  }, [onProgress, onComplete]);

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string => {
    const patterns = [
      /vimeo\.com\/(?:video\/)?(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
      /(\d+)$/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) return m[1];
    }
    return '';
  };

  const vimeoId = getVimeoId(vimeoUrl);

  useEffect(() => {
    if (!containerRef.current || !vimeoId) return;

    // Destroy previous instance if any
    if (playerRef.current) {
      try {
        playerRef.current.unload().catch(() => {});
        playerRef.current.destroy().catch(() => {});
      } catch (_) {}
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
    lastSecondRef.current = -1;

    // Load metadata and inform parent
    player.getDuration().then((d) => {
      const dur = Math.floor(d || 0);
      setDuration(dur);
      durationRef.current = dur;
      onDurationChange?.(dur);
    }).catch(() => {});

    // Events
    const onTimeUpdate = (data: { seconds: number }) => {
      const secs = Math.floor(data.seconds || 0);
      const last = lastSecondRef.current;

      if (secs !== last) {
        // Update current position for UI
        setCurrentTime(secs);

        // Count as watched only when playing and moving +1s (ignore seeks)
        if (isPlayingRef.current && last >= 0 && secs === last + 1) {
          if (!watchedSetRef.current.has(secs)) {
            watchedSetRef.current.add(secs);
            const count = watchedSetRef.current.size;
            setWatchedSeconds(count);

            // Throttle progress callback to ~5s
            const now = Date.now();
            if (now - (lastProgressAtRef.current || 0) >= 5000) {
              lastProgressAtRef.current = now;
              onProgressRef.current?.(count);
            }
          }
        }

        lastSecondRef.current = secs;
      }
    };

    const onEnded = () => {
      const count = watchedSetRef.current.size;
      const threshold = Math.max(1, Math.floor((durationRef.current || 0) * 0.9));
      if (count >= threshold) {
        onCompleteRef.current?.();
      }
    };

    const onLoaded = () => {
      setIsLoading(false);
      // Ensure duration after load and reset counters
      player.getDuration().then((d) => {
        const dur = Math.floor(d || 0);
        setDuration(dur);
        durationRef.current = dur;
        onDurationChange?.(dur);
      }).catch(() => {});

      // Reset watched tracking on load
      watchedSetRef.current.clear();
      setWatchedSeconds(0);
      lastSecondRef.current = -1;
      lastProgressAtRef.current = 0;
    };

    player.on('timeupdate', onTimeUpdate);
    player.on('ended', onEnded);
    player.on('loaded', onLoaded);
    player.on('play', () => { isPlayingRef.current = true; });
    player.on('pause', () => { isPlayingRef.current = false; });
    player.on('seeked', (data: { seconds: number }) => {
      lastSecondRef.current = Math.floor((data?.seconds as number) || 0);
    });

    // Cleanup
    return () => {
      try {
        player.off('timeupdate', onTimeUpdate);
        player.off('ended', onEnded);
        player.off('loaded', onLoaded);
        player.off('play');
        player.off('pause');
        player.off('seeked');
        player.unload().catch(() => {});
        player.destroy().catch(() => {});
      } catch (_) {}
      playerRef.current = null;
    };
  }, [vimeoId, autoPlay]);

  // Keep prop reactive for future resume feature without seeking to it
  useEffect(() => { /* no-op */ }, [initialTime]);

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
            <span>Tempo assistido: {formatTime(watchedSeconds)}</span>
            {duration > 0 && (
              <span>Progresso: {Math.round((watchedSeconds / duration) * 100)}%</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};