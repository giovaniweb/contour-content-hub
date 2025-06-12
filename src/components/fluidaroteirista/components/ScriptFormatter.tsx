
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart, Zap, CheckCircle } from 'lucide-react';

interface ScriptFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
    equipamentos_utilizados?: any[];
    disney_applied?: boolean;
  };
}

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;
  const wordCount = script.roteiro.split(/\s+/).length;

  return (
    <div className="space-y-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="aurora-glass p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Tempo</span>
          </div>
          <div className={`text-xl font-bold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
            {estimatedTime}s
          </div>
          <div className="text-xs text-blue-400">
            {isWithinTimeLimit ? '✅ Dentro do limite' : '⚠️ Excede 60s'}
          </div>
        </div>

        <div className="aurora-glass p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Palavras</span>
          </div>
          <div className="text-xl font-bold text-purple-400">{wordCount}</div>
          <div className="text-xs text-purple-400">~150 ideal</div>
        </div>

        <div className="aurora-glass p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">Emoção</span>
          </div>
          <div className="text-sm font-bold text-green-400 capitalize">{script.emocao_central}</div>
          <div className="text-xs text-green-400">{script.formato}</div>
        </div>

        <div className="aurora-glass p-4 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Equipamentos</span>
          </div>
          <div className="text-sm font-bold text-orange-400">
            {script.equipamentos_utilizados?.length || 0}
          </div>
          <div className="text-xs text-orange-400">integrados</div>
        </div>
      </div>

      {/* Roteiro Principal - Maior e Mais Destacado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="aurora-glass p-8 rounded-xl border border-cyan-500/30"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-300 mb-2">📝 Seu Roteiro</h2>
          <p className="text-cyan-400/80">Pronto para usar nas redes sociais</p>
        </div>
        
        <div className="text-slate-200 leading-relaxed text-xl whitespace-pre-line font-medium">
          {script.roteiro}
        </div>
      </motion.div>

      {/* Equipamentos Utilizados */}
      {script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="aurora-glass border border-indigo-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-300">
                <Zap className="h-5 w-5" />
                Equipamentos Integrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {script.equipamentos_utilizados.map((equipment, index) => (
                  <div key={index} className="aurora-glass p-4 rounded-lg border border-indigo-500/20">
                    <h4 className="font-semibold text-indigo-300 mb-2">{equipment.nome}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-slate-300"><strong>Tecnologia:</strong> {equipment.tecnologia}</div>
                      <div className="text-slate-300"><strong>Benefícios:</strong> {equipment.beneficios}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Aviso de Tempo */}
      {!isWithinTimeLimit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 aurora-glass border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-300">⚠️ Roteiro excede 60 segundos</h3>
              <p className="text-sm text-red-400 mt-1">
                Recomendamos encurtar para melhor engajamento nas redes sociais.
                Tempo atual: {estimatedTime}s | Ideal: 60s
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disney Applied Badge */}
      {script.disney_applied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 aurora-glass border border-yellow-500/30 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-300">
            <span className="text-2xl">✨</span>
            <span className="font-semibold">Disney Magic Aplicada por Walt Disney 1928</span>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-sm text-yellow-400 mt-1">
            Este roteiro foi transformado com os elementos narrativos da Disney
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ScriptFormatter;
