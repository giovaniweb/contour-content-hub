
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Roteiro Principal - Largura Total */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="aurora-glass border border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-center text-2xl">
              📝 Seu Roteiro FLUIDA
            </CardTitle>
            <p className="text-cyan-400/80 text-center">
              Pronto para usar nas redes sociais
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium p-6 bg-slate-900/30 rounded-lg min-h-[200px]">
              {script.roteiro}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas e Informações - Grid Horizontal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Tempo de Leitura */}
        <Card className="aurora-glass border border-blue-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Tempo</span>
            </div>
            <div className={`text-2xl font-bold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
              {estimatedTime}s
            </div>
            <div className="text-xs text-blue-400 mt-1">
              {isWithinTimeLimit ? '✅ Ideal' : '⚠️ Longo'}
            </div>
          </CardContent>
        </Card>

        {/* Contagem de Palavras */}
        <Card className="aurora-glass border border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Palavras</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{wordCount}</div>
            <div className="text-xs text-purple-400 mt-1">~150 ideal</div>
          </CardContent>
        </Card>

        {/* Emoção Central */}
        <Card className="aurora-glass border border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-300">Emoção</span>
            </div>
            <div className="text-lg font-bold text-green-400 capitalize">{script.emocao_central}</div>
            <div className="text-xs text-green-400 mt-1">Central</div>
          </CardContent>
        </Card>

        {/* Formato */}
        <Card className="aurora-glass border border-indigo-500/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Formato</span>
            </div>
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 text-sm">
              {script.formato.toUpperCase()}
            </Badge>
            <div className="text-xs text-indigo-400 mt-1">Selecionado</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status dos Equipamentos */}
      {hasEquipments && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`aurora-glass border ${equipmentUsedInScript ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <CardContent className="p-4">
              <div className={`flex items-center gap-3 ${equipmentUsedInScript ? 'text-green-400' : 'text-red-400'}`}>
                {equipmentUsedInScript ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <AlertTriangle className="h-6 w-6" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {equipmentUsedInScript ? 'Equipamentos Integrados ✅' : 'Equipamentos Não Utilizados ⚠️'}
                  </h3>
                  <p className={`text-sm mt-1 ${equipmentUsedInScript ? 'text-green-300' : 'text-red-300'}`}>
                    {equipmentUsedInScript 
                      ? `${script.equipamentos_utilizados.length} equipamento(s) mencionado(s) no roteiro`
                      : `${script.equipamentos_utilizados.length} equipamento(s) selecionado(s) mas não utilizados no roteiro`
                    }
                  </p>
                  {!equipmentUsedInScript && (
                    <div className="mt-2 text-sm text-red-400 bg-red-500/10 p-2 rounded">
                      <strong>Equipamentos selecionados:</strong> {script.equipamentos_utilizados.map(eq => eq.nome).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Disney Magic Badge */}
      {script.disney_applied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="aurora-glass border border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-3 text-yellow-300">
                <span className="text-2xl">✨</span>
                <span className="font-bold text-lg">Disney Magic Aplicada!</span>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-yellow-400 mt-2">
                Transformado com a narrativa mágica de Walt Disney 1928
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Equipamentos Detalhados - Apenas se utilizados */}
      {hasEquipments && equipmentUsedInScript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
        >
          <Card className="aurora-glass border border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Clock className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-300">⚠️ Roteiro excede 60 segundos</h3>
                  <p className="text-sm text-red-400 mt-1">
                    Recomendamos encurtar para melhor engajamento. Tempo atual: {estimatedTime}s | Ideal: 60s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ScriptFormatter;
