
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Target, TrendingUp, Users, Heart, Lightbulb, Megaphone } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface GrowthStrategySectionProps {
  session: DiagnosticSession;
}

const GrowthStrategySection: React.FC<GrowthStrategySectionProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const growthWeeks = [
    {
      week: 1,
      title: "Autoridade e Visibilidade",
      color: "border-aurora-electric-purple/30",
      iconColor: "text-aurora-electric-purple",
      icon: Target,
      actions: [
        {
          action: "Criar perfil profissional completo",
          type: "Setup",
          priority: "Alta",
          time: "2h"
        },
        {
          action: "Publicar 3 posts educativos sobre procedimentos",
          type: "Conteúdo",
          priority: "Alta", 
          time: "4h"
        },
        {
          action: "Compartilhar certificações e formações",
          type: "Credibilidade",
          priority: "Média",
          time: "1h"
        },
        {
          action: "Engajar com outros profissionais da área",
          type: "Networking",
          priority: "Média",
          time: "3h"
        }
      ]
    },
    {
      week: 2,
      title: "Prova Social e Diferencial", 
      color: "border-aurora-sage/30",
      iconColor: "text-aurora-sage",
      icon: Users,
      actions: [
        {
          action: "Publicar antes/depois (com autorização)",
          type: "Resultados",
          priority: "Alta",
          time: "3h"
        },
        {
          action: "Coletar e compartilhar depoimentos",
          type: "Testimonials",
          priority: "Alta",
          time: "2h"
        },
        {
          action: "Destacar diferenciais únicos da clínica",
          type: "Posicionamento",
          priority: "Média",
          time: "2h"
        },
        {
          action: "Criar conteúdo sobre tecnologias utilizadas",
          type: "Inovação",
          priority: "Média",
          time: "3h"
        }
      ]
    },
    {
      week: 3,
      title: "Conversão e Campanha",
      color: "border-aurora-deep-purple/30", 
      iconColor: "text-aurora-deep-purple",
      icon: Megaphone,
      actions: [
        {
          action: "Lançar campanha promocional focada",
          type: "Promoção",
          priority: "Alta",
          time: "4h"
        },
        {
          action: "Criar call-to-actions estratégicos",
          type: "CTA",
          priority: "Alta",
          time: "2h"
        },
        {
          action: "Implementar sistema de agendamento online",
          type: "Automação",
          priority: "Média",
          time: "6h"
        },
        {
          action: "Desenvolver landing page específica",
          type: "Website",
          priority: "Média",
          time: "8h"
        }
      ]
    },
    {
      week: 4,
      title: "Aceleração e Fidelização",
      color: "border-aurora-turquoise/30",
      iconColor: "text-aurora-turquoise", 
      icon: TrendingUp,
      actions: [
        {
          action: "Implementar programa de fidelidade",
          type: "Retenção",
          priority: "Alta",
          time: "5h"
        },
        {
          action: "Criar parcerias estratégicas",
          type: "Partnerships",
          priority: "Média",
          time: "4h"
        },
        {
          action: "Otimizar funil de vendas baseado em dados",
          type: "Otimização",
          priority: "Alta",
          time: "3h"
        },
        {
          action: "Desenvolver estratégia de cross-selling",
          type: "Vendas",
          priority: "Média",
          time: "2h"
        }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'border-red-500/30 text-red-400';
      case 'Média': return 'border-yellow-500/30 text-yellow-400';
      case 'Baixa': return 'border-green-500/30 text-green-400';
      default: return 'border-aurora-electric-purple/30 text-aurora-electric-purple';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Setup': 'bg-blue-500/20 text-blue-400',
      'Conteúdo': 'bg-purple-500/20 text-purple-400',
      'Credibilidade': 'bg-green-500/20 text-green-400',
      'Networking': 'bg-orange-500/20 text-orange-400',
      'Resultados': 'bg-emerald-500/20 text-emerald-400',
      'Testimonials': 'bg-cyan-500/20 text-cyan-400',
      'Posicionamento': 'bg-indigo-500/20 text-indigo-400',
      'Inovação': 'bg-violet-500/20 text-violet-400',
      'Promoção': 'bg-pink-500/20 text-pink-400',
      'CTA': 'bg-rose-500/20 text-rose-400',
      'Automação': 'bg-teal-500/20 text-teal-400',
      'Website': 'bg-amber-500/20 text-amber-400',
      'Retenção': 'bg-lime-500/20 text-lime-400',
      'Partnerships': 'bg-sky-500/20 text-sky-400',
      'Otimização': 'bg-fuchsia-500/20 text-fuchsia-400',
      'Vendas': 'bg-red-500/20 text-red-400'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <Card className="aurora-card border-aurora-lavender/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-aurora-lavender" />
          Estratégia de Crescimento - {getMainSpecialty()}
          <Badge variant="outline" className="border-aurora-lavender/30 text-aurora-lavender">
            4 Semanas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {growthWeeks.map((week, index) => (
            <Card key={week.week} className={`aurora-glass ${week.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="flex items-center gap-2">
                    <week.icon className={`h-5 w-5 ${week.iconColor}`} />
                    <span>Semana {week.week}: {week.title}</span>
                  </div>
                  <Badge variant="outline" className={week.iconColor}>
                    {week.actions.length} ações
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {week.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center justify-between p-3 aurora-glass rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle2 className="h-4 w-4 text-foreground/40 hover:text-green-400 cursor-pointer transition-colors" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{action.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-xs ${getTypeColor(action.type)}`}>
                            {action.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-foreground/60">
                            <Clock className="h-3 w-3" />
                            {action.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        Iniciar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Progress Tracking */}
        <Card className="aurora-glass border-white/10 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Progresso da Estratégia</h4>
              <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
                0% Concluído
              </Badge>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div className="bg-aurora-sage h-2 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              Complete as ações semanais para acelerar o crescimento da sua clínica
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default GrowthStrategySection;
