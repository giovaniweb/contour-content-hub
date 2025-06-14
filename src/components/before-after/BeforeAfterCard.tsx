
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar, 
  User,
  Download,
  Share2,
  Maximize2
} from "lucide-react";
import { BeforeAfterPhoto } from '@/types/before-after';
import { beforeAfterService } from '@/services/beforeAfterService';
import { toast } from 'sonner';

interface BeforeAfterCardProps {
  photo: BeforeAfterPhoto;
  onUpdate?: () => void;
  showOwner?: boolean;
}

const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({ 
  photo, 
  onUpdate,
  showOwner = false 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showFullSize, setShowFullSize] = useState(false);
  const [currentView, setCurrentView] = useState<'split' | 'before' | 'after'>('split');

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta foto?')) return;
    
    setIsDeleting(true);
    const success = await beforeAfterService.deletePhoto(photo.id);
    
    if (success) {
      toast.success('Foto deletada com sucesso');
      if (onUpdate) onUpdate();
    } else {
      toast.error('Erro ao deletar foto');
    }
    setIsDeleting(false);
  };

  const handleTogglePublic = async () => {
    setIsToggling(true);
    const success = await beforeAfterService.togglePublic(photo.id, !photo.is_public);
    
    if (success) {
      toast.success(photo.is_public ? 'Foto tornada privada' : 'Foto tornada pública');
      if (onUpdate) onUpdate();
    } else {
      toast.error('Erro ao alterar visibilidade');
    }
    setIsToggling(false);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const sharePhoto = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description || 'Confira este resultado antes e depois!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="aurora-glass border-aurora-electric-purple/30 overflow-hidden">
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="relative">
              {currentView === 'split' ? (
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <img
                      src={photo.before_image_url}
                      alt="Antes"
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setShowFullSize(true)}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">ANTES</Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={photo.after_image_url}
                      alt="Depois"
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setShowFullSize(true)}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="text-xs bg-green-600">DEPOIS</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={currentView === 'before' ? photo.before_image_url : photo.after_image_url}
                    alt={currentView === 'before' ? 'Antes' : 'Depois'}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setShowFullSize(true)}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={currentView === 'before' ? 'bg-slate-600' : 'bg-green-600'}>
                      {currentView === 'before' ? 'ANTES' : 'DEPOIS'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* View Toggle Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant={currentView === 'split' ? 'default' : 'outline'}
                  className="h-6 w-6 p-0"
                  onClick={() => setCurrentView('split')}
                >
                  ⚡
                </Button>
                <Button
                  size="sm"
                  variant={currentView === 'before' ? 'default' : 'outline'}
                  className="h-6 w-6 p-0"
                  onClick={() => setCurrentView('before')}
                >
                  1
                </Button>
                <Button
                  size="sm"
                  variant={currentView === 'after' ? 'default' : 'outline'}
                  className="h-6 w-6 p-0"
                  onClick={() => setCurrentView('after')}
                >
                  2
                </Button>
              </div>

              {/* Expand Button */}
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-2 right-2 h-8 w-8 p-0"
                onClick={() => setShowFullSize(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-slate-300 text-sm line-clamp-2">{photo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {photo.is_public ? (
                    <Eye className="h-4 w-4 text-green-400" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Equipment Tags */}
              {photo.equipment_used.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.equipment_used.map((equipment, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Date and Meta */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                {photo.procedure_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(photo.procedure_date).toLocaleDateString('pt-BR')}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {new Date(photo.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(photo.before_image_url, `${photo.title}-antes.jpg`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Antes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(photo.after_image_url, `${photo.title}-depois.jpg`)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Depois
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={sharePhoto}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {!showOwner && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isToggling}
                      onClick={handleTogglePublic}
                    >
                      {photo.is_public ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Full Size Modal */}
      {showFullSize && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullSize(false)}
        >
          <div className="max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-h-[80vh]">
              <div className="relative">
                <img
                  src={photo.before_image_url}
                  alt="Antes"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">ANTES</Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src={photo.after_image_url}
                  alt="Depois"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600">DEPOIS</Badge>
                </div>
              </div>
            </div>
            <Button
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
              onClick={() => setShowFullSize(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BeforeAfterCard;
