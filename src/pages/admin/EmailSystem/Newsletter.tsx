import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Mail } from 'lucide-react';

const Newsletter: React.FC = () => {


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Newsletter
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Criar e enviar campanhas de newsletter para usuários
          </p>
        </div>
      </div>

      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-aurora-electric-purple" />
            Sistema de Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-400">
            Interface para criar e enviar newsletters será implementada aqui.
          </p>
          <Button className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Em Desenvolvimento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Newsletter;