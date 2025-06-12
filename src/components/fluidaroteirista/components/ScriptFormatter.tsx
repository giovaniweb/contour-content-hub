
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart } from 'lucide-react';

interface ScriptFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
  };
}

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  // Dividir roteiro em seções baseado na estrutura FLUIDA
  const formatScript = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = { type: 'gancho', content: [] };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (i === 0) {
        currentSection = { type: 'gancho', content: [line] };
      } else if (i === lines.length - 1) {
        if (currentSection.type !== 'cta') {
          sections.push(currentSection);
          currentSection = { type: 'cta', content: [line] };
        } else {
          currentSection.content.push(line);
        }
      } else if (i <= 2) {
        if (currentSection.type === 'gancho') {
          currentSection.content.push(line);
        } else {
          sections.push(currentSection);
          currentSection = { type: 'problema', content: [line] };
        }
      } else {
        if (currentSection.type !== 'solucao') {
          sections.push(currentSection);
          currentSection = { type: 'solucao', content: [line] };
        } else {
          currentSection.content.push(line);
        }
      }
    }
    
    sections.push(currentSection);
    return sections;
  };

  const estimateReadingTime = (text: string): number => {
    // Aproximadamente 150 palavras por minuto para leitura em voz alta
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60);
  };

  const getSectionStyle = (type: string) => {
    switch (type) {
      case 'gancho':
        return 'from-red-500/10 to-pink-500/10 border-red-500/30';
      case 'problema':
        return 'from-orange-500/10 to-yellow-500/10 border-orange-500/30';
      case 'solucao':
        return 'from-green-500/10 to-emerald-500/10 border-green-500/30';
      case 'cta':
        return 'from-purple-500/10 to-blue-500/10 border-purple-500/30';
      default:
        return 'from-slate-500/10 to-gray-500/10 border-slate-500/30';
    }
  };

  const getSectionLabel = (type: string) => {
    switch (type) {
      case 'gancho':
        return '🎣 Gancho';
      case 'problema':
        return '⚡ Problema';
      case 'solucao':
        return '✨ Solução';
      case 'cta':
        return '🚀 Chamada para Ação';
      default:
        return '📝 Conteúdo';
    }
  };

  const sections = formatScript(script.roteiro);
  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;

  return (
    <div className="space-y-6">
      {/* Header com informações */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple">
            {script.formato}
          </Badge>
          <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
            <Heart className="h-3 w-3 mr-1" />
            {script.emocao_central}
          </Badge>
          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
            <Target className="h-3 w-3 mr-1" />
            {script.intencao}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className={`text-sm font-medium ${
            isWithinTimeLimit ? 'text-green-400' : 'text-red-400'
          }`}>
            ~{estimatedTime}s
          </span>
          {!isWithinTimeLimit && (
            <Badge variant="destructive" className="text-xs">
              Excede 60s
            </Badge>
          )}
        </div>
      </div>

      {/* Seções do roteiro */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className={`aurora-glass bg-gradient-to-r ${getSectionStyle(section.type)}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-white">
                    {getSectionLabel(section.type)}
                  </span>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {section.content.map((line, lineIndex) => (
                    <p key={lineIndex} className="text-slate-200 leading-relaxed mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Aviso se exceder tempo */}
      {!isWithinTimeLimit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              ⚠️ Roteiro excede 60 segundos. Considere encurtar para melhor engajamento.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScriptFormatter;
