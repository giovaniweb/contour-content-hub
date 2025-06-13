
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Target, Heart } from "lucide-react";
import { parseScriptContent, formatMentorName, formatScriptSections } from '../utils/scriptParser';

interface ImprovedScriptFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
    equipamentos_utilizados?: string[];
  };
}

const ImprovedScriptFormatter: React.FC<ImprovedScriptFormatterProps> = ({ script }) => {
  console.log('🎬 [ImprovedScriptFormatter] Processing script:', script);
  
  // Parse do conteúdo do script
  const parsedScript = parseScriptContent(script.roteiro);
  if (!parsedScript) {
    return (
      <div className="text-center py-8 text-slate-400">
        Erro ao processar o roteiro
      </div>
    );
  }
  
  const sections = formatScriptSections(parsedScript.roteiro);
  const mentorFormatted = formatMentorName(parsedScript.mentor);
  
  // Calcular tempo estimado de leitura
  const wordCount = parsedScript.roteiro.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 150); // 150 palavras por minuto
  
  return (
    <div className="space-y-6">
      {/* Header do Script */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 aurora-glass rounded-lg border border-aurora-electric-purple/20"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-aurora-electric-purple">
            <User className="h-5 w-5" />
            <span className="font-semibold">{mentorFormatted}</span>
          </div>
          <div className="flex items-center gap-2 text-aurora-sage">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{readingTime} min leitura</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple">
            {parsedScript.formato.toUpperCase()}
          </Badge>
          <Badge className="aurora-glass border-aurora-sage/30 text-aurora-sage">
            <Heart className="h-3 w-3 mr-1" />
            {parsedScript.emocao_central}
          </Badge>
        </div>
      </motion.div>

      {/* Objetivo do Script */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="aurora-glass border-aurora-electric-purple/20 bg-gradient-to-r from-aurora-electric-purple/5 to-aurora-sage/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-aurora-electric-purple" />
              <span className="font-semibold text-white">Objetivo:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{parsedScript.objetivo}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seções do Roteiro */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/20 hover:border-aurora-electric-purple/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 leading-relaxed text-base whitespace-pre-line">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Equipamentos Utilizados */}
      {script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="aurora-glass border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <span className="text-xl">🔧</span>
                Equipamentos Mencionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {script.equipamentos_utilizados.map((equipamento, index) => (
                  <Badge
                    key={index}
                    className="aurora-glass border-indigo-400/30 text-indigo-300 px-3 py-1"
                  >
                    ⚡ {equipamento}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Metadados do Script */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center p-4 aurora-glass rounded-lg border border-slate-700/50"
      >
        <div className="text-sm text-slate-400 space-y-1">
          <p>📊 <strong>Intenção:</strong> {parsedScript.intencao}</p>
          <p>🎯 <strong>Público:</strong> Interessados em {script.formato}</p>
          <p>📈 <strong>Formato:</strong> Otimizado para {parsedScript.formato}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ImprovedScriptFormatter;
