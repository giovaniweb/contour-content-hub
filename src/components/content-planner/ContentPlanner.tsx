
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';
import ContentPlannerDetailModal from './ContentPlannerDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Sparkles, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { useContentPlanner } from '@/hooks/useContentPlanner';
import { ContentPlannerItem } from '@/types/content-planner';
import { useToast } from '@/hooks/use-toast';

const ContentPlanner: React.FC = () => {
  const [view, setView] = useState<'board' | 'list' | 'calendar'>('board');
  const [smartSuggestionsEnabled, setSmartSuggestionsEnabled] = useState(true);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentPlannerItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    loading, 
    items,
    autoRefresh,
    setAutoRefresh,
    addItem, 
    updateItem, 
    removeItem,
    generateSuggestions,
    syncData
  } = useContentPlanner();

  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      await generateSuggestions(4);
      toast({
        title: "🎯 Sugestões inteligentes geradas!",
        description: "4 novas ideias foram adicionadas ao seu planejador com base em tendências.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro na geração",
        description: "Não foi possível gerar sugestões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleQuickSync = async () => {
    await syncData();
  };
  
  const handleViewDetails = (item: ContentPlannerItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleGenerateScript = (item: ContentPlannerItem) => {
    navigate('/script-generator', { 
      state: { 
        contentItem: item
      }
    });
  };

  const handleValidateItem = (item: ContentPlannerItem) => {
    navigate('/content-ideas', { 
      state: { 
        ideaToValidate: {
          content: item.title,
          objective: item.objective,
          format: item.format
        }
      }
    });
  };

  const handleUpdateItem = (item: ContentPlannerItem) => {
    updateItem(item.id, item);
  };

  const handleDeleteItem = (id: string) => {
    removeItem(id);
  };

  const filteredItemsCount = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-contourline-darkBlue">
              Planner de Conteúdo
            </h1>
            {autoRefresh && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Planeje, acompanhe e distribua seu conteúdo de forma inteligente
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>📊 {items.length} itens totais</span>
            <span>🔍 {filteredItemsCount} visíveis</span>
            <span>🤖 {items.filter(item => item.aiGenerated).length} gerados por IA</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar conteúdo..." 
              className="pl-9 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" onClick={handleQuickSync} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
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
            className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGeneratingSuggestions ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Ideias IA
              </>
            )}
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
                id="auto-refresh" 
                checked={autoRefresh}
                onCheckedChange={(checked) => setAutoRefresh(checked === true)}
              />
              <Label htmlFor="auto-refresh" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Auto-atualização
              </Label>
            </div>
            
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            
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
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-contourline-mediumBlue" />
              <p className="text-sm text-muted-foreground">Carregando planejador ativo...</p>
            </div>
          ) : (
            <KanbanBoard 
              onViewDetails={handleViewDetails}
              onGenerateScript={handleGenerateScript}
              onValidate={handleValidateItem}
              searchQuery={searchQuery}
            />
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
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onGenerateScript={handleGenerateScript}
        onValidate={handleValidateItem}
      />
    </div>
  );
};

export default ContentPlanner;
