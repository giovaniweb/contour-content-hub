
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

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
  const hasEquipments = script.equipamentos_utilizados && script.equipamentos_utilizados.length > 0;

  // Verificar se equipamentos foram realmente utilizados no roteiro
  const equipmentUsedInScript = hasEquipments ? 
    script.equipamentos_utilizados.some(eq => 
      script.roteiro.toLowerCase().includes(eq.nome.toLowerCase())
    ) : false;

  return (
    <div className="space-y-6">
      {/* Layout Principal: 60/40 em desktop, stack em mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Roteiro Principal - 60% da largura em desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <Card className="aurora-glass border border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-300 text-center">
                📝 Seu Roteiro FLUIDA
              </CardTitle>
              <p className="text-cyan-400/80 text-center text-sm">
                Pronto para usar nas redes sociais
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium p-4 bg-slate-900/30 rounded-lg">
                {script.roteiro}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar de Informações - 40% da largura em desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Métricas Compactas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aurora-glass p-3 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">Tempo</span>
              </div>
              <div className={`text-lg font-bold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
                {estimatedTime}s
              </div>
              <div className="text-xs text-blue-400">
                {isWithinTimeLimit ? '✅ Ideal' : '⚠️ Longo'}
              </div>
            </div>

            <div className="aurora-glass p-3 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">Palavras</span>
              </div>
              <div className="text-lg font-bold text-purple-400">{wordCount}</div>
              <div className="text-xs text-purple-400">~150 ideal</div>
            </div>
          </div>

          {/* Status dos Equipamentos */}
          {hasEquipments && (
            <Card className={`aurora-glass border ${equipmentUsedInScript ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${equipmentUsedInScript ? 'text-green-400' : 'text-red-400'}`}>
                  {equipmentUsedInScript ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                  <span className="font-semibold text-sm">
                    {equipmentUsedInScript ? 'Equipamentos Integrados' : 'Equipamentos Não Utilizados'}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${equipmentUsedInScript ? 'text-green-300' : 'text-red-300'}`}>
                  {equipmentUsedInScript 
                    ? `${script.equipamentos_utilizados.length} equipamento(s) mencionado(s) no roteiro`
                    : `${script.equipamentos_utilizados.length} equipamento(s) selecionado(s) mas não utilizados`
                  }
                </p>
                {!equipmentUsedInScript && (
                  <div className="mt-2 text-xs text-red-400">
                    Equipamentos: {script.equipamentos_utilizados.map(eq => eq.nome).join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informações do Formato e Emoção */}
          <Card className="aurora-glass border border-indigo-500/20">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Emoção Central</span>
                </div>
                <div className="text-green-400 font-semibold capitalize">{script.emocao_central}</div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Target className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Formato</span>
                </div>
                <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                  {script.formato.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Disney Magic Badge */}
          {script.disney_applied && (
            <Card className="aurora-glass border border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-300">
                  <span className="text-lg">✨</span>
                  <span className="font-semibold text-sm">Disney Magic Aplicada</span>
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-xs text-yellow-400 mt-1">
                  Transformado com a narrativa mágica de Walt Disney 1928
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Equipamentos Detalhados - Apenas se utilizados */}
      {hasEquipments && equipmentUsedInScript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="aurora-glass border border-indigo-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-300">
                <Zap className="h-5 w-5" />
                Equipamentos Integrados no Roteiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {script.equipamentos_utilizados
                  .filter(equipment => script.roteiro.toLowerCase().includes(equipment.nome.toLowerCase()))
                  .map((equipment, index) => (
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
          className="p-4 aurora-glass border border-red-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Clock className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-300 text-sm">⚠️ Roteiro excede 60 segundos</h3>
              <p className="text-xs text-red-400 mt-1">
                Recomendamos encurtar para melhor engajamento. Tempo atual: {estimatedTime}s | Ideal: 60s
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScriptFormatter;
