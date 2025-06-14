
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
  MessageCircle
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
      const data = await approvedScriptsService.getApprovedScripts();
      setScripts(data);
    } catch (error) {
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
      return <Badge variant="outline">Sem avaliação</Badge>;
    }

    switch (performance.performance_rating) {
      case 'bombou':
        return <Badge className="bg-green-500 text-white">🚀 BOMBOU</Badge>;
      case 'flopou':
        return <Badge className="bg-red-500 text-white">📉 FLOPOU</Badge>;
      case 'neutro':
        return <Badge className="bg-yellow-500 text-white">😐 NEUTRO</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando roteiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.bombaram}</div>
            <div className="text-sm text-gray-600">Bombaram</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.floparam}</div>
            <div className="text-sm text-gray-600">Floparam</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.neutros}</div>
            <div className="text-sm text-gray-600">Neutros</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">{stats.semAvaliacao}</div>
            <div className="text-sm text-gray-600">Sem Avaliação</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar roteiros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[150px]">
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de roteiros */}
      <div className="grid gap-4">
        {filteredScripts.map((script) => (
          <Card key={script.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{script.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{script.format}</Badge>
                    {script.equipment_used.length > 0 && (
                      <Badge variant="secondary">
                        {script.equipment_used.slice(0, 2).join(', ')}
                        {script.equipment_used.length > 2 && ' +mais'}
                      </Badge>
                    )}
                    {getPerformanceBadge(script.performance)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedScriptId(script.id);
                      setFeedbackDialogOpen(true);
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Avaliar
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => sendToContentPlanner(script)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Planejar
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {script.script_content.substring(0, 300)}...
                  </p>
                </div>
                
                {script.performance && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Métricas:</h4>
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

      {filteredScripts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenh roteiro encontrado
            </h3>
            <p className="text-gray-600">
              {searchQuery || performanceFilter !== 'all' || formatFilter !== 'all'
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Comece aprovando alguns roteiros para vê-los aqui.'
              }
            </p>
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
