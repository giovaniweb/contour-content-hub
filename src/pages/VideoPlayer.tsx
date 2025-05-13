
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/layout/ContentLayout';
import GlassContainer from '@/components/ui/GlassContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share, ThumbsUp } from 'lucide-react';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState({
    title: 'Carregando título...',
    description: 'Carregando descrição...',
    views: 0,
    likes: 0,
    date: '',
  });

  useEffect(() => {
    // Simulate loading video data
    const timer = setTimeout(() => {
      setLoading(false);
      setVideoData({
        title: 'Técnicas avançadas de contorno facial',
        description: 'Aprenda as melhores técnicas para um contorno facial perfeito utilizando produtos disponíveis no mercado.',
        views: 3244,
        likes: 278,
        date: '18 de Abril, 2025',
      });
      
      // Placeholder video URL - in a real app, this would come from your backend
      setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleBack = () => {
    navigate(ROUTES.VIDEOS.ROOT);
  };
  
  const handleLike = () => {
    toast.success("Vídeo curtido!");
  };
  
  const handleShare = () => {
    toast.success("Link copiado para a área de transferência!");
  };
  
  const handleDownload = () => {
    toast.success("Download iniciado!");
  };

  return (
    <ContentLayout
      title="Player de Vídeo"
      subtitle="Assista ao conteúdo selecionado"
    >
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a biblioteca
      </Button>

      <GlassContainer className="mb-6 overflow-hidden p-0">
        {loading ? (
          <div className="aspect-video bg-slate-200 animate-pulse flex items-center justify-center">
            <p className="text-slate-500">Carregando vídeo...</p>
          </div>
        ) : (
          <video 
            className="w-full aspect-video" 
            controls 
            autoPlay
            src={videoUrl}
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        )}
      </GlassContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassContainer className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span>{videoData.views.toLocaleString()} visualizações</span>
            <span className="mx-2">•</span>
            <span>{videoData.date}</span>
          </div>
          <p className="text-gray-700">{videoData.description}</p>
          
          <div className="flex gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={handleLike}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Curtir
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
          </div>
        </GlassContainer>
        
        <GlassContainer>
          <h2 className="text-lg font-semibold mb-4">Equipamentos utilizados</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="h-8 w-8 rounded bg-slate-200 mr-2"></div>
              <span>Pincel de contorno facial</span>
            </li>
            <li className="flex items-center">
              <div className="h-8 w-8 rounded bg-slate-200 mr-2"></div>
              <span>Base líquida matte</span>
            </li>
            <li className="flex items-center">
              <div className="h-8 w-8 rounded bg-slate-200 mr-2"></div>
              <span>Contorno em pó</span>
            </li>
          </ul>
        </GlassContainer>
      </div>
    </ContentLayout>
  );
};

export default VideoPlayer;
