import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const SMTPSettings: React.FC = () => {

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Configurações SMTP
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Configure provedores de email e teste conexões
          </p>
        </div>
      </div>

      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-aurora-electric-purple" />
            Configuração SMTP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-400">
            Interface para configurar provedores SMTP será implementada aqui.
          </p>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Em Desenvolvimento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMTPSettings;