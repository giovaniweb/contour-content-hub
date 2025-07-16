import React, { useState, useEffect } from 'react';
import { UnifiedDocument } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon, Paperclip, Users, Tag as TagIcon, Building, MessageCircle, FileText, Maximize2, Minimize2, BookOpen, ArrowLeft } from 'lucide-react';
import { SUPABASE_BASE_URL } from '@/integrations/supabase/client';
import ArticleChatInterface from '@/components/scientific-articles/ArticleChatInterface';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ScientificArticleViewerProps {
  articleId: string;
  onBack: () => void;
}

const ScientificArticleViewer: React.FC<ScientificArticleViewerProps> = ({ articleId, onBack }) => {
  const [article, setArticle] = useState<UnifiedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('unified_documents')
          .select(`
            *,
            equipamento_nome:equipamentos(nome)
          `)
          .eq('id', articleId)
          .single();

        if (error) throw error;

        setArticle({
          ...data,
          equipamento_nome: data.equipamento_nome?.nome || null,
          tipo_documento: data.tipo_documento as any
        } as UnifiedDocument);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o artigo.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg flex items-center justify-center">
        <div className="text-center space-y-4 aurora-animate-fade-in">
          <FileText className="h-16 w-16 text-aurora-electric-purple mx-auto opacity-50 animate-pulse" />
          <p className="aurora-text-gradient-enhanced text-lg">
            Carregando artigo...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg flex items-center justify-center">
        <div className="text-center space-y-4 aurora-animate-fade-in">
          <FileText className="h-16 w-16 text-aurora-electric-purple mx-auto opacity-50" />
          <p className="aurora-text-gradient-enhanced text-lg">
            Artigo não encontrado.
          </p>
          <Button onClick={onBack} className="aurora-button-enhanced">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
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
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-aurora-cyan hover:text-aurora-cyan-bright hover:bg-aurora-cyan/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="aurora-heading-enhanced text-2xl">
                  {article.titulo_extraido || 'Documento Científico'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                    {article.tipo_documento}
                  </Badge>
                  <Badge variant="secondary" className={
                    article.status_processamento === 'concluido' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : article.status_processamento === 'falhou' 
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }>
                    {article.status_processamento}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Tabs defaultValue="article" className="w-full space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-3 aurora-glass-enhanced border-aurora-electric-purple/30">
            <TabsTrigger value="article" className="flex items-center gap-2 data-[state=active]:aurora-tab-active">
              <BookOpen className="h-4 w-4" />
              ARTIGO
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2 data-[state=active]:aurora-tab-active">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:aurora-tab-active">
              <MessageCircle className="h-4 w-4" />
              CHAT AI
            </TabsTrigger>
          </TabsList>

          {/* Article Tab */}
          <TabsContent value="article" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="aurora-card-enhanced">
                  <CardHeader>
                    <CardTitle className="aurora-text-gradient-enhanced">Conteúdo do Artigo</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    {article.texto_completo ? (
                      <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                        {article.texto_completo}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">
                        Conteúdo não disponível. O documento pode estar sendo processado ou ter falhado no processamento.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Document Info */}
                <Card className="aurora-card-enhanced">
                  <CardHeader>
                    <CardTitle className="aurora-text-gradient-enhanced flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informações do Documento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-aurora-cyan" />
                        <span className="text-sm text-slate-300">
                          <strong>Equipamento:</strong> {equipamentoNome}
                        </span>
                      </div>
                      
                      {article.autores && article.autores.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-aurora-emerald mt-0.5" />
                          <div className="text-sm text-slate-300">
                            <strong>Autores:</strong>
                            <div className="mt-1">
                              {article.autores.map((autor, index) => (
                                <div key={index} className="text-slate-400">{autor}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {article.file_path && (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-aurora-electric-purple" />
                          <a
                            href={fullFileUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-aurora-electric-purple hover:text-aurora-electric-purple-bright underline"
                          >
                            Arquivo original
                          </a>
                        </div>
                      )}
                    </div>

                    {article.palavras_chave && article.palavras_chave.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-aurora-emerald" />
                          <span className="text-sm font-medium text-slate-200">Palavras-chave</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.palavras_chave.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-6">
            <Card className="aurora-card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="aurora-text-gradient-enhanced">Visualização PDF</CardTitle>
                <Button
                  onClick={() => setIsPdfExpanded(!isPdfExpanded)}
                  variant="outline"
                  size="sm"
                  className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
                >
                  {isPdfExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {fullFileUrl ? (
                  <div className={`transition-all duration-300 ${isPdfExpanded ? 'h-screen' : 'h-96'}`}>
                    <iframe
                      src={fullFileUrl}
                      className="w-full h-full border border-aurora-electric-purple/30 rounded"
                      title="PDF Viewer"
                    />
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Arquivo PDF não disponível</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="aurora-card-enhanced">
              <CardHeader>
                <CardTitle className="aurora-text-gradient-enhanced">Chat com IA sobre o Artigo</CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleChatInterface article={article} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScientificArticleViewer;