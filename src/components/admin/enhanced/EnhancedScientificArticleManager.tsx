
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentTypeEnum, UnifiedDocument } from '@/types/document';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';
import PDFViewer from '@/components/documents/PDFViewer';
import { IntelligentUploadForm } from '@/components/unified-document-upload/IntelligentUploadForm';

// Importing the refactored components
import ScientificArticleHeader from './components/ScientificArticleHeader';
import ScientificArticleControls from './components/ScientificArticleControls';
import ScientificArticleFilters from './components/ScientificArticleFilters';
import ScientificArticleGrid from './components/ScientificArticleGrid';

const EnhancedScientificArticleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentTypeEnum | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<UnifiedDocument | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [isQuestionChatOpen, setIsQuestionChatOpen] = useState(false);

  const { articles, loading, fetchScientificArticles } = useScientificArticles();
  const { equipments } = useEquipments();

  useEffect(() => {
    fetchScientificArticles({
      tipo_documento: selectedType === 'all' ? undefined : selectedType,
      equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
      search: searchTerm || undefined
    });
  }, [searchTerm, selectedType, selectedEquipment, fetchScientificArticles]);

  const handleView = (document: UnifiedDocument) => {
    setSelectedDocument(document);
    setIsPDFViewerOpen(true);
  };

  const handleQuestion = (document: UnifiedDocument) => {
    setSelectedDocument(document);
    setIsQuestionChatOpen(true);
  };

  const handleDownload = (document: UnifiedDocument) => {
    const url = document.file_path;
    if (url) {
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.titulo_extraido || 'documento'}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleUploadSuccess = () => {
    console.log('Upload successful, closing dialog and refreshing documents');
    setIsUploadDialogOpen(false);
    fetchScientificArticles();
  };

  const handleNewDocument = () => {
    console.log('Opening upload dialog...');
    setIsUploadDialogOpen(true);
  };

  const handleCancelUpload = () => {
    console.log('Canceling upload, closing dialog...');
    setIsUploadDialogOpen(false);
  };

  const filteredDocuments = articles.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.titulo_extraido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.texto_completo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.tipo_documento === selectedType;
    const matchesEquipment = selectedEquipment === 'all' || doc.equipamento_id === selectedEquipment;
    
    return matchesSearch && matchesType && matchesEquipment;
  });

  console.log('Upload dialog state:', isUploadDialogOpen);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-6 space-y-8">
        {/* Header */}
        <ScientificArticleHeader />

        {/* Controls */}
        <ScientificArticleControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onNewDocument={handleNewDocument}
        />

        {/* Filters */}
        <ScientificArticleFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedEquipment={selectedEquipment}
          setSelectedEquipment={setSelectedEquipment}
          equipments={equipments}
        />

        {/* Documents Grid */}
        <ScientificArticleGrid
          documents={filteredDocuments}
          loading={loading}
          searchTerm={searchTerm}
          onView={handleView}
          onQuestion={handleQuestion}
          onDownload={handleDownload}
          onUpload={handleNewDocument}
        />
      </div>

      {/* Upload Dialog - Fixed z-index and positioning */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-slate-800/95 backdrop-blur-sm border border-cyan-500/30 z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Upload className="h-5 w-5 text-cyan-400" />
              Upload Inteligente de Documentos
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Envie um documento científico para processamento automático com IA
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <IntelligentUploadForm />
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onOpenChange={setIsPDFViewerOpen}
        title={selectedDocument?.titulo_extraido || 'Documento'}
        pdfUrl={selectedDocument?.file_path}
        documentId={selectedDocument?.id}
      />

      {/* Question Chat Dialog - Fixed props */}
      <Dialog open={isQuestionChatOpen} onOpenChange={setIsQuestionChatOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800/95 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Perguntas sobre o Documento</DialogTitle>
            <DialogDescription className="text-slate-400">
              Faça perguntas sobre o conteúdo do documento selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <DocumentQuestionChat
              documentId={selectedDocument.id}
              documentTitle={selectedDocument.titulo_extraido || 'Documento'}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedScientificArticleManager;
