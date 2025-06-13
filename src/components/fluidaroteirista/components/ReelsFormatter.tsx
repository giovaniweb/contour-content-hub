
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Camera, Volume2, Zap, Clock, Eye, Music } from 'lucide-react';
import CopyButton from '@/components/ui/CopyButton';
import { sanitizeText } from '../utils/textSanitizer';

interface ReelsFormatterProps {
  roteiro: string;
  formato: 'reels' | 'tiktok' | 'youtube_shorts' | 'youtube_video' | 'ads_video';
}

interface ReelsSection {
  tipo: 'gancho' | 'cena' | 'narracao' | 'transicao' | 'cta';
  tempo: string;
  conteudo: string;
  visual: string;
  audio?: string;
  efeitos?: string;
}

const getFormatConfig = (formato: string) => {
  const configs = {
    reels: { 
      title: 'Reels Instagram',
      maxDuration: '30s',
      icon: '📱',
      color: 'bg-gradient-to-br from-pink-500/10 to-purple-500/10',
      border: 'border-pink-400/30'
    },
    tiktok: { 
      title: 'TikTok',
      maxDuration: '60s',
      icon: '🎵',
      color: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10',
      border: 'border-cyan-400/30'
    },
    youtube_shorts: { 
      title: 'YouTube Shorts',
      maxDuration: '60s',
      icon: '📺',
      color: 'bg-gradient-to-br from-red-500/10 to-orange-500/10',
      border: 'border-red-400/30'
    },
    youtube_video: { 
      title: 'Vídeo YouTube',
      maxDuration: '5-10min',
      icon: '🎬',
      color: 'bg-gradient-to-br from-red-500/10 to-purple-500/10',
      border: 'border-red-400/30'
    },
    ads_video: { 
      title: 'Anúncio em Vídeo',
      maxDuration: '15-30s',
      icon: '📢',
      color: 'bg-gradient-to-br from-green-500/10 to-blue-500/10',
      border: 'border-green-400/30'
    }
  };
  return configs[formato as keyof typeof configs] || configs.reels;
};

const getSectionIcon = (tipo: string) => {
  const icons = {
    gancho: <Zap className="h-4 w-4 text-red-400" />,
    cena: <Camera className="h-4 w-4 text-blue-400" />,
    narracao: <Volume2 className="h-4 w-4 text-green-400" />,
    transicao: <Eye className="h-4 w-4 text-purple-400" />,
    cta: <Zap className="h-4 w-4 text-orange-400" />
  };
  return icons[tipo as keyof typeof icons] || <Camera className="h-4 w-4 text-gray-400" />;
};

const getSectionTheme = (tipo: string) => {
  const themes = {
    gancho: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/30' },
    cena: { bg: 'bg-blue-500/20',   text: 'text-blue-300', border: 'border-blue-400/30' },
    narracao: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-400/30' },
    transicao: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-400/30' },
    cta: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-400/30' }
  };
  return themes[tipo as keyof typeof themes] || themes.cena;
};

const parseReelsScript = (roteiro: string): ReelsSection[] => {
  const cleanScript = sanitizeText(roteiro);
  const sections: ReelsSection[] = [];
  
  // Dividir o script em seções baseado em indicadores comuns
  const lines = cleanScript.split('\n').filter(line => line.trim());
  
  let currentSection: Partial<ReelsSection> = {};
  
  for (const line of lines) {
    const cleanLine = sanitizeText(line);
    
    // Detectar início de nova seção
    if (cleanLine.match(/^(gancho|abertura|início)/i)) {
      if (currentSection.conteudo) sections.push(currentSection as ReelsSection);
      currentSection = { tipo: 'gancho', tempo: '0-3s' };
    } else if (cleanLine.match(/^(cena|visual|corte)/i)) {
      if (currentSection.conteudo) sections.push(currentSection as ReelsSection);
      currentSection = { tipo: 'cena', tempo: '3-10s' };
    } else if (cleanLine.match(/^(narração|fala|texto)/i)) {
      if (currentSection.conteudo) sections.push(currentSection as ReelsSection);
      currentSection = { tipo: 'narracao', tempo: '5-15s' };
    } else if (cleanLine.match(/^(transição|corte|mudança)/i)) {
      if (currentSection.conteudo) sections.push(currentSection as ReelsSection);
      currentSection = { tipo: 'transicao', tempo: '1-2s' };
    } else if (cleanLine.match(/^(cta|chamada|ação)/i)) {
      if (currentSection.conteudo) sections.push(currentSection as ReelsSection);
      currentSection = { tipo: 'cta', tempo: '3-5s' };
    } else {
      // Adicionar conteúdo à seção atual
      if (!currentSection.tipo) {
        currentSection = { tipo: 'gancho', tempo: '0-3s' };
      }
      
      if (cleanLine.includes('Visual:') || cleanLine.includes('Imagem:')) {
        currentSection.visual = sanitizeText(cleanLine.replace(/^(Visual|Imagem):\s*/i, ''));
      } else if (cleanLine.includes('Áudio:') || cleanLine.includes('Som:')) {
        currentSection.audio = sanitizeText(cleanLine.replace(/^(Áudio|Som):\s*/i, ''));
      } else if (cleanLine.includes('Efeito:')) {
        currentSection.efeitos = sanitizeText(cleanLine.replace(/^Efeito:\s*/i, ''));
      } else if (cleanLine.trim()) {
        currentSection.conteudo = currentSection.conteudo 
          ? currentSection.conteudo + ' ' + cleanLine
          : cleanLine;
      }
    }
  }
  
  // Adicionar última seção
  if (currentSection.conteudo) {
    sections.push(currentSection as ReelsSection);
  }
  
  // Se não conseguiu parsear, criar estrutura básica
  if (sections.length === 0) {
    const basicContent = cleanScript.substring(0, 200);
    sections.push({
      tipo: 'gancho',
      tempo: '0-5s',
      conteudo: basicContent || 'Conteúdo do roteiro',
      visual: 'Cena impactante e atrativa',
      audio: 'Música de fundo adequada ao tema'
    });
  }
  
  return sections;
};

