import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const EmailTemplates: React.FC = () => {


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light aurora-text-gradient">
            Templates de Email
          </h1>
          <p className="text-slate-400 aurora-body mt-2">
            Gerencie templates para emails automáticos
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      <Card className="aurora-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-aurora-electric-purple" />
            Templates de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-400">
            Interface para gerenciar templates de email será implementada aqui.
          </p>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Em Desenvolvimento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplates;