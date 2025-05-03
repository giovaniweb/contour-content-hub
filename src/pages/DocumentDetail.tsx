
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft, 
  FileText, 
  FileQuestion, 
  Languages, 
  MessageSquare,
  Lightbulb,
  ExternalLink,
  Loader2,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDocuments } from '@/hooks/use-documents';
import { TechnicalDocument } from '@/types/document';

import DocumentContent from '@/components/documents/DocumentContent';
import DocumentActions from '@/components/documents/DocumentActions';
import DocumentQuestions from '@/components/documents/DocumentQuestions';

const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getDocumentById } = useDocuments();
  const [document, setDocument] = useState<TechnicalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [addingContent, setAddingContent] = useState(false);
  
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

        // If the document has no content, extract it automatically
        if (!doc.conteudo_extraido) {
          extractContent(doc);
        }
      } catch (err: any) {
        console.error('Error loading document:', err);
        setError(err.message || 'Erro ao carregar documento');
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o documento"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDocument();
  }, [id, getDocumentById, toast]);

  const extractContent = async (doc: TechnicalDocument) => {
    if (addingContent) return;
    
    try {
      setAddingContent(true);
      toast({
        title: "Processando documento",
        description: "Extraindo conteúdo do documento..."
      });
      
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
              toast({
                title: "Documento processado",
                description: "O conteúdo do documento foi extraído com sucesso."
              });
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
Este é um conteúdo de exemplo para demonstrar como o documento seria exibido.
O conteúdo real deve ser extraído do arquivo PDF ou fornecido durante o upload.

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
        
        toast({
          title: "Conteúdo adicionado",
          description: "Um conteúdo de exemplo foi adicionado ao documento."
        });
      }
    } catch (err: any) {
      console.error('Error adding content:', err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar conteúdo ao documento."
      });
    } finally {
      setAddingContent(false);
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
  
  const handleOpenOriginal = () => {
    if (document?.link_dropbox) {
      window.open(document.link_dropbox, '_blank');
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container py-12 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (error || !document) {
    return (
      <Layout>
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
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{document.titulo} | Documentos Técnicos</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/documents')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Documentos
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 order-2 lg:order-1">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{document.titulo}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleOpenOriginal}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver Original
                    </Button>
                    
                    {!document.conteudo_extraido && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => extractContent(document)}
                        disabled={addingContent}
                      >
                        {addingContent ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Extrair Conteúdo
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {document.descricao || 'Sem descrição disponível'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    {getDocumentTypeLabel(document.tipo)}
                  </Badge>
                  
                  {document.idioma_original && (
                    <Badge variant="outline">
                      {getLanguageLabel(document.idioma_original)}
                    </Badge>
                  )}
                  
                  {document.equipamento_nome && (
                    <Badge variant="outline">
                      Equip: {document.equipamento_nome}
                    </Badge>
                  )}
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="content" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Conteúdo</span>
                    </TabsTrigger>
                    <TabsTrigger value="translations" className="flex items-center">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Traduções</span>
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Perguntas</span>
                    </TabsTrigger>
                    <TabsTrigger value="content-ideas" className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      <span>Ideias</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <DocumentContent document={document} />
                  </TabsContent>
                  
                  <TabsContent value="translations">
                    <div className="p-6 text-center">
                      <Languages className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Traduções</h3>
                      <p className="text-muted-foreground mb-6">
                        Use a barra lateral para traduzir este documento para outros idiomas.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="questions">
                    <DocumentQuestions document={document} />
                  </TabsContent>
                  
                  <TabsContent value="content-ideas">
                    <div className="p-6 text-center">
                      <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Ideias de Conteúdo</h3>
                      <p className="text-muted-foreground mb-6">
                        Use a barra lateral para gerar ideias de conteúdo a partir deste documento.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
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
    </Layout>
  );
};

export default DocumentDetailPage;
