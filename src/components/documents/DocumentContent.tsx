
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Eye, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState<string | null>(null);

  const handleExtractContent = async () => {
    try {
      setExtracting(true);
      setExtractionProgress("Iniciando processamento do documento...");
      toast("Processando documento", {
        description: "Extraindo conteúdo do documento..."
      });
      
      if (document?.id) {
        setExtractionProgress("Enviando requisição para o servidor...");
        
        // Chamar a edge function com o ID do documento
        const { data, error } = await supabase.functions.invoke('process-document', {
          body: { 
            documentId: document.id,
            forceRefresh: true // Adicionar flag para forçar nova extração
          }
        });
        
        if (error) {
          console.error("Erro ao processar documento:", error);
          toast("Erro no processamento", {
            description: `Não foi possível processar o documento: ${error.message || 'Erro desconhecido'}`
          });
          setExtractionProgress(null);
          setExtracting(false);
          return;
        }
        
        console.log("Resposta da função process-document:", data);
        
        if (data && data.success) {
          setExtractionProgress("Processamento concluído com sucesso!");
          toast("Processamento concluído", {
            description: "O documento foi processado com sucesso. A página será atualizada em instantes."
          });
          
          // Recarregar a página após um pequeno atraso para buscar o conteúdo atualizado
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setExtractionProgress(null);
          toast("Resposta inesperada", {
            description: `Recebemos uma resposta inesperada do servidor: ${JSON.stringify(data)}`
          });
        }
      }
    } catch (error: any) {
      console.error("Erro na extração:", error);
      toast("Falha no processamento", {
        description: `Não foi possível extrair o conteúdo: ${error.message || 'Erro desconhecido'}`
      });
      setExtractionProgress(null);
    } finally {
      setExtracting(false);
    }
  };

  const handleViewOriginalPdf = () => {
    if (document.link_dropbox) {
      console.log("Abrindo visualizador de PDF com URL:", document.link_dropbox);
      setPdfViewerOpen(true);
    } else {
      toast("Arquivo não disponível", {
        description: "O documento original não está disponível para visualização."
      });
    }
  };
  
  const handleDownloadPdf = () => {
    if (document.link_dropbox) {
      try {
        // Verifica e corrige o formato da URL
        let url = document.link_dropbox;
        
        // Se for uma URL de blob local, tratar de outra forma
        if (url.startsWith('blob:')) {
          // Abre diretamente em uma nova aba
          window.open(url, '_blank');
        } else {
          // Para URLs externas, garantir que comecem com http ou https
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          
          // Criar um elemento de âncora temporário para download
          const anchor = window.document.createElement('a');
          anchor.href = url;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          anchor.download = document.titulo || 'documento.pdf';
          window.document.body.appendChild(anchor);
          anchor.click();
          window.document.body.removeChild(anchor);
        }
        
        toast("Download iniciado", {
          description: "O PDF está sendo baixado ou aberto em nova aba"
        });
      } catch (error) {
        console.error("Erro no download:", error);
        toast("Erro no download", {
          description: "Não foi possível baixar o documento"
        });
      }
    } else {
      toast("Arquivo não disponível", {
        description: "O documento original não está disponível para download."
      });
    }
  };

  // Função para garantir que a URL do PDF esteja formatada corretamente
  const getPdfUrl = (url: string): string => {
    if (!url) return '';
    
    // Para URLs de blob local
    if (url.startsWith('blob:')) {
      return url;
    }
    
    // Para URLs externas, garantir que comecem com http ou https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    
    return url;
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-md border p-6">
        {document.conteudo_extraido ? (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleViewOriginalPdf}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver PDF Original
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownloadPdf}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Baixar PDF
              </Button>
              
              <Button 
                variant="default" 
                onClick={handleExtractContent}
                disabled={extracting}
                className="flex items-center gap-2"
              >
                {extracting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reprocessando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Reprocessar Conteúdo
                  </>
                )}
              </Button>
            </div>
            
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>
                {document.conteudo_extraido}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-medium mb-4">Sem conteúdo extraído</h3>
              <p className="text-muted-foreground mb-6">
                Este documento ainda não tem conteúdo extraído. 
                Clique no botão abaixo para processar o conteúdo.
              </p>
              <Button 
                variant="default" 
                onClick={handleExtractContent}
                disabled={extracting}
              >
                {extracting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {extractionProgress || "Processando..."}
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Extrair Conteúdo
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Modal para visualização do PDF */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{document.titulo}</DialogTitle>
            <DialogDescription>Visualização do documento original</DialogDescription>
          </DialogHeader>
          {document.link_dropbox && (
            <div className="w-full h-[80vh]">
              <iframe
                src={getPdfUrl(document.link_dropbox)}
                className="w-full h-full"
                title={document.titulo}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentContent;
