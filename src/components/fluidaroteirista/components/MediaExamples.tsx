import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Images, 
  Volume2, 
  FileText, 
  Play, 
  Camera,
  Instagram,
  Video,
  Mic
} from "lucide-react";
import { motion } from 'framer-motion';

interface MediaExamplesProps {
  format: string;
}

const MediaExamples: React.FC<MediaExamplesProps> = ({ format }) => {
  const formatLc = format.toLowerCase();

  // Exemplos específicos para cada formato
  const getMediaExamples = () => {
    if (formatLc.includes('carrossel') || formatLc.includes('carousel')) {
      return {
        type: 'images',
        title: 'Múltiplas Imagens para Carrossel',
        icon: <Images className="w-5 h-5" />,
        description: 'Será gerado um conjunto de imagens sequenciais para criar seu carrossel no Instagram',
        examples: [
          {
            title: 'Slide 1 - Abertura',
            description: 'Imagem de impacto com título principal',
            visual: '📸 Foto profissional do resultado'
          },
          {
            title: 'Slide 2 - Problema',
            description: 'Visual demonstrando o problema',
            visual: '📊 Infográfico ou comparação'
          },
          {
            title: 'Slide 3 - Solução',
            description: 'Equipamento ou procedimento em ação',
            visual: '⚡ Tecnologia sendo aplicada'
          },
          {
            title: 'Slide 4 - Resultado',
            description: 'Antes e depois ou benefícios',
            visual: '✨ Transformação visual'
          },
          {
            title: 'Slide 5 - CTA',
            description: 'Chamada para ação com contato',
            visual: '📞 Informações de contato'
          }
        ]
      };
    }

    if (formatLc.includes('stories') || formatLc.includes('story')) {
      return {
        type: 'audio',
        title: 'Narração para Stories',
        icon: <Volume2 className="w-5 h-5" />,
        description: 'Será gerado áudio profissional para narrar seus Stories com timing perfeito',
        examples: [
          {
            title: 'Narração Natural',
            description: 'Voz humana com entonação adequada',
            visual: '🎙️ Tom conversacional e próximo'
          },
          {
            title: 'Timing Perfeito',
            description: 'Duração ideal para cada Story (10-15s)',
            visual: '⏱️ Cadência otimizada para engagement'
          },
          {
            title: 'Qualidade Studio',
            description: 'Áudio limpo e profissional',
            visual: '🎧 Qualidade broadcast'
          }
        ],
        mediaPreview: [
          { type: 'Stories Inspiracionais', icon: '📱', example: 'stories-exemplo-1.jpg' },
          { type: 'Stories Educativos', icon: '🎓', example: 'stories-exemplo-2.jpg' },
          { type: 'Stories Resultados', icon: '✨', example: 'stories-exemplo-3.jpg' }
        ]
      };
    }

    if (formatLc.includes('reels') || formatLc.includes('reel')) {
      return {
        type: 'audio',
        title: 'OFF para Reels',
        icon: <Mic className="w-5 h-5" />,
        description: 'Será gerado áudio de locução profissional sincronizado com seu Reels',
        examples: [
          {
            title: 'Locução Dinâmica',
            description: 'Narração energética para Reels',
            visual: '🎬 Tom empolgante e cativante'
          },
          {
            title: 'Timing para Vídeo',
            description: 'Sincronização perfeita com cortes',
            visual: '🎯 Pausas estratégicas para edição'
          },
          {
            title: 'Hook Poderoso',
            description: 'Início impactante nos primeiros 3s',
            visual: '⚡ Gancho que prende atenção'
          }
        ],
        mediaPreview: [
          { type: 'Reels Tratamentos', icon: '💉', example: 'reels-exemplo-1.mp4' },
          { type: 'Reels Equipamentos', icon: '⚙️', example: 'reels-exemplo-2.mp4' },
          { type: 'Reels Resultados', icon: '🔥', example: 'reels-exemplo-3.mp4' }
        ]
      };
    }

    if (formatLc.includes('vídeo longo') || formatLc.includes('video longo') || formatLc.includes('video_longo') || formatLc.includes('long-form')) {
      return {
        type: 'audio',
        title: 'Narração para Vídeo Longo',
        icon: <Video className="w-5 h-5" />,
        description: 'Será gerado áudio completo para vídeos educativos longos (5-15 minutos)',
        examples: [
          {
            title: 'Narração Educativa',
            description: 'Tom professoral e didático',
            visual: '👨‍🏫 Explicação clara e detalhada'
          },
          {
            title: 'Estrutura Completa',
            description: 'Introdução, desenvolvimento e conclusão',
            visual: '📚 Roteiro bem estruturado'
          },
          {
            title: 'Pausas Estratégicas',
            description: 'Marcações para inserir imagens/gráficos',
            visual: '⏸️ Momentos para recursos visuais'
          }
        ],
        mediaPreview: [
          { type: 'Vídeos Educativos', icon: '🎓', example: 'video-longo-1.mp4' },
          { type: 'Webinars', icon: '💻', example: 'video-longo-2.mp4' },
          { type: 'Masterclass', icon: '🏆', example: 'video-longo-3.mp4' }
        ]
      };
    }

    if (formatLc.includes('artigo') || formatLc.includes('article') || formatLc.includes('blog')) {
      return {
        type: 'text',
        title: 'Artigo Completo',
        icon: <FileText className="w-5 h-5" />,
        description: 'Texto otimizado para SEO e engajamento em blogs e redes sociais',
        examples: [
          {
            title: 'SEO Otimizado',
            description: 'Palavras-chave estratégicas',
            visual: '🎯 Rankeamento no Google'
          },
          {
            title: 'Estrutura Profissional',
            description: 'Títulos, subtítulos e parágrafos bem organizados',
            visual: '📄 Formatação jornalística'
          },
          {
            title: 'CTA Integrado',
            description: 'Chamadas para ação naturais no texto',
            visual: '🔗 Conversão estratégica'
          }
        ],
        mediaPreview: [
          { type: 'Artigos Científicos', icon: '🔬', example: 'artigo-cientifico.jpg' },
          { type: 'Blog Posts', icon: '📝', example: 'blog-post.jpg' },
          { type: 'E-books', icon: '📖', example: 'ebook.jpg' }
        ]
      };
    }

    return null;
  };

  const mediaInfo = getMediaExamples();

  if (!mediaInfo) {
    return null;
  }

  const getTypeColor = (type: string) => {
    const colors = {
      images: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      audio: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      text: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    };
    return colors[type as keyof typeof colors] || colors.text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            {mediaInfo.icon}
            {mediaInfo.title}
          </CardTitle>
          <p className="text-slate-400 text-xs">
            {mediaInfo.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de mídia gerada */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getTypeColor(mediaInfo.type)}>
              {mediaInfo.type === 'images' && '🖼️ Múltiplas Imagens'}
              {mediaInfo.type === 'audio' && '🎵 Áudio Profissional'}
              {mediaInfo.type === 'text' && '📝 Apenas Texto'}
            </Badge>
          </div>

          {/* Exemplos do que será gerado */}
          <div className="space-y-2">
            <h4 className="text-white font-medium text-xs">O que será gerado:</h4>
            {mediaInfo.examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-2 bg-slate-700/30 rounded border border-slate-600/30"
              >
                <span className="text-xs font-medium text-white mt-0.5">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">
                    {example.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {example.description}
                  </div>
                  <div className="text-xs text-slate-300 mt-1 bg-slate-600/20 rounded px-2 py-1">
                    {example.visual}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Preview de exemplos visuais */}
          {mediaInfo.mediaPreview && (
            <div className="space-y-2">
              <h4 className="text-white font-medium text-xs">Exemplos de referência:</h4>
              <div className="grid grid-cols-1 gap-2">
                {mediaInfo.mediaPreview.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 p-2 bg-slate-700/20 rounded border border-slate-600/20"
                  >
                    <span className="text-lg">{preview.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-300">
                        {preview.type}
                      </div>
                    </div>
                    <Play className="w-3 h-3 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MediaExamples;