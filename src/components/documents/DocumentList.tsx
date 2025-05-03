
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TechnicalDocument } from '@/types/document';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Eye, FilePlus, GraduationCap, File } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DocumentListProps {
  documents: TechnicalDocument[];
  isLoading?: boolean;
  onRefresh: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  isLoading = false,
  onRefresh
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'Data desconhecida';
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'artigo_cientifico': 
        return <GraduationCap className="h-6 w-6" />;
      case 'ficha_tecnica': 
        return <FileText className="h-6 w-6" />;
      case 'protocolo': 
        return <FilePlus className="h-6 w-6" />;
      default: 
        return <File className="h-6 w-6" />;
    }
  };
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'artigo_cientifico': return 'Artigo Científico';
      case 'ficha_tecnica': return 'Ficha Técnica';
      case 'protocolo': return 'Protocolo';
      default: return 'Outro';
    }
  };
  
  const getLanguageLabel = (code: string) => {
    switch(code) {
      case 'pt': return 'Português';
      case 'en': return 'Inglês';
      case 'es': return 'Espanhol';
      default: return code;
    }
  };
  
  const handleViewDocument = (id: string) => {
    navigate(`/documents/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Não há documentos disponíveis com os filtros selecionados.
        </p>
        <Button onClick={onRefresh} variant="outline">
          Atualizar
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {documents.map(doc => (
        <Card key={doc.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-muted p-4 flex items-center justify-center md:w-16">
                {getDocumentIcon(doc.tipo)}
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{doc.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {doc.descricao || 'Sem descrição'}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={() => handleViewDocument(doc.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> Visualizar
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    {getDocumentTypeLabel(doc.tipo)}
                  </Badge>
                  
                  {doc.equipamento_nome && (
                    <Badge variant="outline">
                      Equip: {doc.equipamento_nome}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="flex items-center">
                    Idioma: {getLanguageLabel(doc.idioma_original)}
                  </Badge>
                  
                  {doc.status === 'processando' && (
                    <Badge variant="secondary" className="bg-amber-500">
                      Processando
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                  <span className="mr-2">Adicionado {formatDate(doc.data_criacao)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
