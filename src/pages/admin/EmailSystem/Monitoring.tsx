import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailMetric {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
  rate_limited: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'error' | 'warning';
  message: string;
  function_name: string;
  details?: any;
}

const EmailMonitoring: React.FC = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<EmailMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simular dados de métricas
      setMetrics([
        { date: '2024-01-15', sent: 245, delivered: 241, failed: 4, rate_limited: 0 },
        { date: '2024-01-14', sent: 189, delivered: 186, failed: 3, rate_limited: 0 },
        { date: '2024-01-13', sent: 156, delivered: 154, failed: 2, rate_limited: 0 },
        { date: '2024-01-12', sent: 198, delivered: 195, failed: 3, rate_limited: 0 },
        { date: '2024-01-11', sent: 167, delivered: 165, failed: 2, rate_limited: 0 }
      ]);

      // Simular logs
      setLogs([
        {
          id: '1',
          timestamp: '2024-01-15 14:30:25',
          level: 'info',
          message: 'Newsletter enviada com sucesso para 245 usuários',
          function_name: 'send-newsletter'
        },
        {
          id: '2',
          timestamp: '2024-01-15 14:25:12',
          level: 'info',
          message: 'Conexão SMTP estabelecida com GoDaddy',
          function_name: 'send-native-email'
        },
        {
          id: '3',
          timestamp: '2024-01-15 14:20:45',
          level: 'warning',
          message: 'Rate limit atingido, usando fallback Resend',
          function_name: 'send-native-email'
        },
        {
          id: '4',
          timestamp: '2024-01-15 14:15:33',
          level: 'error',
          message: 'Falha na conexão SMTP: Connection timeout',
          function_name: 'send-native-email'
        },
        {
          id: '5',
          timestamp: '2024-01-15 14:10:18',
          level: 'info',
          message: 'Template de boas-vindas atualizado',
          function_name: 'academy-email-templates'
        }
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de monitoramento."
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
    toast({
      title: "Dados atualizados",
      description: "Dashboard atualizado com os dados mais recentes."
    });
  };

  const totalSent = metrics.reduce((acc, m) => acc + m.sent, 0);
  const totalDelivered = metrics.reduce((acc, m) => acc + m.delivered, 0);
  const totalFailed = metrics.reduce((acc, m) => acc + m.failed, 0);
  const successRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0;

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Aviso</Badge>;
      case 'info':
        return <Badge className="bg-green-600">Info</Badge>;
      default:
        return <Badge variant="outline">Log</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Monitoramento de Email
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Acompanhe métricas de entrega e logs do sistema
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-aurora-electric-purple" />
              Emails Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Últimos 5 dias
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-aurora-emerald" />
              Entregues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDelivered}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp className="h-3 w-3 text-green-500" />
              Taxa: {successRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-aurora-neon-pink" />
              Falhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFailed}</div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingDown className="h-3 w-3 text-red-500" />
              {((totalFailed / totalSent) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4 text-aurora-neon-blue" />
              Status Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aurora-emerald">Ativo</div>
            <div className="text-xs text-slate-400">
              SMTP + Resend
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
          <TabsTrigger value="health">Saúde do Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-aurora-electric-purple" />
                Métricas Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="aurora-loading-enhanced rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple animate-spin mx-auto"></div>
                  <p className="text-slate-400 mt-2">Carregando métricas...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tabela de métricas por dia */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2">Data</th>
                          <th className="text-center p-2">Enviados</th>
                          <th className="text-center p-2">Entregues</th>
                          <th className="text-center p-2">Falhas</th>
                          <th className="text-center p-2">Taxa Sucesso</th>
                          <th className="text-center p-2">Rate Limited</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map((metric, index) => (
                          <tr key={index} className="border-b border-slate-800">
                            <td className="p-2">{new Date(metric.date).toLocaleDateString()}</td>
                            <td className="text-center p-2">{metric.sent}</td>
                            <td className="text-center p-2 text-aurora-emerald">{metric.delivered}</td>
                            <td className="text-center p-2 text-aurora-neon-pink">{metric.failed}</td>
                            <td className="text-center p-2">
                              {((metric.delivered / metric.sent) * 100).toFixed(1)}%
                            </td>
                            <td className="text-center p-2">{metric.rate_limited}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="aurora-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-aurora-neon-blue" />
                Logs Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded bg-slate-800/50">
                    <div className="flex-shrink-0 mt-0.5">
                      {getLevelIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {log.function_name}
                        </Badge>
                        <span className="text-xs text-slate-400 ml-auto">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="aurora-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-aurora-electric-purple" />
                  Status dos Provedores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-aurora-emerald rounded-full"></div>
                    <span>GoDaddy SMTP</span>
                  </div>
                  <Badge className="bg-aurora-emerald">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-aurora-emerald rounded-full"></div>
                    <span>Resend Fallback</span>
                  </div>
                  <Badge className="bg-aurora-emerald">Disponível</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-aurora-neon-blue rounded-full"></div>
                    <span>Rate Limiting</span>
                  </div>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-aurora-emerald rounded-full"></div>
                    <span>Templates</span>
                  </div>
                  <Badge className="bg-aurora-emerald">12 Ativos</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="aurora-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-aurora-neon-blue" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tempo médio de envio:</span>
                  <span className="font-semibold">2.3s</span>
                </div>
                <div className="flex justify-between">
                  <span>Conexões simultâneas:</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Queue length:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime (24h):</span>
                  <span className="font-semibold text-aurora-emerald">99.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Último restart:</span>
                  <span className="text-slate-400">3 dias atrás</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailMonitoring;