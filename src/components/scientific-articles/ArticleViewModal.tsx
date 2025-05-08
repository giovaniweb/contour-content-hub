
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TechnicalDocument } from "@/types/document";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { processPdfUrl, openPdfInNewTab, downloadPdf } from "@/utils/pdfUtils";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Send, 
  User, 
  Bot,
  Loader2,
  FileWarning,
  ExpandIcon,
  MinusIcon,
  PlusIcon,
  RefreshCw
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleViewModalProps {
  article: TechnicalDocument;
  open: boolean;
  onClose: () => void;
}

interface AskQuestionResponse {
  success: boolean;
  answer: string;
  error?: string;
  sourceDocument?: string;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({ article, open, onClose }) => {
  const [pdfZoom, setPdfZoom] = useState(1);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'question' | 'answer', content: string}>>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { processedUrl } = processPdfUrl(article.link_dropbox);

  const handleDownload = async () => {
    if (!article.link_dropbox) {
      toast({
        title: "Download failed",
        description: "No PDF URL available for this document",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      await downloadPdf(article.link_dropbox, article.titulo);
      
      toast({
        title: "Download started",
        description: "Your PDF is being downloaded",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Download failed",
        description: "Could not download the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const zoomIn = () => {
    setPdfZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setPdfZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setPdfZoom(1);
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };
  
  const handlePdfLoad = () => {
    setPdfLoading(false);
  };
  
  const handlePdfError = () => {
    setPdfLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || asking) return;

    setAsking(true);
    // Add question to conversation
    setConversationHistory((prev) => [...prev, { type: 'question', content: question }]);
    
    try {
      // Call the Supabase Edge function to ask a question about the document
      const { data, error } = await supabase.functions.invoke<AskQuestionResponse>(
        'ask-document', 
        { 
          body: { 
            documentId: article.id,
            question: question 
          } 
        }
      );

      if (error) throw error;
      
      if (!data || !data.success) {
        throw new Error(data?.error || "Failed to get an answer");
      }

      // Add answer to conversation
      setConversationHistory((prev) => [...prev, { type: 'answer', content: data.answer }]);
      setAnswer(data.answer);
      setQuestion("");

      // Scroll to bottom of conversation after a short delay
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error asking question:", error);
      toast({
        title: "Question failed",
        description: "Could not get an answer. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to conversation
      setConversationHistory((prev) => [
        ...prev, 
        { 
          type: 'answer', 
          content: "I'm sorry, I couldn't process your question. Please try again." 
        }
      ]);
    } finally {
      setAsking(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden rounded-xl">
        <div className="flex flex-col h-[85vh]">
          {/* Header with title and close button */}
          <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-fluida-blue/10 to-fluida-pink/10">
            <div>
              <h2 className="text-xl font-bold text-foreground truncate max-w-[60vw]">
                {article.titulo}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {article.researchers && article.researchers.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {article.researchers.length === 1 
                      ? article.researchers[0] 
                      : `${article.researchers.length} researchers`
                    }
                  </div>
                )}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {article.keywords.slice(0, 3).map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {keyword}
                      </Badge>
                    ))}
                    {article.keywords.length > 3 && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        +{article.keywords.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Main content area */}
          <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
            {/* PDF Viewer Panel */}
            <ResizablePanel defaultSize={65} minSize={40} className="overflow-hidden">
              <div className="flex flex-col h-full">
                {/* PDF Controls */}
                <div className="flex items-center justify-between border-b p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md px-1 bg-background">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={zoomOut} 
                        title="Zoom Out"
                        className="p-1 h-8"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span className="text-xs px-3 select-none">{Math.round(pdfZoom * 100)}%</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={zoomIn} 
                        title="Zoom In"
                        className="p-1 h-8"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetZoom} 
                      title="Reset Zoom"
                      className="h-8"
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      <span className="text-xs">Reset</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      className="h-8"
                    >
                      <ExpandIcon className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className="flex items-center gap-1 h-8"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    <span className="text-xs">{isDownloading ? "Baixando..." : "Download"}</span>
                  </Button>
                </div>

                {/* PDF Document with loading state */}
                <div className="flex-1 overflow-auto bg-muted/30 p-4 relative">
                  {pdfLoading && processedUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-fluida-blue mb-2" />
                        <p className="text-sm text-muted-foreground">Loading PDF...</p>
                      </div>
                    </div>
                  )}
                  <div 
                    style={{ 
                      transform: `scale(${pdfZoom})`, 
                      transformOrigin: 'top center', 
                      transition: 'transform 0.2s' 
                    }} 
                    className="min-h-full"
                  >
                    {processedUrl ? (
                      <iframe
                        ref={iframeRef}
                        src={processedUrl}
                        className="w-full h-[calc(100vh-14rem)] rounded-lg shadow-md bg-white"
                        title={article.titulo}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                        onLoad={handlePdfLoad}
                        onError={handlePdfError}
                      />
                    ) : (
                      <div className="w-full h-[calc(100vh-14rem)] flex items-center justify-center bg-white rounded-lg">
                        <div className="text-center">
                          <FileWarning className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-muted-foreground mb-3">PDF preview not available</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(article.link_dropbox, '_blank')}
                          >
                            Tentar abrir em nova aba
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="bg-border hover:bg-fluida-blue transition-colors w-1" />
            
            {/* Q&A Panel */}
            <ResizablePanel defaultSize={35} minSize={25} className="overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="border-b p-3">
                  <h3 className="font-semibold text-md">Ask about this article</h3>
                  <p className="text-xs text-muted-foreground">
                    Ask questions about the content of this specific article
                  </p>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <AnimatePresence>
                    {conversationHistory.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center p-6"
                      >
                        <div className="w-16 h-16 rounded-full bg-fluida-blue/10 flex items-center justify-center mb-3">
                          <Bot className="h-8 w-8 text-fluida-blue" />
                        </div>
                        <h3 className="font-medium text-lg">Ask a question</h3>
                        <p className="text-muted-foreground text-sm mt-2">
                          Ask me questions about the content of this scientific article. I'll answer based on the information available in this document only.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {conversationHistory.map((item, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex ${item.type === 'question' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={cn(
                                "max-w-[80%] p-3 rounded-2xl",
                                item.type === 'question' 
                                  ? "bg-fluida-blue text-white rounded-tr-none" 
                                  : "bg-muted rounded-tl-none"
                              )}
                            >
                              <div className="flex items-center mb-1">
                                {item.type === 'question' ? (
                                  <>
                                    <span className="text-xs font-semibold">You</span>
                                    <User className="h-3 w-3 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-3 w-3 mr-1" />
                                    <span className="text-xs font-semibold">Article Assistant</span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
                
                <div className="border-t p-3">
                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      handleAskQuestion(); 
                    }} 
                    className="flex gap-2"
                  >
                    <Input 
                      placeholder="Ask a question about this article..." 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={asking}
                      className="rounded-full pl-4"
                    />
                    <Button 
                      type="submit" 
                      disabled={!question.trim() || asking}
                      className="rounded-full aspect-square p-0 w-10 bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white"
                    >
                      {asking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;
