
import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

const ContentPlanner: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calendar className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Planejador de Conteúdo</h1>
            <p className="text-slate-400">Organize e planeje seu conteúdo</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Calendar}
        title="Nenhum conteúdo planejado"
        description="Comece criando seu primeiro plano de conteúdo"
        actionLabel="Criar Primeiro Plano"
        actionIcon={Plus}
        onAction={() => console.log('Create content plan')}
      />
    </div>
  );
};

export default ContentPlanner;
