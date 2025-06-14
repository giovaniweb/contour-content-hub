
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Calendar, 
  BarChart3, 
  Search,
  Filter,
  FileText,
  Sparkles,
  Eye,
  ThumbsUp,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { ApprovedScriptWithPerformance } from '@/types/approved-scripts';
import { approvedScriptsService } from '@/services/approvedScriptsService';
import EnhancedFeedbackDialog from './EnhancedFeedbackDialog';
import { useToast } from '@/hooks/use-toast';

const ApprovedScriptsManager: React.FC = () => {
  const [scripts, setScripts] = useState<ApprovedScriptWithPerformance[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<ApprovedScriptWithPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadScripts();
  }, []);

  useEffect(() => {
    filterScripts();
  }, [scripts, searchQuery, performanceFilter, formatFilter]);

  const loadScripts = async () => {
    try {
      console.log('🔄 Carregando roteiros aprovados...');
      setLoading(true);
      const data = await approvedScriptsService.getApprovedScripts();
      console.log('📊 Roteiros carregados:', data.length);
      setScripts(data);
    } catch (error) {
      console.error('❌ Erro ao carregar roteiros:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os roteiros",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterScripts = () => {
    let filtered = [...scripts];

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(script => 
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.script_content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por performance
    if (performanceFilter !== 'all') {
      filtered = filtered.filter(script => script.performance?.performance_rating === performanceFilter);
    }

    // Filtro por formato
    if (formatFilter !== 'all') {
      filtered = filtered.filter(script => script.format === formatFilter);
    }

    setFilteredScripts(filtered);
  };

  const handleFeedbackSubmitted = async (rating: string) => {
    toast({
      title: "Avaliação salva!",
      description: `Performance marcada como "${rating.toUpperCase()}"`,
    });
    await loadScripts();
  };

  const sendToContentPlanner = async (script: ApprovedScriptWithPerformance) => {
    const success = await approvedScriptsService.sendToContentPlanner(script.id, {
      title: `Roteiro: ${script.title}`,
      description: script.script_content.substring(0, 200) + '...',
      format: script.format,
      equipment_name: script.equipment_used.join(', '),
      objective: '🟢 Criar Conexão',
      distribution: 'Instagram'
    });

    if (success) {
      toast({
        title: "Sucesso!",
        description: "Roteiro enviado para o Content Planner",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível enviar para o Content Planner",
        variant: "destructive"
      });
    }
  };

  const getPerformanceBadge = (performance?: any) => {
    if (!performance) {
      return <Badge variant="outline" className="text-xs">Sem avaliação</Badge>;
    }

    switch (performance.performance_rating) {
      case 'bombou':
        return <Badge className="bg-green-500 text-white text-xs">🚀 BOMBOU</Badge>;
      case 'flopou':
        return <Badge className="bg-red-500 text-white text-xs">📉 FLOPOU</Badge>;
      case 'neutro':
        return <Badge className="bg-yellow-500 text-white text-xs">😐 NEUTRO</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pendente</Badge>;
    }
  };

  const getStats = () => {
    const total = scripts.length;
    const bombaram = scripts.filter(s => s.performance?.performance_rating === 'bombou').length;
    const floparam = scripts.filter(s => s.performance?.performance_rating === 'flopou').length;
    const neutros = scripts.filter(s => s.performance?.performance_rating === 'neutro').length;
    const semAvaliacao = scripts.filter(s => !s.performance).length;

    return { total, bombaram, floparam, neutros, semAvaliacao };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando roteiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-4 md:space-y-6">
      {/* Header com estatísticas - Layout responsivo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        <Card className="p-2 md:p-4">
          <CardContent className="p-2 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold">{stats.total}</div>
            <div className="text-xs md:text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardContent className="p-2 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-green-500">{stats.bombaram}</div>
            <div className="text-xs md:text-sm text-gray-600">Bombaram</div>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardContent className="p-2 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-red-500">{stats.floparam}</div>
            <div className="text-xs md:text-sm text-gray-600">Floparam</div>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardContent className="p-2 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-yellow-500">{stats.neutros}</div>
            <div className="text-xs md:text-sm text-gray-600">Neutros</div>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4 col-span-2 md:col-span-1">
          <CardContent className="p-2 md:p-4 text-center">
            <div className="text-lg md:text-2xl font-bold text-gray-500">{stats.semAvaliacao}</div>
            <div className="text-xs md:text-sm text-gray-600">Sem Avaliação</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros - Layout responsivo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Filter className="h-4 w-4 md:h-5 md:w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar roteiros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
            
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="bombou">🚀 Bombaram</SelectItem>
                <SelectItem value="flopou">📉 Floparam</SelectItem>
                <SelectItem value="neutro">😐 Neutros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="carrossel">Carrossel</SelectItem>
                <SelectItem value="stories">Stories</SelectItem>
                <SelectItem value="reels">Reels</SelectItem>
                <SelectItem value="imagem">Imagem</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={loadScripts} 
              variant="outline" 
              size="sm"
              className="w-full md:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de roteiros - Layout responsivo */}
      <div className="space-y-3 md:space-y-4">
        {filteredScripts.map((script) => (
          <Card key={script.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 md:pb-3">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate">{script.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{script.format}</Badge>
                    {script.equipment_used.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {script.equipment_used.slice(0, 2).join(', ')}
                        {script.equipment_used.length > 2 && ' +mais'}
                      </Badge>
                    )}
                    {getPerformanceBadge(script.performance)}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedScriptId(script.id);
                      setFeedbackDialogOpen(true);
                    }}
                    className="text-xs"
                  >
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Avaliar
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => sendToContentPlanner(script)}
                    className="text-xs"
                  >
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Planejar
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-3">
                    {script.script_content.substring(0, 300)}...
                  </p>
                </div>
                
                {script.performance && (
                  <div className="space-y-2">
                    <h4 className="text-xs md:text-sm font-medium">Métricas:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {script.performance.metrics.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {script.performance.metrics.views}
                        </div>
                      )}
                      {script.performance.metrics.likes && (
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {script.performance.metrics.likes}
                        </div>
                      )}
                      {script.performance.metrics.comments && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {script.performance.metrics.comments}
                        </div>
                      )}
                      {script.performance.metrics.engagement_rate && (
                        <div className="text-green-600 font-medium">
                          {script.performance.metrics.engagement_rate}% eng.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredScripts.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8 md:py-12">
            <FileText className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
              {scripts.length === 0 ? 'Nenhum roteiro aprovado' : 'Nenhum roteiro encontrado'}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              {scripts.length === 0 
                ? 'Comece criando roteiros no FLUIDAROTEIRISTA e aprovando-os aqui.'
                : searchQuery || performanceFilter !== 'all' || formatFilter !== 'all'
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Não há roteiros disponíveis no momento.'
              }
            </p>
            {scripts.length === 0 && (
              <Button 
                onClick={() => window.location.href = '/fluidaroteirista'} 
                className="mt-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Primeiro Roteiro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <EnhancedFeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        scriptId={selectedScriptId}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
};

export default ApprovedScriptsManager;
