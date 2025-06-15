import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDocuments } from '@/hooks/use-documents';
import { TechnicalDocument } from '@/types/document';
import { toast } from 'sonner';

import DocumentHeader from '@/components/documents/DocumentHeader';
import DocumentTabs from '@/components/documents/DocumentTabs';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentPreviewModal from '@/components/documents/DocumentPreviewModal';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocumentById } = useDocuments();
  const [document, setDocument] = useState<TechnicalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [addingContent, setAddingContent] = useState(false);
  const [contentProcessed, setContentProcessed] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  
  // Load document on mount
  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const doc = await getDocumentById(id);
        
        if (!doc) {
          setError('Documento não encontrado');
          return;
        }
        
        setDocument(doc);
        setError(null);

        // Only attempt content extraction if we haven't done it yet
        if (!doc.conteudo_extraido && !contentProcessed) {
          extractContent(doc);
        }
      } catch (err: any) {
        console.error('Error loading document:', err);
        setError(err.message || 'Erro ao carregar documento');
        toast("Erro ao carregar documento");
      } finally {
        setLoading(false);
      }
    };
    
    loadDocument();
  }, [id, getDocumentById, contentProcessed]);

  const extractContent = async (doc: TechnicalDocument) => {
    if (addingContent) return;
    
    try {
      setAddingContent(true);
      toast("Processando documento");
      
      // Try to extract content via the edge function first
      let success = false;
      if (doc.id) {
        try {
          const { error } = await supabase.functions.invoke('process-document', {
            body: { documentId: doc.id }
          });
          
          if (!error) {
            // Refresh document to get updated content
            const updatedDoc = await getDocumentById(doc.id);
            if (updatedDoc) {
              setDocument(updatedDoc);
              success = true;
              toast("Documento processado com sucesso");
            }
          }
        } catch (err) {
          console.error('Error invoking process-document function:', err);
        }
      }
      
      // If edge function failed or no content was extracted, add sample content
      if (!success) {
        const dummyContent = `# ${doc.titulo}

## Resumo
${doc.descricao || 'Este documento não possui um resumo.'}

## Conteúdo
Este documento contém informações importantes que podem ser visualizadas no PDF original.
Para uma melhor experiência com formatações e imagens, utilize a opção "Ver PDF Original".

## Palavras-chave
${doc.keywords?.join(', ') || 'Nenhuma palavra-chave disponível.'}

## Autores
${doc.researchers?.join(', ') || 'Nenhum autor disponível.'}
`;

        // Update the document with sample content directly in the database
        const { error } = await supabase
          .from('documentos_tecnicos')
          .update({ conteudo_extraido: dummyContent })
          .eq('id', doc.id);
          
        if (error) {
          console.error('Error adding sample content:', error);
          throw error;
        }
        
        // Update the document in the state
        setDocument({
          ...doc,
          conteudo_extraido: dummyContent
        });
        
        toast("Conteúdo adicionado");
      }

      // Mark content as processed to prevent infinite loop
      setContentProcessed(true);
    } catch (err: any) {
      console.error('Error adding content:', err);
      toast("Erro ao adicionar conteúdo");
    } finally {
      setAddingContent(false);
    }
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container py-12 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  if (error || !document) {
    return (
      <AppLayout>
        <div className="container py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error || "Documento não encontrado"}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/documents')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Documentos
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <Helmet>
        <title>{document.titulo} | Documentos Técnicos</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 order-2 lg:order-1">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <DocumentHeader
                  document={document}
                  addingContent={addingContent}
                  onExtractContent={() => extractContent(document)}
                />
              </CardHeader>
              <CardContent>
                <DocumentTabs 
                  document={document} 
                  activeTab={activeTab} 
                  onChangeTab={setActiveTab}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-80 order-1 lg:order-2">
            <DocumentActions 
              document={document}
              onDocumentUpdate={(updatedDoc) => setDocument(updatedDoc)}
            />
          </div>
        </div>
      </div>
      
      {/* Document preview modal */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        document={document}
      />
    </AppLayout>
  );
};

export default DocumentDetailPage;
