
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const handleExtractContent = () => {
    // Instead of trying to find a DOM element on the document object,
    // we need to use the global document object to query the DOM
    const extractButton = window.document.querySelector('button:has(.h-4.w-4:has(path[d*="M14 3v4a1 1"]))');
    if (extractButton instanceof HTMLButtonElement) {
      extractButton.click();
    } else {
      toast("Botão não encontrado", {
        description: "Não foi possível iniciar a extração de conteúdo automaticamente."
      });
    }
  };

  const handleViewOriginalPdf = () => {
    if (document.link_dropbox) {
      setPdfViewerOpen(true);
    } else {
      toast("Arquivo não disponível", {
        description: "O documento original não está disponível para visualização."
      });
    }
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-250px)] min-h-[500px] w-full rounded-md border p-6">
        {document.conteudo_extraido ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleViewOriginalPdf}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver PDF Original
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
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center py-4">
              Este documento ainda não tem conteúdo extraído.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em "Extrair Conteúdo" para processar o documento.
            </p>
            <Button 
              variant="default" 
              onClick={handleExtractContent}
            >
              Extrair Conteúdo
            </Button>
          </div>
        )}
      </ScrollArea>

      {/* Modal para visualização do PDF */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {document.link_dropbox && (
            <div className="w-full h-[80vh]">
              <iframe
                src={document.link_dropbox.startsWith('http') ? document.link_dropbox : `https://${document.link_dropbox}`}
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