const ReelsFormatter: React.FC<ReelsFormatterProps> = ({ roteiro, formato }) => {
  const config = getFormatConfig(formato);
  const sections = parseReelsScript(roteiro);
  
  return (
    <div className="space-y-6">
      {/* Header do Formato */}
      <Card className={`aurora-glass ${config.border} border-2 ${config.color}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-200">{config.title}</h3>
                <p className="text-sm text-slate-400">Duração recomendada: {config.maxDuration}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/30">
              <Clock className="h-3 w-3 mr-1" />
              {config.maxDuration}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Seções do Roteiro */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const theme = getSectionTheme(section.tipo);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`aurora-glass ${theme.border} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getSectionIcon(section.tipo)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${theme.bg} ${theme.text} ${theme.border} border text-xs`}>
                          {section.tipo.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/30 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {section.tempo}
                        </Badge>
                      </div>
                      <h4 className={`font-semibold ${theme.text} capitalize`}>
                        {section.tipo === 'gancho' ? 'Gancho/Abertura' :
                         section.tipo === 'cena' ? 'Cena Visual' :
                         section.tipo === 'narracao' ? 'Narração/Texto' :
                         section.tipo === 'transicao' ? 'Transição' : 'Call to Action'}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Conteúdo Principal */}
                    <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full aurora-pulse"></div>
                        <span className="text-sm font-medium text-cyan-400">Conteúdo</span>
                      </div>
                      <div className="text-slate-200 leading-relaxed text-sm aurora-body pr-12 whitespace-pre-wrap">
                        {section.conteudo}
                      </div>
                      <CopyButton 
                        text={section.conteudo}
                        successMessage={`Conteúdo da ${section.tipo} copiado!`}
                      />
                    </div>

                    {/* Visual */}
                    {section.visual && (
                      <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Camera className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">Direção Visual</span>
                        </div>
                        <div className="text-slate-300 text-sm italic aurora-body whitespace-pre-wrap">
                          {section.visual}
                        </div>
                      </div>
                    )}

                    {/* Áudio */}
                    {section.audio && (
                      <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Music className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">Direção de Áudio</span>
                        </div>
                        <div className="text-slate-300 text-sm italic aurora-body whitespace-pre-wrap">
                          {section.audio}
                        </div>
                      </div>
                    )}

                    {/* Efeitos */}
                    {section.efeitos && (
                      <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">Efeitos Especiais</span>
                        </div>
                        <div className="text-slate-300 text-sm italic aurora-body whitespace-pre-wrap">
                          {section.efeitos}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Roteiro Completo para Cópia */}
      <Card className="aurora-glass border-slate-600 border-2">
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-aurora-electric-purple rounded-full aurora-pulse"></div>
            <span className="text-sm font-medium text-aurora-electric-purple">Roteiro Completo</span>
          </div>
          <div className="text-slate-200 text-sm aurora-body pr-12 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded border border-slate-700">
            {roteiro}
          </div>
          <CopyButton 
            text={roteiro}
            successMessage="Roteiro completo copiado!"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReelsFormatter;
