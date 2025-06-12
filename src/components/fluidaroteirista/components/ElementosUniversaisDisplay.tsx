
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Pen, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  GraduationCap, 
  Heart, 
  Megaphone, 
  Wrench 
} from "lucide-react";

interface ElementosUniversais {
  storytelling: number;
  copywriting: number;
  conhecimento_publico: number;
  analises_dados: number;
  gatilhos_mentais: number;
  logica_argumentativa: number;
  premissas_educativas: number;
  mapas_empatia: number;
  headlines: number;
  ferramentas_especificas: number;
}

interface ElementosUniversaisDisplayProps {
  elementos: ElementosUniversais;
  mentor: string;
  especialidades?: string[];
}

const ELEMENTOS_CONFIG = [
  {
    key: 'storytelling',
    label: 'Storytelling',
    icon: Brain,
    description: 'Narrativas envolventes',
    color: 'text-purple-500'
  },
  {
    key: 'copywriting',
    label: 'Copywriting',
    icon: Pen,
    description: 'Textos persuasivos',
    color: 'text-blue-500'
  },
  {
    key: 'conhecimento_publico',
    label: 'Conhecimento do Público',
    icon: Users,
    description: 'Segmentação precisa',
    color: 'text-green-500'
  },
  {
    key: 'analises_dados',
    label: 'Análises e Dados',
    icon: BarChart3,
    description: 'Métricas e otimização',
    color: 'text-orange-500'
  },
  {
    key: 'gatilhos_mentais',
    label: 'Gatilhos Mentais',
    icon: Zap,
    description: 'Escassez e urgência',
    color: 'text-yellow-500'
  },
  {
    key: 'logica_argumentativa',
    label: 'Lógica Argumentativa',
    icon: Target,
    description: 'Argumentos convincentes',
    color: 'text-red-500'
  },
  {
    key: 'premissas_educativas',
    label: 'Premissas Educativas',
    icon: GraduationCap,
    description: 'Educação antes da oferta',
    color: 'text-indigo-500'
  },
  {
    key: 'mapas_empatia',
    label: 'Mapas de Empatia',
    icon: Heart,
    description: 'Perspectiva do cliente',
    color: 'text-pink-500'
  },
  {
    key: 'headlines',
    label: 'Headlines',
    icon: Megaphone,
    description: 'Títulos magnéticos',
    color: 'text-cyan-500'
  },
  {
    key: 'ferramentas_especificas',
    label: 'Ferramentas Específicas',
    icon: Wrench,
    description: 'CTAs e funis',
    color: 'text-gray-500'
  }
];

const ElementosUniversaisDisplay: React.FC<ElementosUniversaisDisplayProps> = ({
  elementos,
  mentor,
  especialidades = []
}) => {
  const getIntensityLabel = (valor: number) => {
    if (valor >= 9) return 'Máxima';
    if (valor >= 7) return 'Alta';
    if (valor >= 5) return 'Média';
    return 'Baixa';
  };

  const getIntensityColor = (valor: number) => {
    if (valor >= 9) return 'text-green-600';
    if (valor >= 7) return 'text-blue-600';
    if (valor >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="aurora-glass border-aurora-electric-purple/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-aurora-electric-purple" />
          Elementos Universais Aplicados
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple">
            Mentor: {mentor}
          </Badge>
          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {especialidades.slice(0, 3).map((especialidade, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {especialidade}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ELEMENTOS_CONFIG.map((config, index) => {
            const valor = elementos[config.key as keyof ElementosUniversais];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <span className="text-sm font-medium text-white">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${getIntensityColor(valor)}`}>
                      {getIntensityLabel(valor)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {valor}/10
                    </span>
                  </div>
                </div>
                <Progress 
                  value={valor * 10} 
                  className="h-2"
                />
                <p className="text-xs text-slate-400">
                  {config.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-aurora-electric-purple/10 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">
            💡 Análise do Perfil
          </h4>
          <p className="text-xs text-slate-300">
            Este roteiro foi criado com base no perfil do mentor <strong>{mentor}</strong>, 
            aplicando os 10 elementos universais com intensidades específicas para otimizar 
            o resultado final. Os elementos com maior intensidade são as especialidades 
            do mentor escolhido.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementosUniversaisDisplay;
