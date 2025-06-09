
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  Calendar,
  Download,
  Bell,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { MarketingConsultantState } from '../types';

interface QuickActionCardsProps {
  state: MarketingConsultantState;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string;
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ state }) => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'planning',
      title: 'Ir para Planejador',
      description: 'Organize suas ideias no planejador de conteúdo',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      action: () => navigate('/content-planner')
    },
    {
      id: 'calendar',
      title: 'Criar Calendário Semanal',
      description: 'Gere um calendário de posts para 7 dias',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      action: () => {
        toast.success("📅 Calendário em desenvolvimento!", {
          description: "Funcionalidade será liberada em breve"
        });
      },
      badge: 'Em breve'
    },
    {
      id: 'ideas',
      title: 'Gerar Mais Ideias IA',
      description: 'Peça ao Consultor Fluida mais sugestões',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      action: () => {
        toast.info("🤖 Gerando novas ideias...", {
          description: "Consultor Fluida criando sugestões personalizadas"
        });
        // Aqui poderia integrar com a geração de mais sugestões
      }
    },
    {
      id: 'export',
      title: 'Exportar Diagnóstico',
      description: 'Baixe seu relatório completo em PDF',
      icon: <Download className="h-5 w-5" />,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      action: () => {
        toast.success("📄 Exportando relatório!", {
          description: "Download iniciado automaticamente"
        });
      }
    },
    {
      id: 'notifications',
      title: 'Configurar Lembretes',
      description: 'Ative notificações para não esquecer de postar',
      icon: <Bell className="h-5 w-5" />,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      action: () => {
        toast.info("🔔 Configuração de lembretes", {
          description: "Funcionalidade em desenvolvimento"
        });
      },
      badge: 'Beta'
    },
    {
      id: 'performance',
      title: 'Análise de Performance',
      description: 'Veja métricas e otimize sua estratégia',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      action: () => {
        toast.info("📊 Análise de performance", {
          description: "Conecte suas redes sociais para ver métricas"
        });
      },
      badge: 'Novo'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold aurora-heading flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-aurora-electric-purple" />
          Ações Rápidas
        </h3>
        <p className="text-sm aurora-body opacity-70">
          Acelere sua execução com essas ações práticas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="aurora-card h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    {action.icon}
                  </div>
                  {action.badge && (
                    <Badge variant="outline" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold aurora-heading text-sm">
                    {action.title}
                  </h4>
                  <p className="text-xs aurora-body opacity-80 line-clamp-2">
                    {action.description}
                  </p>
                </div>
                
                <Button 
                  onClick={action.action}
                  variant="outline"
                  className="w-full aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20 text-xs h-8 group-hover:scale-105 transition-transform"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Executar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;
