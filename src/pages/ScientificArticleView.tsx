import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, MessageSquare, Building, Users, Tag as TagIcon, Download, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { UnifiedDocument } from '@/types/document';
import { SUPABASE_BASE_URL } from '@/integrations/supabase/client';
import ArticleChatInterface from '@/components/scientific-articles/ArticleChatInterface';

const ScientificArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<UnifiedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf');

  const { articles, fetchScientificArticles } = useScientificArticles();

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        
        // First try to find in existing articles
        const existingArticle = articles?.find(a => a.id === id);
        if (existingArticle) {
          setArticle(existingArticle);
          setLoading(false);
          return;
        }

        // If not found, fetch all articles to get the specific one
        await fetchScientificArticles({});
        
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Erro ao carregar o artigo');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id, articles, fetchScientificArticles]);

  // Update article when articles are loaded
  useEffect(() => {
    if (articles && id) {
      const foundArticle = articles.find(a => a.id === id);
      if (foundArticle) {
        setArticle(foundArticle);
      }
    }
  }, [articles, id]);

  if (loading) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple mx-auto"></div>
              <p className="aurora-text-gradient-enhanced">Carregando artigo...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
        <div className="container mx-auto px-6 py-8">
          <Card className="aurora-glass-enhanced border-red-500/30">
            <CardContent className="p-6 text-center">
              <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                {error || 'Artigo não encontrado'}
              </h3>
              <Button 
                onClick={() => navigate('/scientific-articles')} 
                className="aurora-button-enhanced"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à biblioteca
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const equipamentoNome = article.equipamento_nome || 'Não especificado';
  const fullFileUrl = article.file_path ? `${SUPABASE_BASE_URL}/storage/v1/object/public/documents/${article.file_path}` : null;

  return (
    <div className="aurora-page-container min-h-screen aurora-enhanced-bg relative">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="aurora-orb-1 absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"></div>
        <div className="aurora-orb-2 absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15"></div>
        <div className="aurora-orb-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-aurora-electric-purple/20 aurora-glass-enhanced">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/scientific-articles')}
                className="text-aurora-electric-purple hover:bg-aurora-electric-purple/10 aurora-animate-scale"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div className="w-px h-6 bg-aurora-electric-purple/30"></div>
              <h1 className="aurora-heading-enhanced text-xl lg:text-2xl line-clamp-1">
                {article.titulo_extraido || 'Artigo Científico'}
              </h1>
            </div>
            
            {/* Status and Equipment Info */}
            <div className="flex items-center gap-3">
              <Badge className={
                article.status_processamento === 'concluido' 
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : article.status_processamento === 'falhou' 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              }>
                {article.status_processamento}
              </Badge>
              <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                {article.tipo_documento}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="relative z-10 container mx-auto px-6 py-6 h-[calc(100vh-120px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-6 aurora-glass-enhanced border-aurora-electric-purple/30">
            <TabsTrigger 
              value="pdf" 
              className="flex items-center gap-2 aurora-animate-scale data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
            >
              <FileText className="h-4 w-4" />
              Visualizar PDF
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-2 aurora-animate-scale data-[state=active]:bg-aurora-electric-purple/20 data-[state=active]:text-aurora-electric-purple"
            >
              <MessageSquare className="h-4 w-4" />
              Chat com IA
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="pdf" className="h-full m-0">
              <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Sidebar - Document Info */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto aurora-scrollbar">
                  {/* Document Info Cards */}
                  <Card className="aurora-glass-enhanced border-aurora-soft-pink/30 aurora-animate-scale">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-aurora-soft-pink" />
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Equipamento</p>
                          <p className="aurora-text-gradient-enhanced font-medium text-sm">{equipamentoNome}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {article.autores && article.autores.length > 0 && (
                    <Card className="aurora-glass-enhanced border-aurora-neon-blue/30 aurora-animate-scale">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-aurora-neon-blue" />
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Autores</p>
                          </div>
                          <div className="space-y-1">
                            {article.autores.slice(0, 3).map((author, index) => (
                              <p key={index} className="text-xs text-aurora-neon-blue font-medium">
                                {author}
                              </p>
                            ))}
                            {article.autores.length > 3 && (
                              <p className="text-xs text-slate-400">
                                +{article.autores.length - 3} mais
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {article.palavras_chave && article.palavras_chave.length > 0 && (
                    <Card className="aurora-glass-enhanced border-aurora-emerald/30 aurora-animate-scale">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <TagIcon className="h-4 w-4 text-aurora-emerald" />
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Palavras-chave</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {article.palavras_chave.slice(0, 6).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                                {keyword}
                              </Badge>
                            ))}
                            {article.palavras_chave.length > 6 && (
                              <Badge variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                                +{article.palavras_chave.length - 6}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Abstract Preview */}
                  {article.texto_completo && (
                    <Card className="aurora-glass-enhanced border-aurora-electric-purple/30 aurora-animate-scale">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 uppercase tracking-wide">Resumo</p>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-6">
                            {article.texto_completo}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Main PDF Viewer */}
                <div className="lg:col-span-3">
                  {fullFileUrl ? (
                    <Card className="aurora-glass-enhanced border-aurora-cyan/30 aurora-animate-fade-in h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
                            <FileText className="h-5 w-5 text-aurora-cyan" />
                            Documento PDF
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = fullFileUrl;
                                link.download = `${article.titulo_extraido || 'artigo'}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="border-aurora-emerald/30 text-aurora-emerald hover:bg-aurora-emerald/10"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(fullFileUrl, '_blank')}
                              className="border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/10"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Abrir em nova aba
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                              className="border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/10"
                            >
                              {isPdfExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-4">
                        <div className={`rounded-lg overflow-hidden border border-aurora-cyan/20 transition-all duration-300 ${
                          isPdfExpanded ? 'h-[calc(100vh-220px)]' : 'h-[calc(100vh-300px)]'
                        }`}>
                          <iframe
                            src={`${fullFileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                            className="w-full h-full rounded-lg"
                            title="PDF Viewer"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="aurora-glass-enhanced border-aurora-cyan/30 h-full flex items-center justify-center">
                      <CardContent className="text-center">
                        <FileText className="h-16 w-16 text-aurora-cyan mx-auto mb-4 opacity-50" />
                        <p className="aurora-text-gradient-enhanced text-lg">
                          PDF não disponível
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              <div className="h-full aurora-animate-fade-in">
                <ArticleChatInterface article={article} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ScientificArticleView;