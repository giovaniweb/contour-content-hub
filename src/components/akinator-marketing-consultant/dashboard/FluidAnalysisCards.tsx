
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  Crown,
  Sparkles,
  MessageSquare,
  Calendar
} from "lucide-react";
import { MarketingConsultantState } from '../types';
import { useEquipmentData } from '../hooks/useEquipmentData';

interface FluidAnalysisCardsProps {
  state: MarketingConsultantState;
  aiSections: any;
}

const FluidAnalysisCards: React.FC<FluidAnalysisCardsProps> = ({ state, aiSections }) => {
  const isClinicaMedica = state.clinicType === 'clinica_medica';
  
  const equipmentId = isClinicaMedica ? state.medicalEquipments : state.aestheticEquipments;
  const { equipment, loading } = useEquipmentData(equipmentId);

  const getMainEquipment = () => {
    if (equipment) {
      return equipment.nome;
    }
    return 'Não informado';
  };

  const getEquipmentBenefits = () => {
    if (equipment?.beneficios) {
      const benefits = equipment.beneficios.split(';').slice(0, 2);
      return benefits.map(b => b.trim()).join(' • ');
    }
    return 'Diferencial competitivo';
  };

  const getMainObjective = () => {
    if (isClinicaMedica) {
      const objectiveMap: { [key: string]: string } = {
        'autoridade_medica': 'Aumentar autoridade médica',
        'escalar_consultorio': 'Escalar consultório',
        'fidelizar_pacientes': 'Melhorar retenção',
        'diferenciar_mercado': 'Diferenciar no mercado'
      };
      return objectiveMap[state.medicalObjective] || 'Não informado';
    } else {
      const objectiveMap: { [key: string]: string } = {
        'atrair_leads': 'Atrair leads qualificados',
        'aumentar_recorrencia': 'Aumentar recorrência',
        'elevar_ticket': 'Aumentar ticket médio',
        'autoridade_regiao': 'Ser referência na região'
      };
      return objectiveMap[state.aestheticObjective] || 'Não informado';
    }
  };

  const getContentFrequency = () => {
    if (isClinicaMedica) {
      return state.medicalContentFrequency || state.contentFrequency || 'Não informado';
    }
    return state.aestheticContentFrequency || state.contentFrequency || 'Não informado';
  };

  const getRecommendedActions = () => {
    const actions = [];
    
    if (!state.contentFrequency || state.contentFrequency === 'raramente') {
      actions.push('Aumentar frequência de conteúdo');
    }
    
    if (getMainEquipment() === 'Não informado') {
      actions.push('Definir equipamentos principais');
    }
    
    if (!state.targetAudience) {
      actions.push('Especificar público-alvo');
    }
    
    return actions.length ? actions : ['Otimizar estratégia atual'];
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-aurora-sage to-aurora-electric-purple rounded-2xl flex items-center justify-center shadow-lg">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            ⚡ Análise Inteligente Fluida
          </h2>
          <p className="text-foreground/60 text-lg">
            Insights personalizados baseados no seu perfil
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="aurora-glass border-aurora-sage/30 bg-gradient-to-br from-aurora-sage/20 to-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Foco Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-bold text-foreground">
                {getMainObjective()}
              </p>
              <Badge variant="secondary" className="text-xs">
                {isClinicaMedica ? '🧪 Médica' : '💆‍♀️ Estética'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Equipamento Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground leading-tight">
                {getMainEquipment()}
              </p>
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400">
                  {getEquipmentBenefits()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-glass border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Estratégia de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground leading-tight">
                {getContentFrequency()}
              </p>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400">
                  Frequência atual
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="aurora-glass border-aurora-electric-purple/50 bg-gradient-to-br from-gray-900/60 to-gray-800/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-aurora-sage" />
            🎯 Próximas Ações Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRecommendedActions().map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 aurora-glass rounded-lg">
                <div className="w-8 h-8 bg-aurora-sage/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-aurora-sage">{index + 1}</span>
                </div>
                <span className="text-sm aurora-body">{action}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-aurora-electric-purple/10 rounded-lg border border-aurora-electric-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-aurora-electric-purple" />
              <span className="text-sm font-medium text-aurora-electric-purple">Insight Fluida</span>
            </div>
            <p className="text-sm aurora-body opacity-90">
              {isClinicaMedica 
                ? "Clínicas médicas que mostram autoridade técnica e resultados científicos convertem 40% mais leads."
                : "Clínicas estéticas que humanizam o atendimento e mostram transformações reais aumentam em 60% a taxa de conversão."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default FluidAnalysisCards;
