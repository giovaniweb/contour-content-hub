
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Eye, Edit, Trash2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';
import { toast } from 'sonner';
import EnhancedScientificArticleForm from './EnhancedScientificArticleForm';
import { UnifiedDocument } from '@/types/document';

const EnhancedScientificArticleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<UnifiedDocument | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const { 
    articles, 
    loading, 
    error, 
    fetchScientificArticles, 
    deleteArticle, 
    processArticle 
  } = useScientificArticles();
  
  const { equipments, loading: equipmentsLoading } = useEquipments();

  // Load articles on component mount
  useEffect(() => {
    console.log('📚 EnhancedScientificArticleManager: Loading articles...');
    fetchScientificArticles();
  }, [fetchScientificArticles]);

  // Filter articles based on search and filters
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.titulo_extraido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.texto_completo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEquipment = !equipmentFilter || 
      article.equipamento_id === equipmentFilter;
    
    const matchesStatus = !statusFilter || 
      article.status_processamento === statusFilter;

    return matchesSearch && matchesEquipment && matchesStatus;
  });

  const handleCreateNew = () => {
    setSelectedArticle(null);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (article: UnifiedDocument) => {
    setSelectedArticle(article);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleView = (article: UnifiedDocument) => {
    setSelectedArticle(article);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) {
      return;
    }

    try {
      await deleteArticle(articleId);
      toast.success('Artigo excluído com sucesso!');
    } catch (error: any) {
      console.error('Error deleting article:', error);
      toast.error('Erro ao excluir artigo: ' + error.message);
    }
  };

  const handleProcess = async (articleId: string) => {
    try {
      await processArticle(articleId);
      toast.success('Processamento iniciado! O artigo será processado em breve.');
    } catch (error: any) {
      console.error('Error processing article:', error);
      toast.error('Erro ao processar artigo: ' + error.message);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedArticle(null);
    fetchScientificArticles(); // Reload articles
    toast.success(selectedArticle ? 'Artigo atualizado!' : 'Artigo criado!');
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedArticle(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendente': { color: 'bg-yellow-500', text: 'Pendente' },
      'processando': { color: 'bg-blue-500', text: 'Processando' },
      'concluido': { color: 'bg-green-500', text: 'Concluído' },
      'falhou': { color: 'bg-red-500', text: 'Falhou' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-gray-500', text: status };

    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="aurora-card p-8 text-center">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-red-300 mb-2">
            Erro ao carregar artigos
          </h3>
          <p className="text-red-400 mb-6">{error}</p>
          <Button onClick={() => fetchScientificArticles()} className="aurora-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                Gerenciar Artigos Científicos
              </h1>
              <p className="text-slate-400 aurora-body">
                Upload, processamento e gerenciamento de artigos científicos com IA
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="aurora-card p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os equipamentos</SelectItem>
                  {equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="falhou">Falhou</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleCreateNew} className="aurora-button">
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="aurora-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple mx-auto mb-4"></div>
            <p className="text-slate-400">Carregando artigos...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="aurora-card p-8 text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">
              {searchTerm || equipmentFilter || statusFilter ? 'Nenhum artigo encontrado' : 'Nenhum artigo científico'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || equipmentFilter || statusFilter 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece fazendo upload do seu primeiro artigo científico'
              }
            </p>
            {!searchTerm && !equipmentFilter && !statusFilter && (
              <Button onClick={handleCreateNew} className="aurora-button">
                <Plus className="h-4 w-4 mr-2" />
                Primeiro Artigo
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="aurora-card hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 aurora-heading">
                      {article.titulo_extraido || 'Artigo sem título'}
                    </CardTitle>
                    {getStatusBadge(article.status_processamento)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {article.texto_completo && (
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {article.texto_completo}
                    </p>
                  )}

                  {article.equipamento_nome && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {article.equipamento_nome}
                      </Badge>
                    </div>
                  )}

                  {article.palavras_chave && article.palavras_chave.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {article.palavras_chave.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.palavras_chave.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {article.autores && article.autores.length > 0 && (
                    <p className="text-xs text-slate-500">
                      Autores: {article.autores.join(', ')}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-slate-500">
                      {new Date(article.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(article)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(article)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      {article.status_processamento !== 'processando' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleProcess(article.id)}
                          className="h-8 w-8 p-0"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(article.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="aurora-glass-enhanced max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="aurora-text-gradient">
                {isViewMode 
                  ? 'Visualizar Artigo Científico'
                  : selectedArticle 
                    ? 'Editar Artigo Científico' 
                    : 'Novo Artigo Científico'
                }
              </DialogTitle>
            </DialogHeader>
            
            {isViewMode && selectedArticle ? (
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedArticle.titulo_extraido}</h3>
                  {getStatusBadge(selectedArticle.status_processamento)}
                </div>

                {selectedArticle.texto_completo && (
                  <div>
                    <h4 className="font-medium mb-2">Conteúdo</h4>
                    <p className="text-slate-300">{selectedArticle.texto_completo}</p>
                  </div>
                )}

                {selectedArticle.palavras_chave && selectedArticle.palavras_chave.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Palavras-chave</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.palavras_chave.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArticle.autores && selectedArticle.autores.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Autores</h4>
                    <p className="text-slate-300">{selectedArticle.autores.join(', ')}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleFormCancel}>
                    Fechar
                  </Button>
                  <Button onClick={() => setIsViewMode(false)} className="aurora-button">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            ) : (
              <EnhancedScientificArticleForm
                articleData={selectedArticle}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                isOpen={isFormOpen}
                forceClearState={!selectedArticle}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EnhancedScientificArticleManager;
