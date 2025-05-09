
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { LazyImage } from '@/components/ui/lazy-image';
import { FloatingCardProps } from './types';

const FloatingCard: React.FC<FloatingCardProps> = ({
  image,
  title,
  description,
  link,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 h-full"
    >
      <Link 
        to={link}
        className="block h-full"
      >
        <div className="flex flex-col h-full">
          <div className="relative h-40">
            <LazyImage
              src={image}
              alt={title}
              fallbackSrc="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-white font-medium text-lg mb-1 line-clamp-1">{title}</h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-4 flex-1">{description}</p>
            
            <div className="flex justify-end mt-auto">
              <span className="inline-flex items-center text-xs text-white/70 hover:text-white transition-colors">
                Explorar
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FloatingCard;
