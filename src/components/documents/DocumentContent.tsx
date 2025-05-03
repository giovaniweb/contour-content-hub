
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DocumentToolbar from './DocumentToolbar';
import DocumentMarkdown from './DocumentMarkdown';
import ExtractingMessage from './ExtractingMessage';
import PdfViewer from './PdfViewer';

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
          
          // Abrir em uma nova aba para download
          window.open(url, '_blank');
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

  return (
    <>
      <ScrollArea className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-md border p-6">
        {document.conteudo_extraido ? (
          <div className="space-y-4">
            <DocumentToolbar
              onViewOriginal={handleViewOriginalPdf}
              onDownloadPdf={handleDownloadPdf}
              onExtractContent={handleExtractContent}
              extracting={extracting}
              hasContent={!!document.conteudo_extraido}
            />
            
            <DocumentMarkdown content={document.conteudo_extraido} />
          </div>
        ) : (
          <ExtractingMessage 
            onExtractContent={handleExtractContent}
            extracting={extracting}
            progress={extractionProgress}
          />
        )}
      </ScrollArea>

      <PdfViewer 
        isOpen={pdfViewerOpen}
        onOpenChange={setPdfViewerOpen}
        title={document.titulo}
        pdfUrl={document.link_dropbox}
      />
    </>
  );
};

export default DocumentContent;
