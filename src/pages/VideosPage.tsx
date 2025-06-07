
import React from 'react';
import AuroraLayout from '@/components/layout/AuroraLayout';
import AuroraCard from '@/components/ui/AuroraCard';
import AuroraButton from '@/components/ui/AuroraButton';
import { Video, Plus, Play, Download, Share2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const VideosPage: React.FC = () => {
  // Mock data para demonstração
  const videos = [
    {
      id: 1,
      title: "Vídeo Promocional - Produto X",
      thumbnail: "/api/placeholder/300/200",
      duration: "1:30",
      status: "Publicado",
      views: "2.4k",
      createdAt: "2024-06-01"
    },
    {
      id: 2,
      title: "Tutorial Educativo",
      thumbnail: "/api/placeholder/300/200",
      duration: "3:45",
      status: "Em Edição",
      views: "856",
      createdAt: "2024-06-03"
    },
    {
      id: 3,
      title: "Story de Sucesso",
      thumbnail: "/api/placeholder/300/200",
      duration: "2:15",
      status: "Rascunho",
      views: "0",
      createdAt: "2024-06-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado':
        return 'text-aurora-emerald';
      case 'Em Edição':
        return 'text-aurora-neon-blue';
      case 'Rascunho':
        return 'text-aurora-soft-pink';
      default:
        return 'text-white/70';
    }
  };

  return (
    <AuroraLayout 
      title="Biblioteca de Vídeos" 
      subtitle="Gerencie seus vídeos e conteúdo visual"
    >
      <div className="p-6 space-y-8">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 className="aurora-heading text-2xl font-light text-white mb-2">
              Seus Vídeos
            </h2>
            <p className="aurora-body text-white/70">
              {videos.length} vídeos na biblioteca
            </p>
          </div>
          <div className="flex gap-3">
            <AuroraButton variant="secondary">
              <Upload className="w-5 h-5 mr-2" />
              Upload
            </AuroraButton>
            <AuroraButton>
              <Plus className="w-5 h-5 mr-2" />
              Novo Vídeo
            </AuroraButton>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AuroraCard floating className="overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    <span className="text-white text-xs">{video.duration}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm ${getStatusColor(video.status)}`}>
                      {video.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="aurora-heading text-white font-medium mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <span>{video.views} visualizações</span>
                    <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Play className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                    <button className="px-3 py-1 text-xs bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white rounded-md hover:opacity-80 transition-opacity">
                      Editar
                    </button>
                  </div>
                </div>
              </AuroraCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <AuroraCard className="max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="aurora-heading text-xl font-medium text-white mb-2">
                Nenhum vídeo ainda
              </h3>
              <p className="aurora-body text-white/70 mb-6">
                Comece criando ou fazendo upload do seu primeiro vídeo
              </p>
              <div className="flex gap-3 justify-center">
                <AuroraButton variant="secondary">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload
                </AuroraButton>
                <AuroraButton>
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Vídeo
                </AuroraButton>
              </div>
            </AuroraCard>
          </motion.div>
        )}
      </div>
    </AuroraLayout>
  );
};

export default VideosPage;
