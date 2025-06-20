
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, MessageSquare, FileText, X } from "lucide-react";
import EnhancedPDFViewer from './EnhancedPDFViewer';
import ArticleChatInterface from './ArticleChatInterface';

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl?: string;
  documentId?: string;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  pdfUrl,
  documentId
}) => {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleViewPDF = () => {
    setShowPDFViewer(true);
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] aurora-glass-enhanced border-aurora-electric-purple/30 backdrop-blur-xl bg-aurora-void-black/80">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="aurora-text-gradient-enhanced text-xl flex-1 mr-4">
                {title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-slate-400 hover:text-slate-200 hover:bg-aurora-electric-purple/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col space-y-6">
            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PDF Viewer Card */}
              <div className="aurora-card-enhanced p-6 border border-aurora-electric-purple/20 bg-aurora-deep-purple/10 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="aurora-glow-enhanced">
                    <div className="w-16 h-16 rounded-full aurora-glass-enhanced border border-aurora-electric-purple/30 flex items-center justify-center bg-aurora-deep-purple/30">
                      <FileText className="h-8 w-8 text-aurora-electric-purple" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-2">Visualizar PDF</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Visualize o documento completo com controles avançados de zoom e navegação
                    </p>
                    <Button 
                      onClick={handleViewPDF}
                      className="aurora-button-enhanced w-full"
                      disabled={!pdfUrl}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Abrir Visualizador
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Interface Card */}
              <div className="aurora-card-enhanced p-6 border border-aurora-neon-blue/20 bg-aurora-deep-purple/10 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="aurora-glow-enhanced">
                    <div className="w-16 h-16 rounded-full aurora-glass-enhanced border border-aurora-neon-blue/30 flex items-center justify-center bg-aurora-deep-purple/30">
                      <MessageSquare className="h-8 w-8 text-aurora-neon-blue" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-2">Fazer Perguntas</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Converse com IA especializada para entender melhor o conteúdo do artigo
                    </p>
                    <Button 
                      onClick={handleStartChat}
                      className="aurora-button-enhanced w-full bg-gradient-to-r from-aurora-neon-blue to-aurora-emerald hover:from-aurora-neon-blue/80 hover:to-aurora-emerald/80"
                      disabled={!documentId}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Iniciar Conversa
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            {showChat && documentId && (
              <div className="animate-fade-in">
                <ArticleChatInterface
                  documentId={documentId}
                  documentTitle={title}
                  isOpen={showChat}
                  onClose={() => setShowChat(false)}
                />
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-aurora-electric-purple/20">
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                className="aurora-glass-enhanced border-aurora-emerald/30 text-aurora-emerald hover:bg-aurora-emerald/20 transition-all duration-300"
                size="sm"
                disabled={!pdfUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir em Nova Aba
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="aurora-glass-enhanced border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20 transition-all duration-300"
                size="sm"
                disabled={!pdfUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced PDF Viewer Modal */}
      <EnhancedPDFViewer
        isOpen={showPDFViewer}
        onOpenChange={setShowPDFViewer}
        pdfUrl={pdfUrl}
        title={title}
        documentId={documentId}
      />
    </>
  );
};

export default ArticleViewModal;
