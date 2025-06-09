
import { Target, Users, Megaphone, TrendingUp } from "lucide-react";

export interface ActionItem {
  action: string;
  type: string;
  priority: "Alta" | "Média" | "Baixa";
  time: string;
}

export interface GrowthWeek {
  week: number;
  title: string;
  color: string;
  iconColor: string;
  icon: typeof Target;
  actions: ActionItem[];
}

export const growthWeeks: GrowthWeek[] = [
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
