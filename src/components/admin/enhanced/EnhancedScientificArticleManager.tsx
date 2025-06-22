
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  User, 
  Tag,
  Trash2,
  Edit,
  Eye,
  Filter,
  RefreshCw,
  BookOpen,
  Users,
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';
import EnhancedScientificArticleDialog from './EnhancedScientificArticleDialog';

const EnhancedScientificArticleManager: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  const { toast } = useToast();
  const { articles, loading, error, fetchScientificArticles, deleteArticle, processArticle } = useScientificArticles();
  const { equipments } = useEquipments();

  useEffect(() => {
    fetchScientificArticles();
  }, [fetchScientificArticles]);

  const handleSearch = () => {
    fetchScientificArticles({
      search: searchTerm,
      status_processamento: statusFilter || undefined,
      equipamento_id: equipmentFilter || undefined
    });
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo científico?')) {
      return;
    }

    try {
      await deleteArticle(id);
      toast({
        title: 'Sucesso',
        description: 'Artigo científico excluído com sucesso',
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir artigo científico',
        variant: 'destructive',
      });
    }
  };

  const handleProcessArticle = async (id: string) => {
    try {
      await processArticle(id);
      toast({
        title: 'Sucesso',
        description: 'Processamento do artigo iniciado',
      });
    } catch (error) {
      console.error('Error processing article:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar artigo',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setIsDialogOpen(true);
  };

  const handleEditArticle = (article: any) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    setSelectedArticle(null);
    fetchScientificArticles();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-aurora-emerald" />;
      case 'processando':
        return <Clock className="h-4 w-4 text-aurora-neon-blue animate-pulse" />;
      case 'falhou':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-aurora-soft-pink" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30';
      case 'processando':
        return 'bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30';
      case 'falhou':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-aurora-soft-pink/20 text-aurora-soft-pink border-aurora-soft-pink/30';
    }
  };

  if (loading) {
    return (
      <div className="aurora-dark-bg min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-aurora-electric-purple" />
            <span className="text-slate-300">Carregando artigos científicos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aurora-dark-bg min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-300 mb-4">{error}</p>
            <Button onClick={() => fetchScientificArticles()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-dark-bg min-h-screen p-6">
      <div className="aurora-particles fixed inset-0 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Artigos Científicos
              </h1>
              <p className="text-slate-400 aurora-body">
                Gerenciar e processar artigos científicos com IA
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
                  placeholder="Buscar por título, conteúdo ou autores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="falhou">Falhou</SelectItem>
                </SelectContent>
              </Select>

              <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os equipamentos</SelectItem>
                  {equipments?.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>

              <Button onClick={handleCreateNew} className="aurora-button">
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="aurora-card hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg aurora-heading line-clamp-2">
                    {article.titulo_extraido || 'Artigo Científico'}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(article.status_processamento)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(article.status_processamento)}>
                    {article.status_processamento}
                  </Badge>
                  {article.tipo_documento && (
                    <Badge variant="outline" className="text-aurora-electric-purple border-aurora-electric-purple/30">
                      {article.tipo_documento}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Keywords */}
                {article.palavras_chave && article.palavras_chave.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-aurora-emerald">
                      <Tag className="h-3 w-3" />
                      <span>Palavras-chave</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-aurora-emerald/20 text-aurora-emerald">
                          {keyword}
                        </Badge>
                      ))}
                      {article.palavras_chave.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-aurora-emerald/20 text-aurora-emerald">
                          +{article.palavras_chave.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Authors */}
                {article.autores && article.autores.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-aurora-soft-pink">
                      <Users className="h-3 w-3" />
                      <span>Autores</span>
                    </div>
                    <div className="text-sm text-slate-300">
                      {article.autores.slice(0, 2).join(', ')}
                      {article.autores.length > 2 && ` e mais ${article.autores.length - 2}`}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {article.equipamentos && (
                  <div className="flex items-center gap-2 text-sm text-aurora-neon-blue">
                    <Database className="h-3 w-3" />
                    <span>{article.equipamentos.nome}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(article.created_at).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditArticle(article)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  
                  {article.status_processamento === 'pendente' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProcessArticle(article.id)}
                      className="border-aurora-neon-blue text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Processar
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteArticle(article.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              Nenhum artigo científico encontrado
            </h3>
            <p className="text-slate-400 mb-6">
              Comece criando seu primeiro artigo científico
            </p>
            <Button onClick={handleCreateNew} className="aurora-button">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Artigo
            </Button>
          </div>
        )}
      </div>

      {/* Dialog */}
      <EnhancedScientificArticleDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleDialogSuccess}
        articleData={selectedArticle}
      />
    </div>
  );
};

export default EnhancedScientificArticleManager;
