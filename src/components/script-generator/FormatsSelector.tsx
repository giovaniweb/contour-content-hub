
import React from 'react';
import { Label } from '@/components/ui/label';
import { FileText, Image, Video, Zap, Youtube, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

interface Format {
  id: 'carrossel' | 'imagem' | 'stories_10x' | 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_estatico' | 'ads_video';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  category: 'static' | 'video';
}

const FORMATOS: Format[] = [
  { id: 'carrossel', label: 'Carrossel', icon: FileText, description: 'Múltiplos slides', category: 'static' },
  { id: 'imagem', label: 'Post Estático', icon: Image, description: 'Uma imagem', category: 'static' },
  { id: 'stories_10x', label: 'Stories 10x', icon: Video, description: 'Metodologia avançada', category: 'video' },
  { id: 'reels', label: 'Reels', icon: Zap, description: 'Vídeo curto', category: 'video' },
  { id: 'tiktok', label: 'TikTok', icon: Video, description: 'Vídeo vertical', category: 'video' },
  { id: 'youtube_shorts', label: 'YouTube Shorts', icon: Youtube, description: 'Vídeo curto YouTube', category: 'video' },
  { id: 'youtube_video', label: 'Vídeo YouTube', icon: Youtube, description: 'Vídeo longo', category: 'video' },
  { id: 'ads_estatico', label: 'Ads Estático', icon: Monitor, description: 'Anúncio imagem', category: 'static' },
  { id: 'ads_video', label: 'Ads Vídeo', icon: Monitor, description: 'Anúncio vídeo', category: 'video' }
];

interface FormatsSelectorProps {
  selectedFormat: 'carrossel' | 'imagem' | 'stories_10x' | 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_estatico' | 'ads_video';
  onFormatChange: (format: 'carrossel' | 'imagem' | 'stories_10x' | 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_estatico' | 'ads_video') => void;
}

const FormatsSelector: React.FC<FormatsSelectorProps> = ({
  selectedFormat,
  onFormatChange
}) => {
  const staticFormats = FORMATOS.filter(fmt => fmt.category === 'static');
  const videoFormats = FORMATOS.filter(fmt => fmt.category === 'video');

  const renderFormatGrid = (formats: Format[], title: string, titleColor: string) => (
    <div className="space-y-3">
      <h4 className={`text-sm font-semibold ${titleColor}`}>{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {formats.map((fmt) => (
          <motion.button
            key={fmt.id}
            onClick={() => onFormatChange(fmt.id)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
              selectedFormat === fmt.id
                ? 'border-purple-500/70 bg-purple-500/10 shadow-md shadow-purple-500/20'
                : 'border-gray-700 bg-gray-800/80 hover:border-purple-400/50 hover:bg-gray-700/90 hover:shadow-lg hover:shadow-purple-500/10'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <fmt.icon className={`h-6 w-6 mx-auto mb-2 ${
              selectedFormat === fmt.id ? 'text-purple-300' : 'text-gray-200'
            }`} />
            <div className={`text-xs font-semibold mb-1 ${
              selectedFormat === fmt.id ? 'text-purple-300' : 'text-gray-200'
            }`}>
              {fmt.label}
            </div>
            <div className="text-xs text-gray-400 opacity-70">
              {fmt.description}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Label className="aurora-accent font-semibold text-base">
        Formato do Conteúdo
      </Label>
      
      {renderFormatGrid(staticFormats, "Formatos Estáticos", "text-green-400")}
      {renderFormatGrid(videoFormats, "Formatos de Vídeo", "text-blue-400")}
    </div>
  );
};

export default FormatsSelector;
