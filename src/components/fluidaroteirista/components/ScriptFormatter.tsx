
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Heart, Zap, CheckCircle, ArrowRight } from 'lucide-react';

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

interface ScriptSection {
  type: string;
  content: string[];
  icon: React.ComponentType<any>;
  color: string;
  title: string;
  description: string;
}

const ScriptFormatter: React.FC<ScriptFormatterProps> = ({ script }) => {
  const formatScript = (content: string): ScriptSection[] => {
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    // Detectar seções baseado em palavras-chave e posição
    const sections: ScriptSection[] = [];
    let currentSection: ScriptSection = { 
      type: 'gancho', 
      content: [], 
      icon: Zap, 
      color: 'from-red-500 to-orange-500',
      title: '🎣 Gancho Irresistível',
      description: 'Captura atenção nos primeiros segundos'
    };
    
    paragraphs.forEach((paragraph, index) => {
      const p = paragraph.trim();
      
      if (index === 0 || p.toLowerCase().includes('você') || p.includes('?')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { 
          type: 'gancho', 
          content: [p], 
          icon: Zap, 
          color: 'from-red-500 to-orange-500',
          title: '🎣 Gancho Irresistível',
          description: 'Captura atenção nos primeiros segundos'
        };
      } else if (p.toLowerCase().includes('problema') || p.toLowerCase().includes('dificuld') || p.toLowerCase().includes('sofre')) {
        if (currentSection.type !== 'problema') {
          sections.push(currentSection);
          currentSection = { 
            type: 'problema', 
            content: [p], 
            icon: Target, 
            color: 'from-orange-500 to-yellow-500',
            title: '⚡ Problema Identificado',
            description: 'Dor que seu público sente'
          };
        } else {
          currentSection.content.push(p);
        }
      } else if (p.toLowerCase().includes('solução') || p.toLowerCase().includes('tratamento') || p.toLowerCase().includes('resultado')) {
        if (currentSection.type !== 'solucao') {
          sections.push(currentSection);
          currentSection = { 
            type: 'solucao', 
            content: [p], 
            icon: CheckCircle, 
            color: 'from-green-500 to-emerald-500',
            title: '✨ Solução Transformadora',
            description: 'Como resolver com seus equipamentos'
          };
        } else {
          currentSection.content.push(p);
        }
      } else if (p.toLowerCase().includes('agende') || p.toLowerCase().includes('contato') || p.toLowerCase().includes('clique')) {
        if (currentSection.type !== 'cta') {
          sections.push(currentSection);
          currentSection = { 
            type: 'cta', 
            content: [p], 
            icon: ArrowRight, 
            color: 'from-purple-500 to-blue-500',
            title: '🚀 Chamada para Ação',
            description: 'Próximo passo do cliente'
          };
        } else {
          currentSection.content.push(p);
        }
      } else {
        currentSection.content.push(p);
      }
    });
    
    if (currentSection.content.length > 0) sections.push(currentSection);
    return sections;
  };

  const estimateReadingTime = (text: string): number => {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60); // 150 palavras/minuto
  };

  const sections = formatScript(script.roteiro);
  const estimatedTime = estimateReadingTime(script.roteiro);
  const isWithinTimeLimit = estimatedTime <= 60;
  const wordCount = script.roteiro.split(/\s+/).length;

  return (
    <div className="space-y-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Tempo</span>
          </div>
          <div className={`text-xl font-bold ${isWithinTimeLimit ? 'text-green-600' : 'text-red-600'}`}>
            {estimatedTime}s
          </div>
          <div className="text-xs text-blue-600">
            {isWithinTimeLimit ? '✅ Dentro do limite' : '⚠️ Excede 60s'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Palavras</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{wordCount}</div>
          <div className="text-xs text-purple-600">~150 ideal</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Emoção</span>
          </div>
          <div className="text-sm font-bold text-green-600 capitalize">{script.emocao_central}</div>
          <div className="text-xs text-green-600">{script.formato}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Equipamentos</span>
          </div>
          <div className="text-sm font-bold text-orange-600">
            {script.equipamentos_utilizados?.length || 0}
          </div>
          <div className="text-xs text-orange-600">integrados</div>
        </div>
      </div>

      {/* Seções do Roteiro */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className={`relative overflow-hidden border-0 bg-gradient-to-r ${section.color} p-[1px] rounded-xl`}>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                      <section.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="space-y-3">
                    {section.content.map((text, textIndex) => (
                      <div key={textIndex} className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
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
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <Zap className="h-5 w-5" />
                Equipamentos Integrados no Roteiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {script.equipamentos_utilizados.map((equipment, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-2">{equipment.nome}</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Tecnologia:</strong> {equipment.tecnologia}</div>
                      <div><strong>Benefícios:</strong> {equipment.beneficios}</div>
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
          className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">⚠️ Roteiro excede 60 segundos</h3>
              <p className="text-sm text-red-600 mt-1">
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
          className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-800">
            <span className="text-2xl">✨</span>
            <span className="font-semibold">Disney Magic Aplicada por Walt Disney 1928</span>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Este roteiro foi transformado com os elementos narrativos da Disney
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ScriptFormatter;
