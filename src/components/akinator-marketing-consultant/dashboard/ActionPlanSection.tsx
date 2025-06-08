
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, Target, Plus } from "lucide-react";

interface ActionPlanSectionProps {
  clinicType: string;
}

const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({ clinicType }) => {
  const getWeeklyActions = () => {
    const medicalActions = {
      week1: [
        'Criar 3 posts educativos sobre procedimentos',
        'Desenvolver depoimento em vídeo de paciente',
        'Otimizar perfil com certificações médicas',
        'Agendar lives sobre dúvidas frequentes'
      ],
      week2: [
        'Publicar case de sucesso detalhado',
        'Criar série sobre cuidados pós-procedimento',
        'Desenvolver FAQ interativo no Stories',
        'Iniciar parceria com influenciadores da saúde'
      ],
      week3: [
        'Lançar campanha de conscientização',
        'Criar conteúdo sobre tecnologias utilizadas',
        'Desenvolver programa de indicação médica',
        'Implementar sistema de agendamento online'
      ]
    };

    const aestheticActions = {
      week1: [
        'Criar 5 posts de antes/depois',
        'Desenvolver tutorial de skincare',
        'Otimizar Stories com dicas diárias',
        'Agendar sessão de fotos profissionais'
      ],
      week2: [
        'Publicar transformações em Reels',
        'Criar série sobre autoestima e bem-estar',
        'Desenvolver promoção especial',
        'Iniciar parcerias com micro-influencers'
      ],
      week3: [
        'Lançar campanha sazonal',
        'Criar conteúdo sobre tendências estéticas',
        'Desenvolver programa de fidelidade',
        'Implementar chatbot para agendamentos'
      ]
    };

    return clinicType === 'clinica_medica' ? medicalActions : aestheticActions;
  };

  const weeklyActions = getWeeklyActions();
  const weeks = [
    { id: 'week1', title: 'Semana 1', subtitle: 'Estabelecer Presença', color: 'from-green-500/20 to-emerald-500/20', borderColor: 'border-green-500/30' },
    { id: 'week2', title: 'Semana 2', subtitle: 'Construir Autoridade', color: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/30' },
    { id: 'week3', title: 'Semana 3', subtitle: 'Acelerar Conversão', color: 'from-purple-500/20 to-pink-500/20', borderColor: 'border-purple-500/30' }
  ];

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            📅 Plano de Ação
          </h2>
          <p className="text-foreground/60 text-lg">
            Estratégia dividida em semanas para execução prática
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {weeks.map((week, weekIndex) => (
          <Card 
            key={week.id} 
            className={`aurora-glass ${week.borderColor} bg-gradient-to-br ${week.color} backdrop-blur-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg font-bold text-foreground">
                  {week.title}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {weekIndex + 1}/3
                </Badge>
              </div>
              <p className="text-sm text-foreground/70 font-medium">
                {week.subtitle}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {weeklyActions[week.id as keyof typeof weeklyActions].map((action, actionIndex) => (
                <div 
                  key={actionIndex} 
                  className="flex items-start gap-3 p-3 bg-background/10 rounded-lg border border-white/10 hover:bg-background/20 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-aurora-electric-purple/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-aurora-electric-purple rounded-full"></div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar ao Planejador
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ActionPlanSection;
