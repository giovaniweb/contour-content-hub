
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";
import { Mentor } from '@/services/mentoresService';

interface RealMentorSectionProps {
  mentor: Mentor;
  marketingProfile: string;
  confidence: number;
  enigma: string;
}

const RealMentorSection: React.FC<RealMentorSectionProps> = ({ 
  mentor, 
  marketingProfile, 
  confidence,
  enigma 
}) => {
  const getProfileDisplayName = (profile: string): string => {
    const profiles: Record<string, string> = {
      'especialista_conversao': 'Especialista em Conversão',
      'expert_storytelling': 'Expert em Storytelling',
      'consultor_criativo': 'Consultor Criativo',
      'analista_performance': 'Analista de Performance',
      'estrategista_digital': 'Estrategista Digital',
      'expert_engajamento': 'Expert em Engajamento',
      'consultor_grandes_ideias': 'Consultor de Grandes Ideias'
    };
    return profiles[profile] || 'Consultor Estratégico';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="aurora-gradient-bg border-2 border-aurora-electric-purple/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5" />
          🧩 Mentor Estratégico Identificado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-aurora-electric-purple/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {mentor.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{mentor.nome}</h3>
              <p className="text-sm text-foreground/70">{getProfileDisplayName(marketingProfile)}</p>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="h-3 w-3 text-aurora-electric-purple" />
                <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
                  {Math.round(confidence * 100)}% de compatibilidade
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-1">Especialidade:</p>
              <p className="text-sm text-foreground/70">{mentor.descricao}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-1">Estilo:</p>
              <p className="text-sm text-foreground/70">{mentor.estilo}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-1">Tom de Voz:</p>
              <p className="text-sm text-foreground/70">{mentor.tom}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground/80 mb-2">Uso Ideal:</p>
              <Badge variant="secondary" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                {mentor.uso_ideal}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="aurora-gradient-bg rounded-lg p-4">
          <p className="text-sm italic text-white leading-relaxed">
            "💭 {enigma}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealMentorSection;
