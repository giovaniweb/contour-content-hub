import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';
import { EquipmentDocument } from '@/hooks/useEquipmentContent';

interface EquipmentDocumentsProps {
  documents: EquipmentDocument[];
  loading: boolean;
}

export const EquipmentDocuments: React.FC<EquipmentDocumentsProps> = ({ documents, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="aurora-glass border-aurora-emerald/30 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="aurora-glass border-aurora-emerald/30 aurora-glow-emerald">
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-white/60 mx-auto mb-4" />
          <h3 className="aurora-heading text-xl text-white mb-2">Nenhum artigo encontrado</h3>
          <p className="aurora-body text-white/70">
            Ainda não há artigos científicos cadastrados para este equipamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="aurora-glass border-aurora-emerald/30 aurora-glow-emerald hover:border-aurora-emerald/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="aurora-heading text-lg text-white mb-2">
                  {doc.titulo_extraido}
                </h3>
                
                {doc.autores && doc.autores.length > 0 && (
                  <p className="aurora-body text-white/80 mb-3">
                    <strong>Autores:</strong> {doc.autores.join(', ')}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                  <Calendar className="h-4 w-4" />
                  {new Date(doc.data_upload).toLocaleDateString('pt-BR')}
                </div>

                {doc.palavras_chave && doc.palavras_chave.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.palavras_chave.slice(0, 3).map((keyword, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="border-aurora-emerald/30 text-aurora-emerald bg-aurora-emerald/10 text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                    {doc.palavras_chave.length > 3 && (
                      <Badge 
                        variant="outline" 
                        className="border-aurora-emerald/30 text-aurora-emerald bg-aurora-emerald/10 text-xs"
                      >
                        +{doc.palavras_chave.length - 3} mais
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {doc.file_path && (
                <Button
                  size="sm"
                  className="aurora-button aurora-glow hover:aurora-glow-intense ml-4"
                  onClick={() => window.open(doc.file_path, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              )}
            </div>

            <Badge 
              variant="outline" 
              className="border-aurora-emerald/30 text-aurora-emerald bg-aurora-emerald/10"
            >
              {doc.tipo_documento}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};