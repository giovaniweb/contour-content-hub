
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play, ExternalLink } from 'lucide-react';

interface HighlightBannerProps {
  title?: string;
  description?: string; 
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  videoId?: string;
}

const HighlightBanner: React.FC<HighlightBannerProps> = ({ 
  title = "Crie conteúdo que engaja",
  description = "Utilize nossa plataforma inteligente para criar roteiros, validar ideias e planejar sua estratégia de conteúdo.",
  ctaText = "Começar agora",
  ctaLink = "/custom-gpt",
  imageUrl,
  videoId
}) => {
  // Determine background style based on provided image or default Fluida gradient
  const backgroundStyle = imageUrl 
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(to right, #0094fb, #f300fc)' };
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden h-64 mb-8 group transition-all duration-300"
      style={backgroundStyle}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
      
      <div className="absolute inset-0 flex items-center p-8">
        <div className="max-w-lg z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:translate-y-[-2px] transition-transform">
            {title}
          </h2>
          <p className="text-white/90 mb-6 group-hover:text-white transition-colors">
            {description}
          </p>
          <div className="flex gap-3">
            <Button asChild variant="accent" className="font-medium group-hover:shadow-lg transition-all">
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
            
            {videoId && (
              <Button asChild variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white">
                <Link to={`/video-player?id=${videoId}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Ver vídeo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute right-8 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity">
        <ExternalLink className="h-32 w-32 text-white" />
      </div>
    </div>
  );
};

export default HighlightBanner;
