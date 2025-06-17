
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Upload, Plus, Eye, Download, FileText, X, HelpCircle, Languages } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TechnicalDocument } from '../../types/document';
import {
  getDocuments,
  downloadPdfFile,
  askDocumentQuestion,
  translateDocumentContent, // Import new service
  updateDocument // Import new service
} from '../../services/documentService';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // Not used as modals are opened programmatically
  DialogClose,
  // DialogFooter, // Not used for these modals
} from "@/components/ui/dialog";
import { PdfViewer } from '@/components/documents/PdfViewer';
import { DocumentMarkdown } from '@/components/documents/DocumentMarkdown';
import { DocumentQuestions } from '@/components/documents/DocumentQuestions';
import { DocumentTranslation } from '@/components/documents/DocumentTranslation'; // Import new component
// import { useToast } from "@/components/ui/use-toast"; // Uncomment if toast is set up

const ScientificArticles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<TechnicalDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States for PDF Viewer Modal
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | undefined>(undefined);

  // States for Extracted Content Modal
  const [showContentModal, setShowContentModal] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<string | undefined>(undefined);

  // States for Ask Document Modal
  const [showAsqModal, setShowAsqModal] = useState<boolean>(false);
  const [selectedArticleForAsq, setSelectedArticleForAsq] = useState<TechnicalDocument | null>(null);

  // States for Translation Modal
  const [showTranslateModal, setShowTranslateModal] = useState<boolean>(false);
  const [selectedArticleForTranslation, setSelectedArticleForTranslation] = useState<TechnicalDocument | null>(null);

  // const { toast } = useToast(); // Uncomment if toast is set up

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await getDocuments({
          type: 'artigo_cientifico',
          search: searchTerm,
        });
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
        fetchArticles();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleViewOnline = (article: TechnicalDocument) => {
    const url = article.pdfUrl || article.arquivo_url || article.link_dropbox;
    if (url) {
      setSelectedPdfUrl(url);
      setShowPdfModal(true);
    } else {
      alert("Nenhuma URL de PDF disponível.");
      // toast({ title: "Nenhuma URL de PDF disponível.", variant: "destructive" });
      console.warn('No PDF URL available for article:', article.titulo);
    }
  };

  const handleDownload = async (article: TechnicalDocument) => {
    const url = article.pdfUrl || article.arquivo_url || article.link_dropbox;
    if (url) {
      try {
        await downloadPdfFile(url, `${article.titulo || 'documento'}.pdf`);
        alert(`Download de "${article.titulo || 'documento'}.pdf" iniciado.`);
        // toast({ title: "Download iniciado.", description: article.titulo });
      } catch (error) {
        console.error("Download failed:", error);
        alert(`Falha no download: ${(error as Error).message}`);
        // toast({ title: "Falha no download.", description: (error as Error).message, variant: "destructive" });
      }
    } else {
      alert("Nenhuma URL para download disponível.");
      // toast({ title: "Nenhuma URL para download.", variant: "destructive" });
    }
  };

  const handleViewContent = (article: TechnicalDocument) => {
    if (article.conteudo_extraido && article.conteudo_extraido.trim() !== "") {
      setSelectedContent(article.conteudo_extraido);
      setShowContentModal(true);
    } else {
      alert("Este artigo não possui conteúdo extraído para visualização ou o conteúdo está vazio.");
      // toast({ title: "Conteúdo não disponível.", description: "Este artigo não possui conteúdo extraído para visualização.", variant: "destructive"});
    }
  };

  const handleOpenAsqModal = (article: TechnicalDocument) => {
    setSelectedArticleForAsq(article);
    setShowAsqModal(true);
  };

  const handleCloseAsqModal = () => {
    setShowAsqModal(false);
    setSelectedArticleForAsq(null); // Reset selected article
  };

  const handleAskDocument = async (question: string): Promise<{success: boolean, answer?: string, error?: string}> => {
    if (!selectedArticleForAsq) {
      return { success: false, error: "Nenhum artigo selecionado para pergunta." };
    }
    const result = await askDocumentQuestion(selectedArticleForAsq.id, question);
    if (result && result.answer) {
      return { success: true, answer: result.answer };
    }
    return { success: false, error: result?.answer || "Falha ao obter resposta." };
  };

  const handleOpenTranslateModal = (article: TechnicalDocument) => {
    setSelectedArticleForTranslation(article);
    setShowTranslateModal(true);
  };

  const handleCloseTranslateModal = () => {
    setShowTranslateModal(false);
    setSelectedArticleForTranslation(null);
  };

  const handleTranslateContent = async (
    targetLanguage: string,
    contentToTranslate: string,
    sourceLanguage?: string
  ): Promise<{ success: boolean; translatedText?: string; language?: string; error?: string }> => {
    if (!selectedArticleForTranslation) {
      return { success: false, error: "Nenhum artigo selecionado para tradução." };
    }
    const result = await translateDocumentContent(
      selectedArticleForTranslation.id,
      targetLanguage,
      contentToTranslate,
      sourceLanguage
    );
    if (result) {
      return { success: true, translatedText: result.translatedText, language: result.language };
    }
    return { success: false, error: "Falha ao traduzir o conteúdo." };
  };

  const handleSaveTranslatedContent = async (
    translatedText: string,
    targetLanguage: string
  ): Promise<boolean> => {
    if (!selectedArticleForTranslation) {
      alert("Erro: Artigo para tradução não encontrado.");
      return false;
    }

    const currentTranslatedLanguages = selectedArticleForTranslation.idiomas_traduzidos || [];
    const updatedTranslatedLanguages = Array.from(new Set([...currentTranslatedLanguages, targetLanguage]));

    const updatedArticle = await updateDocument(selectedArticleForTranslation.id, {
      conteudo_extraido: translatedText, // As per task, update main content with latest translation
      idiomas_traduzidos: updatedTranslatedLanguages,
      // TODO: Consider a more robust way to store multiple translations if needed,
      // e.g., a 'translations' JSONB field:
      // translations: {
      //   ...(selectedArticleForTranslation.translations || {}),
      //   [targetLanguage]: translatedText
      // }
    });

    if (updatedArticle) {
      setArticles(prevArticles =>
        prevArticles.map(art => art.id === updatedArticle.id ? updatedArticle : art)
      );
      alert(`Artigo "${updatedArticle.titulo}" atualizado com tradução para ${targetLanguage}. O conteúdo principal foi substituído pela tradução.`);
      // Optionally close the modal after saving, or let DocumentTranslation handle it.
      // handleCloseTranslateModal();
      return true;
    } else {
      alert("Falha ao salvar a tradução no banco de dados.");
      return false;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Artigos Científicos</h1>
            <p className="text-slate-400">Biblioteca de artigos e pesquisas científicas</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por título, resumo..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* TODO: Implement filter button functionality */}
          <Button variant="outline" size="icon" className="hidden sm:inline-flex">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* TODO: Implement button functionalities */}
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Enviar Artigo
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Artigo
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center text-slate-400 py-10">Carregando artigos...</div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum artigo encontrado"
          description={searchTerm ? "Tente ajustar sua busca ou adicione novos artigos." : "Comece adicionando seus primeiros artigos científicos"}
          // actionLabel="Adicionar Artigo" // Optional: depends on user role/permissions
          // actionIcon={Upload}
          // onAction={() => console.log('Add article from empty state')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-slate-800 shadow-lg rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-50 mb-2">{article.titulo}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                  {article.resumo || article.descricao || 'Sem resumo ou descrição disponível.'}
                </p>
                {article.researchers && article.researchers.length > 0 && (
                  <p className="text-xs text-slate-500 mb-1">
                    <strong>Autores:</strong> {article.researchers.join(', ')}
                  </p>
                )}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1"><strong>Palavras-chave:</strong></p>
                    <div className="flex flex-wrap gap-1">
                      {article.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                  onClick={() => handleViewOnline(article)}
                  disabled={!article.pdfUrl && !article.arquivo_url && !article.link_dropbox}
                >
                  <Eye className="mr-2 h-4 w-4" /> Ver PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                  onClick={() => handleDownload(article)}
                  disabled={!article.pdfUrl && !article.arquivo_url && !article.link_dropbox}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                  onClick={() => handleViewContent(article)}
                  disabled={!article.conteudo_extraido || article.conteudo_extraido.trim() === ""}
                >
                  <FileText className="mr-2 h-4 w-4" /> Conteúdo
                </Button>
                 <Button
                  variant="default" // Or "outline" depending on desired prominence
                  size="sm"
                  className="flex-1 min-w-[120px]"
                  onClick={() => handleOpenAsqModal(article)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" /> Perguntar
                </Button>
                 <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 min-w-[120px]"
                  onClick={() => handleOpenTranslateModal(article)}
                  // Disable if no content to translate or if it's already in many languages?
                  disabled={!article.conteudo_extraido || article.conteudo_extraido.trim() === ""}
                >
                  <Languages className="mr-2 h-4 w-4" /> Traduzir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Visualizador de PDF</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex-grow overflow-hidden">
            {selectedPdfUrl ? (
              <PdfViewer url={selectedPdfUrl} />
            ) : (
              <p className="p-4">Nenhuma URL de PDF selecionada.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Extracted Content Modal */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="max-w-3xl w-[90vw]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Conteúdo Extraído do Documento</DialogTitle>
             <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute top-3 right-3">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {selectedContent ? (
              <DocumentMarkdown markdown={selectedContent} />
            ) : (
              <p>Nenhum conteúdo selecionado ou o conteúdo está vazio.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Ask Document (Q&A) Modal */}
      {selectedArticleForAsq && (
        <Dialog open={showAsqModal} onOpenChange={handleCloseAsqModal}>
          <DialogContent className="max-w-2xl w-[90vw]">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Perguntar sobre: {selectedArticleForAsq.titulo}</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleCloseAsqModal}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <DocumentQuestions
                documentId={selectedArticleForAsq.id}
                documentTitle={selectedArticleForAsq.titulo}
                onAskQuestion={handleAskDocument}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Translation Modal */}
      {selectedArticleForTranslation && (
        <Dialog open={showTranslateModal} onOpenChange={handleCloseTranslateModal}>
          <DialogContent className="max-w-3xl w-[90vw]">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Traduzir: {selectedArticleForTranslation.titulo}</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleCloseTranslateModal}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <DocumentTranslation
                documentTitle={selectedArticleForTranslation.titulo}
                originalContent={selectedArticleForTranslation.conteudo_extraido || ""}
                originalLanguage={selectedArticleForTranslation.idioma_original || 'pt'} // Default to 'pt' if not specified
                translatedLanguages={selectedArticleForTranslation.idiomas_traduzidos || []}
                onTranslate={handleTranslateContent}
                onSaveTranslation={handleSaveTranslatedContent}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ScientificArticles;
