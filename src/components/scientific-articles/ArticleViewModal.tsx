
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, MessageSquare, Paperclip, Users, Tag, Info, FileWarning, CheckCircle } from "lucide-react";
import { UnifiedDocument, ProcessingStatusEnum } from '@/types/document'; // Using UnifiedDocument
import DocumentQuestionChat from '@/components/documents/DocumentQuestionChat'; // Assuming this component is compatible or will be adapted
import { supabase } from '@/integrations/supabase/client'; // For generating public URL
import { Badge } from '@/components/ui/badge';

interface ArticleViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: UnifiedDocument | null;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onOpenChange,
  document
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pdfPublicUrl, setPdfPublicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (document?.file_path) {
      const { data } = supabase.storage.from('documents').getPublicUrl(document.file_path);
      setPdfPublicUrl(data?.publicUrl || null);
    } else {
      setPdfPublicUrl(null);
    }
    // Reset chat state when modal is closed or document changes
    if (!isOpen) {
      setIsChatOpen(false);
    }
  }, [document, isOpen]);

  const handleDownload = () => {
    if (pdfPublicUrl) {
      // Forcing download instead of opening in tab for some browsers
      const link = document.createElement('a');
      link.href = pdfPublicUrl;
      link.target = '_blank'; // fallback
      link.download = document?.titulo_extraido || 'documento.pdf'; // Suggest a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfPublicUrl) {
      window.open(pdfPublicUrl, '_blank');
    }
  };

  const renderMetadata = () => {
    if (!document) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
            {document.autores && document.autores.length > 0 && (
                <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-slate-300">Autores:</span>
                        <p className="text-slate-400 break-words">{document.autores.join(', ')}</p>
                    </div>
                </div>
            )}
            {document.palavras_chave && document.palavras_chave.length > 0 && (
                 <div className="flex items-start">
                    <Tag className="h-4 w-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                    <div>
                        <span className="font-semibold text-slate-300">Palavras-chave:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {document.palavras_chave.map(kw => <Badge key={kw} variant="secondary" className="bg-cyan-600/30 text-cyan-300">{kw}</Badge>)}
                        </div>
                    </div>
                </div>
            )}
             {document.equipamento_nome && (
                <div className="flex items-start">
                    <Paperclip className="h-4 w-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-300">Equipamento:</span>
                    <p className="text-slate-400 ml-1">{document.equipamento_nome}</p>
                </div>
            )}
            <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                <span className="font-semibold text-slate-300">Status:</span>
                <p className={`ml-1 ${
                    document.status_processamento === 'concluido' ? 'text-green-400' :
                    document.status_processamento === 'falhou' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                    {document.status_processamento === 'concluido' && <CheckCircle className="inline h-4 w-4 mr-1" />}
                    {document.status_processamento === 'falhou' && <FileWarning className="inline h-4 w-4 mr-1" />}
                    {document.status_processamento?.toUpperCase()}
                </p>
            </div>
            {document.status_processamento === 'falhou' && document.detalhes_erro && (
                 <div className="flex items-start md:col-span-2">
                    <FileWarning className="h-4 w-4 mr-2 mt-0.5 text-red-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-300">Detalhe do Erro:</span>
                    <p className="text-red-400 ml-1">{document.detalhes_erro}</p>
                </div>
            )}
        </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl xl:max-w-6xl h-[90vh] aurora-glass border-aurora-electric-purple/30 flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex justify-between items-start">
            <DialogTitle className="aurora-heading text-xl lg:text-2xl line-clamp-2 text-slate-100">
              {document?.titulo_extraido || 'Visualizador de Documento'}
            </DialogTitle>
            {isChatOpen && document && (
              <Button variant="outline" size="sm" onClick={() => setIsChatOpen(false)} className="ml-auto shrink-0 border-slate-600 hover:bg-slate-700">
                Voltar ao Documento
              </Button>
            )}
          </div>
          {document?.descricao && !isChatOpen && (
            <DialogDescription className="text-sm text-slate-400 line-clamp-2 pt-1">
                {/* This 'descricao' is mapped from texto_completo snippet in useScientificArticles */}
                {document.descricao}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-y-auto p-6 space-y-4">
          {document && !isChatOpen && renderMetadata()}

          {document && isChatOpen ? (
            <div className="flex-1 h-full"> {/* Ensure chat takes available space */}
              <DocumentQuestionChat
                documentId={document.id} // Pass ID for potential server-side context
                documentTitle={document.titulo_extraido || "Documento"}
                // Pass other necessary props to DocumentQuestionChat if needed
                // e.g. documentText={document.texto_completo} if chat is purely client-side with full text
              />
            </div>
          ) : pdfPublicUrl && document?.status_processamento === 'concluido' ? (
            <div className="flex-1 min-h-[500px] lg:min-h-[600px] rounded-lg overflow-hidden border border-slate-700/50">
              <iframe
                src={`${pdfPublicUrl}#view=FitH&toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full"
                title={document?.titulo_extraido || 'PDF Viewer'}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center bg-slate-800/30 rounded-lg border border-slate-700/50 p-8 text-center">
              <FileWarning className="h-16 w-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Visualização Indisponível</h3>
              <p className="text-slate-400">
                {document ?
                    (document.status_processamento === 'falhou' ? 'O processamento deste documento falhou. Verifique os detalhes do erro.' :
                    document.status_processamento === 'processando' ? 'O documento ainda está sendo processado. Tente novamente mais tarde.' :
                    document.status_processamento === 'pendente' ? 'O processamento deste documento está pendente.' :
                    'URL do PDF não encontrada ou documento não concluído.')
                : 'Nenhum documento selecionado.'}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons - only show if document exists */}
        {document && !isChatOpen && (
            <DialogFooter className="p-6 pt-4 border-t border-slate-700/50 bg-slate-900/30">
              <div className="flex flex-wrap items-center gap-3 w-full justify-end">
                <Button
                    variant="outline"
                    className="aurora-glass border-aurora-neon-blue/40 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
                    size="sm"
                    onClick={() => setIsChatOpen(true)}
                    disabled={!document || document.status_processamento !== 'concluido'}
                    title={document.status_processamento !== 'concluido' ? "Perguntas disponíveis apenas para documentos concluídos" : "Fazer perguntas sobre o documento"}
                >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Perguntar ao Documento
                </Button>
                <Button
                    onClick={handleOpenInNewTab}
                    className="aurora-button-secondary flex items-center gap-2"
                    size="sm"
                    disabled={!pdfPublicUrl || document.status_processamento !== 'concluido'}
                    title={!pdfPublicUrl || document.status_processamento !== 'concluido' ? "Visualização externa indisponível" : "Abrir PDF em nova aba"}
                >
                    <ExternalLink className="h-4 w-4" />
                    Nova Aba
                </Button>
                <Button
                    onClick={handleDownload}
                    className="aurora-button flex items-center gap-2"
                    size="sm"
                    disabled={!pdfPublicUrl || document.status_processamento !== 'concluido'}
                    title={!pdfPublicUrl || document.status_processamento !== 'concluido' ? "Download indisponível" : "Baixar PDF"}
                >
                    <Download className="h-4 w-4" />
                    Download
                </Button>
              </div>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
