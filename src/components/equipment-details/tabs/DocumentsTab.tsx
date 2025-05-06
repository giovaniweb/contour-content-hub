
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TechnicalDocument } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export const DocumentsTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('documentos_tecnicos')
          .select('*')
          .eq('equipamento_id', id)
          .eq('status', 'ativo');
          
        if (error) {
          throw error;
        }
        
        setDocuments(data as TechnicalDocument[]);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar os documentos associados a este equipamento."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [id, toast]);

  const handleDownload = (document: TechnicalDocument) => {
    if (document.link_dropbox) {
      window.open(document.link_dropbox, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Sem documentos</h3>
        <p className="text-muted-foreground mt-2">
          Não há documentos disponíveis para este equipamento.
        </p>
        <Button className="mt-4" asChild>
          <a href="/documents/upload">Adicionar Documento</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-4">Documentos Técnicos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="overflow-hidden h-full">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <h4 className="font-medium truncate">{document.titulo}</h4>
              </div>
              {document.descricao && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {document.descricao}
                </p>
              )}
              <div className="flex items-center mt-2 text-xs">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
                  {document.tipo === 'artigo_cientifico' 
                    ? 'Artigo Científico' 
                    : document.tipo === 'ficha_tecnica' 
                    ? 'Ficha Técnica' 
                    : document.tipo === 'protocolo'
                    ? 'Protocolo'
                    : 'Documento'}
                </span>
                {document.idioma_original && (
                  <span className="ml-2 bg-gray-100 text-gray-800 rounded-full px-2 py-1">
                    {document.idioma_original === 'pt' 
                      ? 'Português' 
                      : document.idioma_original === 'en' 
                      ? 'Inglês' 
                      : document.idioma_original === 'es'
                      ? 'Espanhol'
                      : document.idioma_original}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => handleDownload(document)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
