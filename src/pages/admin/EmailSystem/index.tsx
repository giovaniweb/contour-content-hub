import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Server, 
  FileText, 
  Send, 
  Activity, 
  Users,
  Settings,
  TestTube,
  AlertCircle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface EmailStats {
  totalSent: number;
  successRate: number;
  failureCount: number;
  templateCount: number;
  activeConnections: number;
}

const EmailSystemDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<EmailStats>({
    totalSent: 0,
    successRate: 0,
    failureCount: 0,
    templateCount: 0,
    activeConnections: 0
  });
  const [smtpStatus, setSMTPStatus] = useState<'connected' | 'error' | 'testing'>('testing');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // TODO: Implementar carregamento de dados do dashboard
    setStats({
      totalSent: 1547,
      successRate: 98.2,
      failureCount: 28,
      templateCount: 12,
      activeConnections: 3
    });
    setSMTPStatus('connected');
  };

  const quickActions = [
    {
      title: 'Configurar SMTP',
      description: 'Configure conexões SMTP (GoDaddy, Resend)',
      icon: Settings,
      action: () => navigate('/admin/email-system/smtp-settings'),
      color: 'text-aurora-electric-purple'
    },
    {
      title: 'Gerenciar Templates',
      description: 'Criar e editar templates de email',
      icon: FileText,
      action: () => navigate('/admin/email-system/templates'),
      color: 'text-aurora-neon-blue'
    },
    {
      title: 'Enviar Newsletter',
      description: 'Criar e enviar campanhas de newsletter',
      icon: Send,
      action: () => navigate('/admin/email-system/newsletter'),
      color: 'text-aurora-emerald'
    },
    {
      title: 'Teste de Email',
      description: 'Testar configurações e templates',
      icon: TestTube,
      action: () => navigate('/admin/email-system/testing'),
      color: 'text-aurora-neon-pink'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Sistema de Email Nativo
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Gerencie SMTP, templates, newsletters e monitoramento
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={smtpStatus === 'connected' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            {smtpStatus === 'connected' ? (
              <>
                <CheckCircle className="h-3 w-3" />
                SMTP Conectado
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                SMTP Desconectado
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-aurora-electric-purple" />
              Emails Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-aurora-emerald" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-slate-400">Entrega bem-sucedida</p>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-aurora-neon-pink" />
              Falhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failureCount}</div>
            <p className="text-xs text-slate-400">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-aurora-neon-blue" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templateCount}</div>
            <p className="text-xs text-slate-400">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4 text-aurora-electric-purple" />
              Conexões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <p className="text-xs text-slate-400">Provedores ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-aurora-electric-purple" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="aurora-card hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <action.icon className={`h-8 w-8 ${action.color} mx-auto mb-4`} />
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-slate-400">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="aurora-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-aurora-neon-blue" />
              Status dos Provedores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>GoDaddy SMTP</span>
              <Badge variant="default" className="bg-aurora-emerald">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Resend (Fallback)</span>
              <Badge variant="default" className="bg-aurora-emerald">
                <CheckCircle className="h-3 w-3 mr-1" />
                Disponível
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rate Limiting</span>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="aurora-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-aurora-electric-purple" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-aurora-emerald rounded-full"></div>
              <span>Newsletter enviada para 245 usuários</span>
              <span className="text-slate-400 ml-auto">2min atrás</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-aurora-neon-blue rounded-full"></div>
              <span>Template "Bem-vindo" atualizado</span>
              <span className="text-slate-400 ml-auto">1h atrás</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-aurora-electric-purple rounded-full"></div>
              <span>Configuração SMTP testada</span>
              <span className="text-slate-400 ml-auto">3h atrás</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={() => navigate('/admin/email-system/monitoring')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Ver Monitoramento
        </Button>
        <Button 
          onClick={() => navigate('/admin/email-system/smtp-settings')}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Configurar Sistema
        </Button>
      </div>
    </div>
  );
};

export default EmailSystemDashboard;