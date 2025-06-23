
import React from 'react';
import { Calendar, Plus, Search, Filter, Kanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ContentPlanner: React.FC = () => {
  return (
    <div className="p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <Calendar className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Planejador de Conteúdo
              </h1>
              <p className="text-slate-400 aurora-body">
                Organize e planeje seu cronograma de conteúdo
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="aurora-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar conteúdos..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>

              <Button className="aurora-button">
                <Plus className="h-4 w-4 mr-2" />
                Novo Conteúdo
              </Button>
            </div>
          </div>
        </div>

        {/* Planner Board */}
        <div className="aurora-card p-8">
          <div className="text-center py-12">
            <Kanban className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              Nenhum conteúdo planejado
            </h3>
            <p className="text-slate-400 mb-6">
              Comece planejando seu primeiro conteúdo
            </p>
            <Button className="aurora-button">
              <Plus className="h-4 w-4 mr-2" />
              Planejar Primeiro Conteúdo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPlanner;
