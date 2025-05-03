
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DocumentToolbar from './DocumentToolbar';
import DocumentMarkdown from './DocumentMarkdown';
import ExtractingMessage from './ExtractingMessage';
import DocumentPreviewModal from './DocumentPreviewModal';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
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
    try {
      console.log("Abrindo visualizador de PDF:", {
        link_dropbox: document.link_dropbox,
        preview_url: document.preview_url,
        id: document.id,
        titulo: document.titulo
      });
      
      // Verificar se temos alguma URL antes de abrir a pré-visualização
      if (!document.link_dropbox && !document.preview_url) {
        toast("Arquivo não disponível", {
          description: "O documento original não está disponível para visualização."
        });
        return;
      }
      
      // Abrir a modal de pré-visualização de PDF
      setPdfPreviewOpen(true);
    } catch (error) {
      console.error("Erro ao abrir visualizador:", error);
      toast("Erro ao abrir visualizador", {
        description: "Ocorreu um erro ao tentar abrir o visualizador de PDF."
      });
    }
  };
  
  const handleDownloadPdf = () => {
    try {
      console.log("Tentando baixar PDF:", {
        link_dropbox: document.link_dropbox,
        preview_url: document.preview_url,
        id: document.id,
      });
      
      // Verificar se temos alguma URL válida
      if (!document?.link_dropbox && !document?.preview_url) {
        toast("Arquivo não disponível", {
          description: "O documento original não está disponível para download."
        });
        return;
      }

      // Selecionar a URL disponível
      let url = document.link_dropbox || document.preview_url || '';
      
      // Processar URL com base no tipo
      if (url.startsWith('blob:')) {
        // Para URLs blob, abrir diretamente
        window.open(url, '_blank', 'noopener,noreferrer');
        toast("Abrindo documento", {
          description: "O documento está sendo aberto em uma nova aba."
        });
        return;
      } 
      
      // Processar URL do Dropbox para download direto
      if (url.includes('dropbox.com') && !url.includes('dl=1')) {
        url = url.includes('?') ? `${url}&dl=1` : `${url}?dl=1`;
        console.log("URL de download Dropbox processada:", url);
      }
      
      // Processar URL do Google Drive
      if (url.includes('drive.google.com') && url.includes('/view')) {
        url = url.replace('/view', '/preview');
        console.log("URL de download Google Drive processada:", url);
      }
      
      // Para URLs externas, garantir que comecem com http ou https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Usar método moderno para abrir em nova aba, evitando manipulação direta do DOM
      window.open(url, '_blank', 'noopener,noreferrer');
      
      toast("Download iniciado", {
        description: "O PDF está sendo baixado ou aberto em nova aba"
      });
    } catch (error) {
      console.error("Erro no download:", error);
      toast("Erro no download", {
        description: "Não foi possível baixar o documento"
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

      <DocumentPreviewModal 
        isOpen={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        document={document}
      />
    </>
  );
};

export default DocumentContent;
