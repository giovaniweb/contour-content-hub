
import React from 'react';
import { TestTube, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminSystemDiagnostics: React.FC = () => {
  const diagnostics = [
    { name: 'Banco de Dados', status: 'healthy', message: 'Conexão estável' },
    { name: 'API Externa', status: 'warning', message: 'Latência alta' },
    { name: 'Storage', status: 'healthy', message: 'Funcionando normalmente' },
    { name: 'IA Service', status: 'error', message: 'Serviço indisponível' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-500">Saudável</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Atenção</Badge>;
      case 'error': return <Badge className="bg-red-500">Erro</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TestTube className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Diagnóstico do Sistema</h1>
            <p className="text-slate-400">Monitore a saúde dos serviços</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar Diagnóstico
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {diagnostics.map((diagnostic, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  {getStatusIcon(diagnostic.status)}
                  {diagnostic.name}
                </span>
                {getStatusBadge(diagnostic.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">{diagnostic.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle>Logs do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
            <div>[2024-01-15 10:30:15] Sistema iniciado com sucesso</div>
            <div>[2024-01-15 10:30:16] Conectado ao banco de dados</div>
            <div>[2024-01-15 10:30:17] Serviços de IA carregados</div>
            <div className="text-yellow-400">[2024-01-15 10:31:20] AVISO: Latência alta detectada</div>
            <div className="text-red-400">[2024-01-15 10:32:45] ERRO: Falha na conexão com serviço externo</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemDiagnostics;
