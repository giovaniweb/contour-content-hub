
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Calendar, Zap, ArrowRight, Star } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface ActionsTabProps {
  session: DiagnosticSession;
}

const ActionsTab: React.FC<ActionsTabProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const immediateActions = [
    {
      title: "Otimizar perfil nas redes sociais",
      description: "Atualizar bio, foto de perfil e informações de contato",
      priority: "Alta",
      time: "2 horas",
      category: "Marketing Digital"
    },
    {
      title: `Criar conteúdo sobre ${getMainSpecialty()}`,
      description: "Desenvolver 3 posts educativos sobre sua especialidade",
      priority: "Alta", 
      time: "4 horas",
      category: "Conteúdo"
    },
    {
      title: "Definir público-alvo específico",
      description: "Mapear perfil detalhado dos pacientes ideais",
      priority: "Média",
      time: "1 hora",
      category: "Estratégia"
    }
  ];

  const mediumTermActions = [
    {
      title: "Implementar estratégia de conteúdo",
      description: "Criar calendário editorial e planejamento mensal",
      priority: "Alta",
      time: "1 semana",
      category: "Planejamento"
    },
    {
      title: "Criar landing page otimizada",
      description: "Desenvolver página de captura de leads",
      priority: "Média",
      time: "2 semanas", 
      category: "Website"
    },
    {
      title: "Desenvolver funil de vendas",
      description: "Estruturar processo de conversão de leads",
      priority: "Alta",
      time: "3 semanas",
      category: "Vendas"
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

  return (
    <div className="space-y-6">
      {/* Ações Imediatas */}
      <Card className="aurora-card border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-aurora-electric-purple" />
            Ações Imediatas (Esta Semana)
            <Badge variant="outline" className="border-red-500/30 text-red-400">
              Urgente
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {immediateActions.map((action, index) => (
            <Card key={index} className="aurora-glass border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3">{action.description}</p>
                    <div className="flex items-center gap-4 text-xs text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {action.time}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {action.category}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 ml-4">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Ações de Médio Prazo */}
      <Card className="aurora-card border-aurora-sage/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-aurora-sage" />
            Médio Prazo (30 dias)
            <Badge variant="outline" className="border-aurora-sage/30 text-aurora-sage">
              Planejamento
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mediumTermActions.map((action, index) => (
            <Card key={index} className="aurora-glass border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <Badge variant="outline" className={getPriorityColor(action.priority)}>
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3">{action.description}</p>
                    <div className="flex items-center gap-4 text-xs text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {action.time}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {action.category}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 ml-4">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Dicas de Implementação */}
      <Card className="aurora-card border-aurora-deep-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Star className="h-5 w-5 text-aurora-deep-purple" />
            Dicas de Implementação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📋 Organize as Tarefas</h4>
              <p className="text-sm text-foreground/80">
                Use ferramentas como Trello ou Notion para acompanhar o progresso das ações recomendadas.
              </p>
            </div>
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">⏰ Defina Prazos</h4>
              <p className="text-sm text-foreground/80">
                Estabeleça deadlines realistas e crie lembretes para cada ação planejada.
              </p>
            </div>
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📊 Monitore Resultados</h4>
              <p className="text-sm text-foreground/80">
                Acompanhe métricas como engajamento, alcance e conversões para medir o sucesso.
              </p>
            </div>
            <div className="p-4 aurora-glass rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🔄 Ajuste a Estratégia</h4>
              <p className="text-sm text-foreground/80">
                Revise e adapte as ações com base nos resultados obtidos e feedback dos pacientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsTab;
