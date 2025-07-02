import React from 'react';
import { UnifiedDocument } from '@/types/document'; // Assuming UnifiedDocument is the correct type
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Link as LinkIcon, Paperclip, Users, Tag as TagIcon, Building } from 'lucide-react';
import { SUPABASE_BASE_URL } from '@/integrations/supabase/client'; // For constructing file URLs

interface ScientificArticleDetailViewProps {
  article: UnifiedDocument | null;
  onClose: () => void;
}

const ScientificArticleDetailView: React.FC<ScientificArticleDetailViewProps> = ({ article, onClose }) => {
  if (!article) {
    return (
      <div className="p-8 text-center text-slate-400">
        Nenhum artigo selecionado ou dados não disponíveis.
      </div>
    );
  }

  const equipamentoNome = article.equipamento_nome || 'Não especificado';
  const fullFileUrl = article.file_path ? `${SUPABASE_BASE_URL}/storage/v1/object/public/documents/${article.file_path}` : null;

  return (
    <div className="p-6 sm:p-8 bg-aurora-deep-blue text-slate-100 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-aurora-electric-purple scrollbar-track-aurora-gray">
      <Card className="bg-aurora-gray border-aurora-electric-purple/30 shadow-2xl aurora-animate-fade-in">
        <CardHeader className="border-b border-aurora-electric-purple/20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-light aurora-text-gradient mb-2">
                {article.titulo_extraido || 'Título não disponível'}
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm sm:text-base">
                Detalhes do Artigo Científico
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-aurora-electric-purple hover:bg-aurora-electric-purple/10">
              Fechar (X)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Abstract/Description */}
          {article.texto_completo && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-aurora-electric-purple flex items-center">
                <Paperclip className="h-5 w-5 mr-2" /> Abstract / Resumo
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {article.texto_completo}
              </p>
            </div>
          )}

          {/* Authors */}
          {article.autores && article.autores.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-aurora-neon-blue flex items-center">
                <Users className="h-5 w-5 mr-2" /> Autores / Pesquisadores
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.autores.map((author, index) => (
                  <Badge key={index} variant="secondary" className="bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30 text-sm">
                    {author}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {article.palavras_chave && article.palavras_chave.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-aurora-emerald flex items-center">
                <TagIcon className="h-5 w-5 mr-2" /> Palavras-chave
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.palavras_chave.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30 text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
           <div className="space-y-2">
              <h3 className="text-lg font-semibold text-aurora-soft-pink flex items-center">
                <Building className="h-5 w-5 mr-2" /> Equipamento Relacionado
              </h3>
              <p className="text-slate-300 text-sm sm:text-base">{equipamentoNome}</p>
            </div>

          {/* File Actions and Info */}
          <div className="space-y-3 pt-4 border-t border-aurora-electric-purple/20">
             <h3 className="text-lg font-semibold text-aurora-cyan flex items-center">
                <Paperclip className="h-5 w-5 mr-2" /> Arquivo Original
              </h3>
            {fullFileUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button
                  onClick={() => window.open(fullFileUrl, '_blank')}
                  variant="outline"
                  className="aurora-button-enhanced border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10 w-full sm:w-auto"
                >
                  <LinkIcon className="h-4 w-4 mr-2" /> Ver PDF Original
                </Button>
                {/* Optional: Direct Download Button - requires documentService or similar */}
                {/* <Button variant="outline" className="aurora-button-enhanced border-aurora-emerald text-aurora-emerald hover:bg-aurora-emerald/10">
                  <Download className="h-4 w-4 mr-2" /> Baixar PDF
                </Button> */}
                 <p className="text-xs text-slate-500 truncate">
                  {article.file_path}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Nenhum arquivo PDF associado diretamente.</p>
            )}
             {article.link_dropbox && !fullFileUrl && (
                <div className="flex items-center gap-3 mt-2">
                    <Button
                        onClick={() => window.open(article.link_dropbox as string, '_blank')}
                        variant="outline"
                        className="aurora-button-enhanced border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10 w-full sm:w-auto"
                    >
                        <LinkIcon className="h-4 w-4 mr-2" /> Ver Link Externo
                    </Button>
                    <p className="text-xs text-slate-500 truncate">
                        {article.link_dropbox}
                    </p>
                </div>
             )}
          </div>

          {/* Other Details */}
          <div className="space-y-3 pt-4 border-t border-aurora-electric-purple/20">
             <h3 className="text-lg font-semibold text-slate-300">Outras Informações</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-slate-400 font-medium">ID do Documento: </span>
                <span className="text-slate-300 break-all">{article.id}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Tipo: </span>
                <span className="text-slate-300">{article.tipo_documento}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Data de Upload: </span>
                <span className="text-slate-300">{new Date(article.data_upload).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Status Processamento: </span>
                <Badge variant={
                  article.status_processamento === 'concluido' ? 'default' :
                  article.status_processamento === 'falhou' ? 'destructive' : 'secondary'
                }
                className={
                    article.status_processamento === 'concluido' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    article.status_processamento === 'falhou' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                }>
                  {article.status_processamento}
                </Badge>
              </div>
               {article.detalhes_erro && (
                 <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium">Detalhes do Erro (processamento): </span>
                    <span className="text-red-400">{article.detalhes_erro}</span>
                 </div>
                )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ScientificArticleDetailView;
