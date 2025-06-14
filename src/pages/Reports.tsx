
import React from 'react';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BarChart3 className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Relatórios</h1>
            <p className="text-slate-400">Análises e métricas de desempenho</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={TrendingUp}
        title="Nenhum relatório disponível"
        description="Os relatórios serão gerados conforme você usar a plataforma"
        actionLabel="Ver Métricas"
        actionIcon={BarChart3}
        onAction={() => console.log('View metrics')}
      />
    </div>
  );
};

export default Reports;
