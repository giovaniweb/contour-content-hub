
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  BarChart3,
  Calendar,
  Users,
  DollarSign
} from "lucide-react";

const PerformanceMetrics: React.FC = () => {
  const [metrics] = useState({
    planejadoVsExecutado: {
      conteudosPlanejados: 20,
      conteudosExecutados: 14,
      porcentagem: 70
    },
    metasMensais: {
      leads: { meta: 50, atual: 35, porcentagem: 70 },
      vendas: { meta: 100000, atual: 75000, porcentagem: 75 },
      engajamento: { meta: 1000, atual: 850, porcentagem: 85 }
    },
    estrategiasAtivas: [
      { nome: "Instagram Stories", status: "ativo", progresso: 80 },
      { nome: "Email Marketing", status: "pendente", progresso: 30 },
      { nome: "Anúncios Facebook", status: "ativo", progresso: 90 },
      { nome: "Blog Posts", status: "pausado", progresso: 45 }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pausado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Performance do Marketing</h2>
        <p className="text-white/70">
          Acompanhe o progresso das suas estratégias e compare o planejado vs executado
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="aurora-card border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Conteúdos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Executados</span>
                <span className="text-white font-medium">
                  {metrics.planejadoVsExecutado.conteudosExecutados} / {metrics.planejadoVsExecutado.conteudosPlanejados}
                </span>
              </div>
              <Progress 
                value={metrics.planejadoVsExecutado.porcentagem} 
                className="h-2"
              />
              <div className="text-center">
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  {metrics.planejadoVsExecutado.porcentagem}% completo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Meta Mensal</span>
                <span className="text-white font-medium">
                  {metrics.metasMensais.leads.atual} / {metrics.metasMensais.leads.meta}
                </span>
              </div>
              <Progress 
                value={metrics.metasMensais.leads.porcentagem} 
                className="h-2"
              />
              <div className="text-center">
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {metrics.metasMensais.leads.porcentagem}% da meta
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-400" />
              Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Meta Mensal</span>
                <span className="text-white font-medium">
                  R$ {(metrics.metasMensais.vendas.atual / 1000).toFixed(0)}k / R$ {(metrics.metasMensais.vendas.meta / 1000).toFixed(0)}k
                </span>
              </div>
              <Progress 
                value={metrics.metasMensais.vendas.porcentagem} 
                className="h-2"
              />
              <div className="text-center">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  {metrics.metasMensais.vendas.porcentagem}% da meta
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estratégias Ativas */}
      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-aurora-electric-purple" />
            Estratégias em Andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.estrategiasAtivas.map((estrategia, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{estrategia.nome}</h4>
                  <Badge variant="outline" className={getStatusColor(estrategia.status)}>
                    {estrategia.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Progresso</span>
                    <span className="text-white">{estrategia.progresso}%</span>
                  </div>
                  <Progress value={estrategia.progresso} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Sugeridas */}
      <Card className="aurora-card border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            Ações Prioritárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Finalizar Email Marketing</p>
                <p className="text-white/70 text-sm">Estratégia com apenas 30% de progresso</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Planejar conteúdos da próxima semana</p>
                <p className="text-white/70 text-sm">6 conteúdos ainda precisam ser executados</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
