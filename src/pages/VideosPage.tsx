
import React from 'react';
import { motion } from 'framer-motion';
import AuroraLayout from '@/components/layout/AuroraLayout';
import AuroraCard from '@/components/ui/AuroraCard';
import AuroraButton from '@/components/ui/AuroraButton';
import GlassContainer from '@/components/ui/GlassContainer';
import { Video, Play, Upload, Search, Filter, Grid3X3, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

const VideosPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const videos = [
    {
      id: 1,
      title: "Skincare para Pele Oleosa",
      thumbnail: "/api/placeholder/400/225",
      duration: "5:23",
      views: "2.1k",
      status: "published",
      emotion: 8
    },
    {
      id: 2,
      title: "Maquiagem Natural para o Trabalho",
      thumbnail: "/api/placeholder/400/225", 
      duration: "8:45",
      views: "1.8k",
      status: "draft",
      emotion: 7
    },
    {
      id: 3,
      title: "Cuidados Noturnos Essenciais",
      thumbnail: "/api/placeholder/400/225",
      duration: "6:12",
      views: "3.2k",
      status: "published",
      emotion: 9
    }
  ];

  return (
    <AuroraLayout 
      title="Biblioteca Mágica" 
      subtitle="Organize e gerencie seus vídeos com inteligência emocional"
    >
      <div className="p-6">
        {/* Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.VIDEOS.CREATE)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-lavender to-aurora-teal mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Video className="h-6 w-6 text-white" />
              </motion.div>
              <span className="aurora-body text-white font-medium">Criar Vídeo</span>
            </AuroraCard>

            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.VIDEOS.IMPORT)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-turquoise mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Upload className="h-6 w-6 text-white" />
              </motion.div>
              <span className="aurora-body text-white font-medium">Importar</span>
            </AuroraCard>

            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.VIDEOS.STORAGE)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-deep-violet to-aurora-soft-pink mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Search className="h-6 w-6 text-white" />
              </motion.div>
              <span className="aurora-body text-white font-medium">Buscar</span>
            </AuroraCard>

            <AuroraCard 
              floating
              onClick={() => navigate(ROUTES.VIDEOS.BATCH)}
              className="cursor-pointer text-center p-6"
            >
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-aurora-soft-pink to-aurora-electric-blue mx-auto mb-4 w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Filter className="h-6 w-6 text-white" />
              </motion.div>
              <span className="aurora-body text-white font-medium">Gerenciar</span>
            </AuroraCard>
          </div>
        </motion.div>

        {/* Video Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassContainer aurora className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="aurora-heading text-xl font-medium text-white">
                Seus Vídeos
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <AuroraButton onClick={() => navigate(ROUTES.VIDEOS.CREATE)}>
                  <Video className="w-4 h-4 mr-2" />
                  Novo Vídeo
                </AuroraButton>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AuroraCard className="overflow-hidden cursor-pointer group">
                      <div className="relative">
                        <div className="aspect-video bg-gradient-to-br from-aurora-lavender/20 to-aurora-teal/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="aurora-body font-medium text-white mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span>{video.views} visualizações</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            video.status === 'published' 
                              ? 'bg-aurora-teal/20 text-aurora-teal' 
                              : 'bg-aurora-soft-pink/20 text-aurora-soft-pink'
                          }`}>
                            {video.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>
                    </AuroraCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AuroraCard className="p-4 hover:bg-white/5 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-14 bg-gradient-to-br from-aurora-lavender/20 to-aurora-teal/20 rounded flex items-center justify-center flex-shrink-0">
                          <Play className="w-6 h-6 text-white/80" />
                        </div>
                        <div className="flex-1">
                          <h3 className="aurora-body font-medium text-white">
                            {video.title}
                          </h3>
                          <p className="aurora-body text-white/60 text-sm">
                            {video.views} visualizações • {video.duration}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          video.status === 'published' 
                            ? 'bg-aurora-teal/20 text-aurora-teal' 
                            : 'bg-aurora-soft-pink/20 text-aurora-soft-pink'
                        }`}>
                          {video.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                    </AuroraCard>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassContainer>
        </motion.div>
      </div>
    </AuroraLayout>
  );
};

export default VideosPage;
