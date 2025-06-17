
import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Maximize2, ZoomIn, ZoomOut, RotateCw, MessageSquare, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { processPdfUrl, openPdfInNewTab, downloadPdf } from '@/utils/pdfUtils';
import { useToast } from '@/hooks/use-toast';
import ArticleQuestionPanel from './ArticleQuestionPanel';

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
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('view');
  const { toast } = useToast();
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [iframeError, setIframeError] = useState<boolean>(false);
  
  const { processedUrl } = processPdfUrl(pdfUrl || '');

  useEffect(() => {
    if (isOpen && processedUrl) {
      setIsIframeLoading(true);
      setIframeError(false);
    }
  }, [processedUrl, isOpen]);

  const handleIframeLoad = () => {
    setIsIframeLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsIframeLoading(false);
    setIframeError(true);
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      await downloadPdf(pdfUrl, `${title}.pdf`);
      toast({
        title: 'Download iniciado',
        description: 'O arquivo PDF está sendo baixado.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no download',
        description: 'Não foi possível baixar o arquivo.'
      });
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      openPdfInNewTab(pdfUrl);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] bg-slate-900/95 backdrop-blur-sm border-cyan-500/20 rounded-2xl">
        <DialogHeader className="space-y-4 pb-4 border-b border-cyan-500/20">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-xl font-semibold text-slate-100 pr-8">
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  PDF
                </Badge>
                {documentId && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    IA Disponível
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-300 min-w-[50px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
                className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Nova Aba
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-1">
            <TabsTrigger 
              value="view" 
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400 rounded-lg"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Visualizar PDF
            </TabsTrigger>
            {documentId && (
              <TabsTrigger 
                value="questions" 
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-slate-400 rounded-lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Fazer Perguntas
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="view" className="flex-1 mt-4">
            {processedUrl ? (
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-800/30 border border-cyan-500/20 relative">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                    <p className="text-slate-300">Carregando PDF...</p>
                  </div>
                )}
                {iframeError && !isIframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-800/50">
                    <XCircle className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-200 mb-2">
                      Erro ao Carregar PDF
                    </h3>
                    <p className="text-sm text-slate-400">
                      Não foi possível exibir o documento. O arquivo pode não existir, não ser um PDF válido, ou o link pode estar incorreto.
                    </p>
                    <Button variant="outline" className="mt-4 bg-slate-700 hover:bg-slate-600 text-slate-200" onClick={handleDownload}>
                      Tentar baixar
                    </Button>
                  </div>
                )}
                <iframe
                  src={processedUrl}
                  className="w-full h-full"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    display: isIframeLoading || iframeError ? 'none' : 'block'
                  }}
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-800/30 rounded-xl border border-cyan-500/20">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                    <X className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-300 mb-2">
                      PDF não disponível
                    </h3>
                    <p className="text-sm text-slate-500">
                      Não foi possível carregar o arquivo PDF
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {documentId && (
            <TabsContent value="questions" className="flex-1 mt-4">
              <div className="h-full bg-slate-800/30 rounded-xl border border-cyan-500/20 p-6">
                <ArticleQuestionPanel
                  documentId={documentId}
                  articleTitle={title}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
