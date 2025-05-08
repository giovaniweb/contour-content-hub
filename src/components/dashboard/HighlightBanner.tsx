
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HighlightBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  className?: string;
}

const HighlightBanner: React.FC<HighlightBannerProps> = ({
  title,
  description,
  ctaText,
  ctaLink,
  imageUrl,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-fluida-blue to-fluida-pink p-6 md:p-8",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="text-white"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/80 mb-6 max-w-md">{description}</p>
          <Button
            asChild
            variant="glass"
            className="font-medium hover:bg-white"
          >
            <Link to={ctaLink}>{ctaText}</Link>
          </Button>
        </div>

        {imageUrl && (
          <div className="hidden md:block w-1/3 max-w-xs">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HighlightBanner;
