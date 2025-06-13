import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import CarouselFormatter from './CarouselFormatter';
import Stories10xFormatter from './Stories10xFormatter';

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
    script.equipamentos_utilizados.some(eq => {
      const equipmentName = typeof eq === 'string' ? eq : (eq?.nome || '');
      return script.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
    }) : false;

  // Função auxiliar para obter nome do equipamento
  const getEquipmentName = (equipment: any): string => {
    if (typeof equipment === 'string') return equipment;
    if (equipment && typeof equipment === 'object' && equipment.nome) return equipment.nome;
    return 'Equipamento não especificado';
  };

  // Renderização condicional baseada no formato
  const renderScriptContent = () => {
    if (script.formato.toLowerCase() === 'carrossel') {
      return <CarouselFormatter roteiro={script.roteiro} />;
    }

    if (script.formato.toLowerCase() === 'stories_10x') {
      return <Stories10xFormatter roteiro={script.roteiro} />;
    }

    // Renderização padrão para outros formatos
    return (
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
              Formato: {script.formato.toUpperCase()}
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-slate-200 leading-relaxed text-lg whitespace-pre-line font-medium p-8 bg-slate-900/30 rounded-lg min-h-[300px] w-full">
              {script.roteiro}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Conteúdo Principal do Roteiro */}
      {renderScriptContent()}

      {/* Métricas Básicas - Layout Horizontal Compacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {/* Tempo de Leitura */}
        <div className="aurora-glass border border-blue-500/20 p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Tempo</span>
          </div>
          <div className={`text-lg font-bold ${isWithinTimeLimit ? 'text-green-400' : 'text-red-400'}`}>
            {estimatedTime}s
          </div>
        </div>

        {/* Contagem de Palavras */}
        <div className="aurora-glass border border-purple-500/20 p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Palavras</span>
          </div>
          <div className="text-lg font-bold text-purple-400">{wordCount}</div>
        </div>

        {/* Emoção Central */}
        <div className="aurora-glass border border-green-500/20 p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="h-4 w-4 text-green-400" />
            <span className="text-xs font-medium text-green-300">Emoção</span>
          </div>
          <div className="text-sm font-bold text-green-400 capitalize">{script.emocao_central}</div>
        </div>

        {/* Formato */}
        <div className="aurora-glass border border-indigo-500/20 p-3 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">Formato</span>
          </div>
          <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 text-xs">
            {script.formato === 'stories_10x' ? 'STORIES 10X' : script.formato.toUpperCase()}
          </Badge>
        </div>
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
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    {equipmentUsedInScript ? 'Equipamentos Integrados ✅' : 'Equipamentos Não Utilizados ⚠️'}
                  </h3>
                  <p className={`text-xs mt-1 ${equipmentUsedInScript ? 'text-green-300' : 'text-red-300'}`}>
                    {equipmentUsedInScript 
                      ? `${script.equipamentos_utilizados.length} equipamento(s) mencionado(s) no roteiro`
                      : `${script.equipamentos_utilizados.length} equipamento(s) selecionado(s) mas não utilizados no roteiro`
                    }
                  </p>
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
                <span className="text-xl">✨</span>
                <span className="font-bold">Disney Magic Aplicada!</span>
                <span className="text-xl">✨</span>
              </div>
              <p className="text-yellow-400 mt-2 text-sm">
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
              <CardTitle className="flex items-center gap-2 text-indigo-300 text-lg">
                <Zap className="h-5 w-5" />
                Equipamentos Integrados no Roteiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {script.equipamentos_utilizados
                  .filter(equipment => {
                    const equipmentName = getEquipmentName(equipment);
                    return script.roteiro.toLowerCase().includes(equipmentName.toLowerCase());
                  })
                  .map((equipment, index) => {
                    const equipmentName = getEquipmentName(equipment);
                    const equipmentTech = typeof equipment === 'object' && equipment.tecnologia ? equipment.tecnologia : 'Tecnologia avançada';
                    const equipmentBenefits = typeof equipment === 'object' && equipment.beneficios ? equipment.beneficios : 'Múltiplos benefícios estéticos';
                    
                    return (
                      <div key={index} className="aurora-glass p-4 rounded-lg border border-indigo-500/20">
                        <h4 className="font-semibold text-indigo-300 mb-2">{equipmentName}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-slate-300"><strong>Tecnologia:</strong> {equipmentTech}</div>
                          <div className="text-slate-300"><strong>Benefícios:</strong> {equipmentBenefits}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Aviso de Tempo - Apenas se necessário */}
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
                  <Clock className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-300 text-sm">⚠️ Roteiro excede 60 segundos</h3>
                  <p className="text-xs text-red-400 mt-1">
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
