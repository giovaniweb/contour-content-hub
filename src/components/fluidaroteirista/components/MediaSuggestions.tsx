import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, Image, PlayCircle, Sparkles } from 'lucide-react';

interface MediaSuggestionsProps {
  format: string;
  estimatedTime?: number;
}

const MediaSuggestions: React.FC<MediaSuggestionsProps> = ({ format, estimatedTime }) => {
  const getMediaSuggestions = (format: string) => {
    const formatLower = format.toLowerCase();
    
    if (formatLower.includes('carrossel') || formatLower.includes('carousel')) {
      return {
        type: 'images',
        icon: Image,
        title: 'Imagens para Carrossel',
        suggestions: [
          'Fotos em alta resolução (1080x1080px)',
          'Imagens com boa iluminação',
          'Templates visuais consistentes',
          'Gráficos explicativos ou infográficos'
        ],
        color: 'emerald'
      };
    }
    
    if (formatLower.includes('stories') || formatLower.includes('story')) {
      return {
        type: 'mixed',
        icon: Camera,
        title: 'Conteúdo para Stories',
        suggestions: [
          'Fotos verticais (1080x1920px)',
          'Vídeos curtos (15-30s)',
          'Boomerangs e animações',
          'Templates de stories'
        ],
        color: 'purple'
      };
    }
    
    if (formatLower.includes('reels') || formatLower.includes('reel')) {
      return {
        type: 'videos',
        icon: Video,
        title: 'Vídeos para Reels',
        suggestions: [
          'Vídeos verticais (1080x1920px)',
          'Gravação em boa qualidade',
          'Transições dinâmicas',
          'Áudio de qualidade'
        ],
        color: 'cyan'
      };
    }
    
    if (formatLower.includes('video') || formatLower.includes('longo')) {
      return {
        type: 'videos',
        icon: PlayCircle,
        title: 'Vídeos Longos',
        suggestions: [
          'Vídeos em formato landscape',
          'Múltiplos ângulos de câmera',
          'Boa qualidade de áudio',
          'Roteiro bem estruturado'
        ],
        color: 'blue'
      };
    }
    
    // Default para artigos ou posts estáticos
    return {
      type: 'images',
      icon: Image,
      title: 'Imagens para Post',
      suggestions: [
        'Imagens chamativas (1080x1080px)',
        'Design gráfico atraente',
        'Cores que combinem com a marca',
        'Texto legível e bem posicionado'
      ],
      color: 'pink'
    };
  };

  const media = getMediaSuggestions(format);
  const IconComponent = media.icon;

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      pink: 'text-pink-600 bg-pink-50 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className={`border-2 ${getColorClasses(media.color)}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 text-lg ${media.color === 'emerald' ? 'text-emerald-700' : 
            media.color === 'purple' ? 'text-purple-700' :
            media.color === 'cyan' ? 'text-cyan-700' :
            media.color === 'blue' ? 'text-blue-700' : 'text-pink-700'}`}>
            <IconComponent className="h-5 w-5" />
            {media.title}
            <Sparkles className="h-4 w-4 opacity-60" />
          </CardTitle>
          {estimatedTime && (
            <Badge variant="outline" className="w-fit text-xs">
              Duração estimada: {estimatedTime}s
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {media.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                  media.color === 'emerald' ? 'bg-emerald-50/50 text-emerald-700' :
                  media.color === 'purple' ? 'bg-purple-50/50 text-purple-700' :
                  media.color === 'cyan' ? 'bg-cyan-50/50 text-cyan-700' :
                  media.color === 'blue' ? 'bg-blue-50/50 text-blue-700' : 'bg-pink-50/50 text-pink-700'
                }`}
              >
                <span className="text-xs">💡</span>
                {suggestion}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MediaSuggestions;