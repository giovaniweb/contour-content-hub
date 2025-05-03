
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DocumentContentProps {
  document: TechnicalDocument;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  const handleExtractContent = () => {
    // Find the extract button in the document header
    const extractButton = document.querySelector('button:has(.h-4.w-4:nth-child(1))[disabled="false"]');
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
            <div className="text-center max-w-md">
              <h3 className="text-lg font-medium mb-4">Sem conteúdo extraído</h3>
              <p className="text-muted-foreground mb-6">
                Este documento ainda não tem conteúdo extraído. 
                Clique no botão abaixo para processar o conteúdo.
              </p>
              <Button 
                variant="default" 
                onClick={handleExtractContent}
              >
                Extrair Conteúdo
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
