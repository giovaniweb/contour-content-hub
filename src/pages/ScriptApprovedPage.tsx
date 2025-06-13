
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Filter, Grid, List, Search, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data para roteiros aprovados
const mockApprovedScripts = [
  {
    id: '1',
    titulo: 'Harmonização Facial com Preenchimento',
    formato: 'carrossel',
    emocao_central: 'confiança',
    mentor: 'Criativo',
    data_aprovacao: '2024-01-15',
    performance: 'excelente',
    equipamentos: ['Preenchimento Dérmico', 'Ácido Hialurônico'],
    tags: ['harmonização', 'preenchimento', 'facial'],
    objetivo: '🟡 Atrair Atenção',
    word_count: 180,
    sent_to_planner: false,
    feedback_bombou: true
  },
  {
    id: '2',
    titulo: 'Rejuvenescimento com Laser CO2',
    formato: 'reels',
    emocao_central: 'transformação',
    mentor: 'Técnico',
    data_aprovacao: '2024-01-12',
    performance: 'boa',
    equipamentos: ['Laser CO2 Fracionado'],
    tags: ['rejuvenescimento', 'laser', 'pele'],
    objetivo: '🔵 Educar',
    word_count: 120,
    sent_to_planner: true,
    feedback_bombou: true
  },
  {
    id: '3',
    titulo: 'Tratamento de Flacidez Corporal',
    formato: 'stories_10x',
    emocao_central: 'esperança',
    mentor: 'Empático',
    data_aprovacao: '2024-01-10',
    performance: 'média',
    equipamentos: ['Radiofrequência Multipolar'],
    tags: ['flacidez', 'corporal', 'radiofrequência'],
    objetivo: '🟢 Converter',
    word_count: 250,
    sent_to_planner: false,
    feedback_bombou: false
  }
];

const ScriptApprovedPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scripts] = useState(mockApprovedScripts);

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFormat = selectedFormat === 'all' || script.formato === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excelente': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'boa': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'média': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'carrossel': return '📱';
      case 'reels': return '🎬';
      case 'stories_10x': return '📚';
      case 'post_estatico': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <CheckCircle className="h-12 w-12 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Roteiros Aprovados</h1>
            <p className="text-slate-400">
              Seus roteiros validados e prontos para usar
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{scripts.length}</div>
            <div className="text-slate-400">Total Aprovados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {scripts.filter(s => s.feedback_bombou).length}
            </div>
            <div className="text-slate-400">Performance Excelente</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {scripts.filter(s => s.sent_to_planner).length}
            </div>
            <div className="text-slate-400">No Planejador</div>
          </div>
        </div>
      </motion.div>

      {/* Filtros e Controles */}
      <Card className="aurora-glass border-slate-600">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar roteiros, equipamentos, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200"
              >
                <option value="all">Todos os Formatos</option>
                <option value="carrossel">Carrossel</option>
                <option value="reels">Reels</option>
                <option value="stories_10x">Stories 10x</option>
                <option value="post_estatico">Post Estático</option>
              </select>

              {/* Modo de Visualização */}
              <div className="flex border border-slate-600 rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Roteiros */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredScripts.length === 0 ? (
          <Card className="aurora-glass border-slate-600">
            <CardContent className="p-12 text-center">
              <div className="text-slate-400 mb-4">
                <CheckCircle className="h-16 w-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                Nenhum roteiro encontrado
              </h3>
              <p className="text-slate-400">
                {searchTerm ? 'Tente ajustar seus filtros de busca.' : 'Você ainda não possui roteiros aprovados.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredScripts.map((script, index) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="aurora-glass border-slate-600 hover:border-purple-400/50 transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFormatIcon(script.formato)}</span>
                        <div>
                          <CardTitle className="text-lg text-slate-200 line-clamp-2">
                            {script.titulo}
                          </CardTitle>
                          <p className="text-sm text-slate-400 capitalize">
                            {script.formato} • {script.mentor}
                          </p>
                        </div>
                      </div>
                      {script.feedback_bombou && (
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Performance */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`${getPerformanceColor(script.performance)} border`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {script.performance}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {script.word_count} palavras
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {script.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-slate-700/50">
                          {tag}
                        </Badge>
                      ))}
                      {script.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-slate-700/50">
                          +{script.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Equipamentos */}
                    <div className="text-xs text-slate-400">
                      <strong>Equipamentos:</strong> {script.equipamentos.join(', ')}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Ver Roteiro
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        Duplicar
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs bg-purple-600 hover:bg-purple-700"
                        disabled={script.sent_to_planner}
                      >
                        {script.sent_to_planner ? 'No Planejador' : 'Enviar ao Planner'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScriptApprovedPage;
