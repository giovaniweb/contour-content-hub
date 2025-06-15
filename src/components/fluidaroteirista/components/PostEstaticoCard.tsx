import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type, MessageSquare, Eye, Instagram } from 'lucide-react';
import CopyButton from '@/components/ui/CopyButton';
import type { PostEstaticoData } from '../utils/postEstaticoParser';

interface PostEstaticoCardProps {
  data: PostEstaticoData;
}

const PostEstaticoCard: React.FC<PostEstaticoCardProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="aurora-glass border-aurora-electric-purple/30 relative overflow-hidden">
        {/* Background particles effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-aurora-electric-purple/5 via-aurora-neon-blue/5 to-aurora-soft-pink/5 opacity-50" />
        
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-aurora-electric-purple text-xl flex items-center gap-3 aurora-heading">
            <Instagram className="h-6 w-6 aurora-glow" />
            Preview do Post Instagram
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Simulação do Post Instagram */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-white/10 relative">
            {/* Header do Post (simulação) */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-full bg-aurora-gradient-primary"></div>
              <div>
                <div className="text-white font-medium text-sm">sua_clinica</div>
                <div className="text-gray-400 text-xs">há 2 minutos</div>
              </div>
            </div>
            
            {/* Área da Imagem com Texto Sobreposto */}
            <div className="relative bg-gradient-to-br from-aurora-neon-blue/20 to-aurora-electric-purple/20 rounded-lg p-8 mb-4 min-h-[200px] flex items-center justify-center border border-aurora-electric-purple/20">
              <div className="text-left text-white text-sm font-bold aurora-heading">
                📸
              </div>
              <div className="text-center">
                <div className="text-white text-2xl font-bold mb-2 aurora-heading">
                  {data.texto_imagem || 'Texto da Imagem'}
                </div>
                <div className="text-aurora-electric-purple text-sm opacity-75">
                  📸 {data.sugestao_visual || 'Imagem sugerida'}
                </div>
              </div>
              
              {/* Copy button para texto da imagem */}
              {data.texto_imagem && (
                <CopyButton 
                  text={data.texto_imagem}
                  successMessage="Texto da imagem copiado!"
                  className="top-3 right-3"
                />
              )}
              
              {/* Overlay de Texto Indicator */}
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30 text-xs">
                  <Type className="h-3 w-3 mr-1" />
                  Texto Overlay
                </Badge>
              </div>
            </div>
            
            {/* Legenda do Post */}
            <div className="space-y-3 relative">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-aurora-soft-pink mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white text-sm leading-relaxed">
                    <span className="font-medium text-aurora-soft-pink">sua_clinica</span>{' '}
                    {data.legenda || 'Legenda do post aparecerá aqui...'}
                  </div>
                </div>
              </div>
              
              {/* Copy button para legenda */}
              {data.legenda && (
                <CopyButton 
                  text={data.legenda}
                  successMessage="Legenda copiada!"
                  className="top-0 right-0"
                />
              )}
              
              {/* Simulação de ações do Instagram */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>❤️ 127 curtidas</span>
                  <span>💬 23 comentários</span>
                </div>
                <span className="text-xs text-gray-500">📤 Compartilhar</span>
              </div>
            </div>
          </div>
          
          {/* Detalhes Técnicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Texto da Imagem */}
            <motion.div
              className="aurora-glass p-4 rounded-lg border border-aurora-electric-purple/20 relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Type className="h-5 w-5 text-aurora-electric-purple" />
                <h4 className="font-semibold aurora-heading text-aurora-electric-purple">Texto da Imagem</h4>
              </div>
              <p className="text-sm aurora-body text-slate-300 leading-relaxed pr-12">
                {data.texto_imagem || 'Texto para sobrepor na imagem'}
              </p>
              <div className="mt-2 text-xs text-aurora-electric-purple/60">
                Máximo 8 palavras • Grande e legível
              </div>
              {data.texto_imagem && (
                <CopyButton 
                  text={data.texto_imagem}
                  successMessage="Texto da imagem copiado!"
                />
              )}
            </motion.div>
            
            {/* Legenda Completa */}
            <motion.div
              className="aurora-glass p-4 rounded-lg border border-aurora-soft-pink/20 relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-aurora-soft-pink" />
                <h4 className="font-semibold aurora-heading text-aurora-soft-pink">Legenda do Post</h4>
              </div>
              <p className="text-sm aurora-body text-slate-300 leading-relaxed pr-12">
                {data.legenda || 'Legenda completa para o post'}
              </p>
              <div className="mt-2 text-xs text-aurora-soft-pink/60">
                Máximo 150 palavras • Call-to-action incluído
              </div>
              {data.legenda && (
                <CopyButton 
                  text={data.legenda}
                  successMessage="Legenda copiada!"
                />
              )}
            </motion.div>
          </div>
          
          {/* Sugestão Visual */}
          {data.sugestao_visual && (
            <motion.div
              className="aurora-glass p-4 rounded-lg border border-aurora-emerald/20 relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-5 w-5 text-aurora-emerald" />
                <h4 className="font-semibold aurora-heading text-aurora-emerald">Sugestão Visual</h4>
              </div>
              <p className="text-sm aurora-body text-slate-300 leading-relaxed pr-12">
                {data.sugestao_visual}
              </p>
              <CopyButton 
                text={data.sugestao_visual}
                successMessage="Sugestão visual copiada!"
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostEstaticoCard;
