
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  MessageCircle, 
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { TechnicalDocument } from '@/types/document';

interface DocumentCardProps {
  document: TechnicalDocument;
  onView: (document: TechnicalDocument) => void;
  onQuestion: (document: TechnicalDocument) => void;
  onDownload: (document: TechnicalDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onQuestion, 
  onDownload 
}) => {
  const getTypeLabel = (type: string) => {
    const types = {
      'artigo_cientifico': 'Artigo Científico',
      'ficha_tecnica': 'Ficha Técnica',
      'protocolo': 'Protocolo',
      'outro': 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'processando': return 'bg-yellow-100 text-yellow-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {document.titulo}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(document.tipo)}
              </Badge>
              {document.status && (
                <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                  {document.status}
                </Badge>
              )}
            </div>
          </div>
          <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {document.descricao && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {document.descricao}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-500">
          {document.data_criacao && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(document.data_criacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          
          {document.equipamento_nome && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{document.equipamento_nome}</span>
            </div>
          )}

          {document.researchers && document.researchers.length > 0 && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="line-clamp-1">
                {document.researchers.slice(0, 2).join(', ')}
                {document.researchers.length > 2 && ` +${document.researchers.length - 2}`}
              </span>
            </div>
          )}
        </div>

        {/* Keywords */}
        {document.keywords && document.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {document.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{document.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(document)}
            className="flex items-center gap-1 flex-1"
          >
            <Eye className="h-3 w-3" />
            Ver PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuestion(document)}
            className="flex items-center gap-1 flex-1"
          >
            <MessageCircle className="h-3 w-3" />
            Perguntar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document)}
            className="flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
