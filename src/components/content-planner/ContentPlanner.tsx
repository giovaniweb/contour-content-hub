
import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import ContentPlannerDetailModal from './ContentPlannerDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, Sparkles } from 'lucide-react';
import { useContentPlanner } from '@/hooks/useContentPlanner';
import { ContentPlannerItem } from '@/types/content-planner';

const ContentPlanner: React.FC = () => {
  const [view, setView] = useState<'board' | 'list' | 'calendar'>('board');
  const [smartSuggestionsEnabled, setSmartSuggestionsEnabled] = useState(true);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentPlannerItem | null>(null);
  
  const { loading, addItem, updateItem, removeItem } = useContentPlanner();

  const handleGenerateSuggestions = () => {
    setIsGeneratingSuggestions(true);
    // Mock API call timing
    setTimeout(() => {
      setIsGeneratingSuggestions(false);
    }, 2000);
  };
  
  const handleViewDetails = (item: ContentPlannerItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-contourline-darkBlue">Planner de Conteúdo</h1>
          <p className="text-muted-foreground">Planeje, acompanhe e distribua seu conteúdo de forma inteligente</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
          
          <Button 
            variant="default" 
            onClick={handleGenerateSuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingSuggestions ? "Gerando..." : "Gerar Ideias"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="board" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="board" onClick={() => setView('board')}>
              Quadro Kanban
            </TabsTrigger>
            <TabsTrigger value="list" onClick={() => setView('list')}>
              Lista
            </TabsTrigger>
            <TabsTrigger value="calendar" onClick={() => setView('calendar')}>
              Calendário
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="smart-suggestions" 
                checked={smartSuggestionsEnabled}
                onCheckedChange={(checked) => setSmartSuggestionsEnabled(checked === true)}
              />
              <Label htmlFor="smart-suggestions">Sugestões inteligentes</Label>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-schedule" 
                checked={autoScheduleEnabled}
                onCheckedChange={(checked) => setAutoScheduleEnabled(checked === true)}
              />
              <Label htmlFor="auto-schedule">Agendamento automático</Label>
            </div>
          </div>
        </div>
        
        <TabsContent value="board" className="pt-6">
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-contourline-mediumBlue" />
            </div>
          ) : (
            <KanbanBoard />
          )}
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
      
      <ContentPlannerDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        item={selectedItem}
        onUpdate={updateItem}
        onDelete={removeItem}
      />
    </div>
  );
};

export default ContentPlanner;
