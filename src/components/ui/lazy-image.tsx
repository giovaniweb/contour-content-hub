
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  containerClassName?: string;
}

export function LazyImage({
  src,
  alt,
  fallbackSrc = "/placeholder-image.jpg",
  aspectRatio = "auto",
  className,
  containerClassName,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    
    // Create new image to preload
    const img = new Image();
    img.src = src || fallbackSrc;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setImgSrc(fallbackSrc);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
    auto: ""
  }[aspectRatio];

  return (
    <div className={cn("overflow-hidden", aspectRatioClass, containerClassName)}>
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        className={cn(
          "transition-all duration-500 ease-in-out w-full h-full object-cover",
          !isLoaded && "blur-sm scale-105",
          className
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
