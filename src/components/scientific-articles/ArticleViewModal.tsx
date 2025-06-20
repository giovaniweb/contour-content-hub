// Caminho sugerido: ./src/components/documents/ArticleViewModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, MessageSquare, FileText, X } from "lucide-react";
import { TechnicalDocument } from '@/types/document';
import DocumentQuestionChat from '@/components/documents/DocumentQuestionChat';
import EnhancedPDFViewer from './EnhancedPDFViewer';
import ArticleChatInterface from './ArticleChatInterface';

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: TechnicalDocument | null;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  document
}) => {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const effectivePdfUrl = document?.arquivo_url || document?.link_dropbox;

  const handleDownload = () => {
    if (effectivePdfUrl) window.open(effectivePdfUrl, '_blank');
  };

  const handleOpenInNewTab = () => {
    if (effectivePdfUrl) window.open(effectivePdfUrl, '_blank');
  };

  const handleCloseModal = () => {
    setShowPDFViewer(false);
    setShowChat(false);
    onOpenChange(false);
  };

  const handleCloseChatOnly = () => setShowChat(false);

  useEffect(() => {
    if (!isOpen) {
      setShowPDFViewer(false);
      setShowChat(false);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] aurora-glass border-aurora-electric-purple/30 flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="aurora-heading text-xl line-clamp-1">
                {document?.titulo || 'Visualizador de Artigo'}
              </DialogTitle>
              {(showChat || showPDFViewer) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowChat(false);
                    setShowPDFViewer(false);
                  }}
                  className="ml-auto"
                >
                  Voltar
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {!showChat && !showPDFViewer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aurora-card-enhanced p-6 border border-aurora-electric-purple/20 bg-aurora-deep-purple/10">
                  <h3 className="text-slate-200 text-lg mb-2">Visualizar PDF</h3>
                  <Button onClick={() => setShowPDFViewer(true)} disabled={!effectivePdfUrl}>
                    <FileText className="h-4 w-4 mr-2" />
                    Abrir Visualizador
                  </Button>
                </div>
                <div className="aurora-card-enhanced p-6 border border-aurora-neon-blue/20 bg-aurora-deep-purple/10">
                  <h3 className="text-slate-200 text-lg mb-2">Fazer Pergunta</h3>
                  <Button
                    onClick={() => setShowChat(true)}
                    disabled={!document}
                    className="bg-aurora-neon-blue hover:bg-aurora-neon-blue/80"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                </div>
              </div>
            )}

            {showChat && document && (
              <ArticleChatInterface
                documentId={document.id}
                documentTitle={document.titulo}
                isOpen={showChat}
                onClose={handleCloseChatOnly}
              />
            )}

            {showPDFViewer && effectivePdfUrl && (
              <EnhancedPDFViewer
                isOpen={showPDFViewer}
                onOpenChange={setShowPDFViewer}
                pdfUrl={effectivePdfUrl}
                title={document?.titulo || ''}
                documentId={document?.id || ''}
              />
            )}
          </div>

          {!showChat && !showPDFViewer && (
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-aurora-electric-purple/20">
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                className="text-aurora-emerald hover:bg-aurora-emerald/10"
                size="sm"
                disabled={!effectivePdfUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="text-aurora-electric-purple hover:bg-aurora-electric-purple/10"
                size="sm"
                disabled={!effectivePdfUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleViewModal;