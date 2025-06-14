
import React from 'react';
import { Brain, Settings, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAI: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-slate-50">IA do Sistema</h1>
            <p className="text-slate-400">Configure e monitore a inteligência artificial</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configurações de IA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Modelos de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">
              Configure e gerencie os modelos de IA ativos
            </p>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">
              Monitore o desempenho da IA
            </p>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">
              Ajustes avançados de IA
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAI;
