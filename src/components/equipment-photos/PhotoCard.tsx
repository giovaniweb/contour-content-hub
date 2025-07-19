import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { usePhotoLikes } from '@/hooks/usePhotoLikes';
import { 
  Heart, 
  Download, 
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { type EquipmentPhoto } from '@/api/equipment/photos';

interface PhotoCardProps {
  photo: EquipmentPhoto;
  index: number;
  isSelected: boolean;
  onSelect: (photoId: string) => void;
  onDownload: (photoId: string) => void;
  onPreview: (photo: EquipmentPhoto) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  index,
  isSelected,
  onSelect,
  onDownload,
  onPreview
}) => {
  const { isLiked, toggleLike, isToggling } = usePhotoLikes(photo.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`aurora-card hover:aurora-glow transition-all duration-500 hover:scale-105 aurora-glass ${
        isSelected ? 'ring-2 ring-aurora-electric-purple' : ''
      }`}>
        <CardContent className="p-0 relative group">
          <div className="relative">
            <img
              src={photo.thumbnail_url || photo.image_url}
              alt={photo.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            
            {/* Overlay com controles */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-white hover:text-aurora-electric-purple"
                  onClick={() => onPreview(photo)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-aurora-emerald"
                  onClick={() => onDownload(photo.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className={`text-white ${isLiked ? 'text-red-400' : 'hover:text-red-400'}`}
                  onClick={toggleLike}
                  disabled={isToggling}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Checkbox de seleção */}
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(photo.id)}
                className="bg-black/50 border-white/30"
              />
            </div>
          </div>

          <div className="p-4">
            <h4 className="aurora-heading font-semibold text-white mb-2 truncate">
              {photo.title}
            </h4>
            {photo.description && (
              <p className="aurora-body text-white/60 text-sm mb-3 line-clamp-2">
                {photo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-white/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {photo.likes_count}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {photo.downloads_count}
                </span>
              </div>
              <span>{new Date(photo.created_at).toLocaleDateString()}</span>
            </div>

            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {photo.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple">
                    {tag}
                  </Badge>
                ))}
                {photo.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs border-white/30 text-white/60">
                    +{photo.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PhotoCard;