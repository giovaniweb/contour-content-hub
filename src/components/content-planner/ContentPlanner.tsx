
import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar } from 'lucide-react';

const ContentPlanner: React.FC = () => {
  const [view, setView] = useState<'board' | 'list'>('board');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-contourline-darkBlue">Planner de Conteúdo</h1>
          <p className="text-muted-foreground">Planeje, acompanhe e distribua seu conteúdo de forma inteligente</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar conteúdo..." className="pl-9 w-full md:w-[200px]" />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="board" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="board" onClick={() => setView('board')}>
              Quadro Kanban
            </TabsTrigger>
            <TabsTrigger value="list" onClick={() => setView('list')}>
              Lista
            </TabsTrigger>
            <TabsTrigger value="calendar">
              Calendário
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="smart-suggestions" />
              <Label htmlFor="smart-suggestions">Sugestões inteligentes</Label>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-schedule" />
              <Label htmlFor="auto-schedule">Agendamento automático</Label>
            </div>
          </div>
        </div>
        
        <TabsContent value="board" className="pt-6">
          <KanbanBoard />
        </TabsContent>
        
        <TabsContent value="list" className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-slate-50">
            <p className="text-muted-foreground">Visualização em lista será implementada em breve</p>
            <Button variant="outline" className="mt-4" onClick={() => setView('board')}>
              Voltar para Kanban
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-slate-50">
            <p className="text-muted-foreground">Visualização de calendário será implementada em breve</p>
            <Button variant="outline" className="mt-4" onClick={() => setView('board')}>
              Voltar para Kanban
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPlanner;
