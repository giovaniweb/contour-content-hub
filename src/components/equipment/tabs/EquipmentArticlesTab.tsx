import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, ExternalLink, Search, Calendar, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EquipmentArticlesTabProps {
  equipmentId: string;
  equipmentName: string;
}

interface UnifiedDocument {
  id: string;
  titulo_extraido: string;
  autores?: string[];
  keywords?: string[];
  texto_completo?: string;
  file_path?: string;
  data_upload: string;
  status_processamento: string;
  tipo_documento: string;
}

export const EquipmentArticlesTab: React.FC<EquipmentArticlesTabProps> = ({ 
  equipmentId, 
  equipmentName 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['equipment-articles', equipmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_documents')
        .select('*')
        .eq('equipamento_id', equipmentId)
        .eq('tipo_documento', 'artigo_cientifico')
        .order('data_upload', { ascending: false });

      if (error) throw error;
      return data as UnifiedDocument[];
    },
  });

  const filteredArticles = articles?.filter(article =>
    article.titulo_extraido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.autores?.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDownload = (filePath: string) => {
    if (filePath) {
      window.open(filePath, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando artigos científicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar artigos científicos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Artigos Científicos</h2>
          <p className="text-muted-foreground">
            {filteredArticles.length} artigo(s) relacionado(s) ao {equipmentName}
          </p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-[300px]"
          />
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? 'Nenhum artigo corresponde aos critérios de busca' 
                : `Ainda não há artigos científicos relacionados ao ${equipmentName}`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {article.titulo_extraido}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.data_upload).toLocaleDateString()}
                        </div>
                        {article.autores && article.autores.length > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.autores.slice(0, 2).join(', ')}
                            {article.autores.length > 2 && ' et al.'}
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    {article.file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(article.file_path!)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {article.keywords && article.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.keywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {article.keywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.keywords.length - 5} mais
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {article.texto_completo && (
                    <ScrollArea className="h-20">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.texto_completo.substring(0, 300)}
                        {article.texto_completo.length > 300 && '...'}
                      </p>
                    </ScrollArea>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge 
                      variant={article.status_processamento === 'concluido' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {article.status_processamento === 'concluido' ? 'Processado' : 'Processando'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};