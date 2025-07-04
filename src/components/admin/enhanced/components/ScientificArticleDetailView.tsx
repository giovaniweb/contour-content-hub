import React, { useState } from 'react';
import { UnifiedDocument } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Link as LinkIcon, Paperclip, Users, Tag as TagIcon, Building, MessageCircle, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { SUPABASE_BASE_URL } from '@/integrations/supabase/client';
import ArticleChatInterface from '@/components/scientific-articles/ArticleChatInterface';

interface ScientificArticleDetailViewProps {
  article: UnifiedDocument | null;
  onClose: () => void;
}

const ScientificArticleDetailView: React.FC<ScientificArticleDetailViewProps> = ({ article, onClose }) => {
  const [isPdfExpanded, setIsPdfExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'chat'>('content');

  if (!article) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg flex items-center justify-center">
        <div className="text-center space-y-4 aurora-animate-fade-in">
          <FileText className="h-16 w-16 text-aurora-electric-purple mx-auto opacity-50" />
          <p className="aurora-text-gradient-enhanced text-lg">
            Nenhum artigo selecionado ou dados não disponíveis.
          </p>
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
                onClick={onClose}
                className="text-aurora-electric-purple hover:bg-aurora-electric-purple/10 aurora-animate-scale"
              >
                ← Voltar
              </Button>
              <div className="w-px h-6 bg-aurora-electric-purple/30"></div>
              <h1 className="aurora-heading-enhanced text-xl lg:text-2xl line-clamp-1">
                {article.titulo_extraido || 'Artigo Científico'}
              </h1>
            </div>
            
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden">
              <Button
                variant={activeTab === 'content' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('content')}
                className="aurora-button-enhanced mr-2"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="aurora-button-enhanced"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-6 h-[calc(100vh-80px)]">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Content Panel */}
          <div className={`lg:col-span-2 ${activeTab === 'content' ? 'block' : 'hidden lg:block'} space-y-6 overflow-y-auto pr-2 aurora-scrollbar`}>
            
            {/* Status and Equipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 aurora-animate-fade-in">
              <Card className="aurora-glass-enhanced border-aurora-electric-purple/30 aurora-animate-scale">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-aurora-electric-purple animate-pulse"></div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                      <Badge className={
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
                </CardContent>
              </Card>

              <Card className="aurora-glass-enhanced border-aurora-soft-pink/30 aurora-animate-scale">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-aurora-soft-pink" />
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Equipamento</p>
                      <p className="aurora-text-gradient-enhanced font-medium">{equipamentoNome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PDF Viewer */}
            {fullFileUrl && (
              <Card className="aurora-glass-enhanced border-aurora-cyan/30 aurora-animate-fade-in">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
                      <FileText className="h-5 w-5 text-aurora-cyan" />
                      Visualização do PDF
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(fullFileUrl, '_blank')}
                        className="border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/10"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Abrir Original
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
                <CardContent>
                  <div className={`rounded-lg overflow-hidden border border-aurora-cyan/20 transition-all duration-300 ${
                    isPdfExpanded ? 'h-[80vh]' : 'h-96'
                  }`}>
                    <iframe
                      src={`${fullFileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Abstract */}
            {article.texto_completo && (
              <Card className="aurora-glass-enhanced border-aurora-electric-purple/30 aurora-animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
                    <Paperclip className="h-5 w-5 text-aurora-electric-purple" />
                    Abstract / Resumo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {article.texto_completo}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Authors */}
            {article.autores && article.autores.length > 0 && (
              <Card className="aurora-glass-enhanced border-aurora-neon-blue/30 aurora-animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
                    <Users className="h-5 w-5 text-aurora-neon-blue" />
                    Autores / Pesquisadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.autores.map((author, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30 aurora-animate-scale hover:scale-105 transition-transform cursor-pointer"
                      >
                        {author}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keywords */}
            {article.palavras_chave && article.palavras_chave.length > 0 && (
              <Card className="aurora-glass-enhanced border-aurora-emerald/30 aurora-animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
                    <TagIcon className="h-5 w-5 text-aurora-emerald" />
                    Palavras-chave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.palavras_chave.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 aurora-animate-scale hover:scale-105 transition-transform cursor-pointer"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Details */}
            <Card className="aurora-glass-enhanced border-slate-600/30 aurora-animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="aurora-text-gradient-enhanced">Detalhes Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 font-medium">Tipo de Documento:</span>
                      <Badge variant="outline" className="ml-2 border-aurora-electric-purple/30 text-aurora-electric-purple">
                        {article.tipo_documento}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Data de Upload:</span>
                      <span className="text-slate-300 ml-2">
                        {new Date(article.data_upload).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 font-medium">ID do Documento:</span>
                      <code className="text-xs bg-slate-800/50 px-2 py-1 rounded ml-2 text-aurora-cyan">
                        {article.id.substring(0, 8)}...
                      </code>
                    </div>
                    {article.file_path && (
                      <div>
                        <span className="text-slate-400 font-medium">Arquivo:</span>
                        <span className="text-xs text-slate-500 ml-2 truncate block">
                          {article.file_path}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {article.detalhes_erro && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <span className="text-red-400 font-medium text-sm">
                      Erro de Processamento: {article.detalhes_erro}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className={`lg:col-span-1 ${activeTab === 'chat' ? 'block' : 'hidden lg:block'} h-full`}>
            <div className="h-full aurora-animate-fade-in">
              <ArticleChatInterface article={article} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificArticleDetailView;
