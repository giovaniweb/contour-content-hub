
import React from 'react';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, MessageSquare } from "lucide-react";
import { TechnicalDocument } from '@/types/document'; // Adicionar importação
import DocumentQuestionChat from '@/components/documents/DocumentQuestionChat'; // Adicionar importação

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: TechnicalDocument | null; // MODIFICADO: Passar o objeto document completo
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  document
}) => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const effectivePdfUrl = document?.arquivo_url || document?.link_dropbox;

  const handleDownload = () => {
    if (effectivePdfUrl) {
      window.open(effectivePdfUrl, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    if (effectivePdfUrl) {
      window.open(effectivePdfUrl, '_blank');
    }
  };

  // Reset chat state when modal is closed or document changes
  React.useEffect(() => {
    if (!isOpen) {
      setIsChatOpen(false);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] aurora-glass border-aurora-electric-purple/30 flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="aurora-heading text-xl line-clamp-1">
              {document?.titulo || 'Visualizador de Artigo'}
            </DialogTitle>
            {isChatOpen && document && ( // Show back button only if chat is open and document exists
              <Button variant="outline" size="sm" onClick={() => setIsChatOpen(false)} className="ml-auto">
                Voltar ao PDF
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 flex-1 overflow-y-auto">
          {/* Action buttons - only show if not in chat mode or if document exists */}
          {document && !isChatOpen && (
            <div className="flex items-center gap-3 pb-4 border-b border-aurora-electric-purple/20">
              <Button
                onClick={handleOpenInNewTab}
                className="aurora-button flex items-center gap-2"
                size="sm"
                disabled={!effectivePdfUrl}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir em Nova Aba
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20 flex items-center gap-2"
                size="sm"
                disabled={!effectivePdfUrl}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20 flex items-center gap-2"
                size="sm"
                onClick={() => setIsChatOpen(true)}
                disabled={!document} // Document must exist to ask questions
              >
                <MessageSquare className="h-4 w-4" />
                Fazer Pergunta
              </Button>
            </div>
          )}
          
          {/* Conteúdo Principal: PDF ou Chat */}
          {document && isChatOpen ? (
            <DocumentQuestionChat
              document={document}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)} // Though chat might not need this if parent controls visibility
            />
          ) : effectivePdfUrl ? (
            <div className="flex-1 min-h-[600px] rounded-lg overflow-hidden aurora-glass">
              <iframe
                src={`${effectivePdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full min-h-[600px] rounded-lg" // Ensure h-full and min-h
                title={document?.titulo}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-[600px] flex items-center justify-center aurora-glass rounded-lg">
              <p className="text-slate-400">{document ? 'PDF não disponível para visualização.' : 'Nenhum documento selecionado.'}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
