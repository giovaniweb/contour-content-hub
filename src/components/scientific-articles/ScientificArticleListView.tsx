import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, MessageSquare, Clock, User } from 'lucide-react';
import { UnifiedDocument } from '@/types/document';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScientificArticleListViewProps {
  articles: UnifiedDocument[];
  onView: (article: UnifiedDocument) => void;
  formatDate: (dateString: string) => string;
}

const ScientificArticleListView: React.FC<ScientificArticleListViewProps> = ({
  articles,
  onView,
  formatDate
}) => {
  const handleDownload = (article: UnifiedDocument) => {
    if (article.file_path) {
      const fullFileUrl = `https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/documents/${article.file_path}`;
      window.open(fullFileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="aurora-card-enhanced hover:border-aurora-cyan/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold aurora-text-gradient-enhanced text-lg mb-2 line-clamp-2">
                      {article.titulo_extraido || 'Título não disponível'}
                    </h3>
                    {article.texto_completo && (
                      <p className="text-sm text-slate-300 line-clamp-2 mb-3">
                        {article.texto_completo.substring(0, 200)}...
                      </p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
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

                {/* Metadata Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(article.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </div>
                    
                    {article.equipamento_nome && (
                      <div className="flex items-center gap-1 text-aurora-cyan">
                        📱 {article.equipamento_nome}
                      </div>
                    )}

                    {article.autores && article.autores.length > 0 && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.autores.slice(0, 2).join(', ')}
                        {article.autores.length > 2 && ` +${article.autores.length - 2}`}
                      </div>
                    )}
                  </div>

                  {/* Keywords */}
                  {article.palavras_chave && article.palavras_chave.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                          {keyword}
                        </Badge>
                      ))}
                      {article.palavras_chave.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                          +{article.palavras_chave.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onView(article)}
                  size="sm"
                  variant="outline"
                  className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDownload(article)}
                  size="sm"
                  variant="outline"
                  className="border-aurora-emerald text-aurora-emerald hover:bg-aurora-emerald/10"
                  disabled={!article.file_path}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onView(article)}
                  size="sm"
                  variant="outline"
                  className="border-aurora-electric-purple text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScientificArticleListView;