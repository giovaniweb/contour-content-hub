import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentType, TechnicalDocument } from '@/types/document';
import { useDocuments } from '@/hooks/use-documents';
import { useEquipments } from '@/hooks/useEquipments';
import PDFViewer from '@/components/documents/PDFViewer';
import DocumentQuestionChat from '@/components/documents/DocumentQuestionChat';
import EnhancedDocumentUploadForm from '@/components/documents/EnhancedDocumentUploadForm';

// Importing the refactored components
import ScientificArticleHeader from './components/ScientificArticleHeader';
import ScientificArticleControls from './components/ScientificArticleControls';
import ScientificArticleFilters from './components/ScientificArticleFilters';
import ScientificArticleGrid from './components/ScientificArticleGrid';

const EnhancedScientificArticleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [isQuestionChatOpen, setIsQuestionChatOpen] = useState(false);

  const { documents, loading, fetchDocuments } = useDocuments();
  const { equipments } = useEquipments();

  useEffect(() => {
    fetchDocuments({
      type: selectedType === 'all' ? undefined : selectedType,
      equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
      search: searchTerm || undefined
    });
  }, [searchTerm, selectedType, selectedEquipment, fetchDocuments]);

  const handleView = (document: TechnicalDocument) => {
    setSelectedDocument(document);
    setIsPDFViewerOpen(true);
  };

  const handleQuestion = (document: TechnicalDocument) => {
    setSelectedDocument(document);
    setIsQuestionChatOpen(true);
  };

  const handleDownload = (document: TechnicalDocument) => {
    const url = document.arquivo_url || document.link_dropbox;
    if (url) {
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${document.titulo}.pdf`;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleUploadSuccess = () => {
    console.log('Upload successful, closing dialog and refreshing documents');
    setIsUploadDialogOpen(false);
    fetchDocuments();
  };

  const handleNewDocument = () => {
    console.log('Opening upload dialog...');
    setIsUploadDialogOpen(true);
  };

  const handleCancelUpload = () => {
    console.log('Canceling upload, closing dialog...');
    setIsUploadDialogOpen(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.tipo === selectedType;
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

      {/* Enhanced Aurora Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 border-none bg-transparent shadow-none">
          {/* Aurora Modal Container */}
          <div className="aurora-glass-enhanced aurora-border-enhanced rounded-3xl p-8 aurora-glow-enhanced aurora-floating-enhanced relative overflow-hidden">
            {/* Aurora Particles Background */}
            <div className="absolute inset-0 aurora-particles-enhanced opacity-30">
              <div className="absolute top-10 left-10 w-3 h-3 bg-aurora-electric-purple rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-2 h-2 bg-aurora-neon-blue rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-20 left-20 w-4 h-4 bg-aurora-emerald rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-10 right-10 w-2 h-2 bg-aurora-lavender rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Enhanced Aurora Header */}
            <DialogHeader className="relative z-10 mb-6">
              <DialogTitle className="flex items-center gap-3 aurora-text-gradient-enhanced text-3xl font-light tracking-wide aurora-heading-enhanced">
                <div className="p-3 aurora-glass-enhanced rounded-xl aurora-glow border border-aurora-electric-purple/30">
                  <Upload className="h-6 w-6 text-aurora-electric-purple" />
                </div>
                Adicionar Novo Documento Científico
              </DialogTitle>
              <DialogDescription className="aurora-body-enhanced text-lg mt-2 text-shadow-aurora-glow">
                Faça upload de um documento científico para adicionar à biblioteca digital Aurora
              </DialogDescription>
            </DialogHeader>

            {/* Enhanced Form Container */}
            <div className="relative z-10 aurora-glass-enhanced rounded-2xl p-6 border border-aurora-electric-purple/20 aurora-wave-enhanced">
              <div className="overflow-y-auto max-h-[calc(85vh-200px)] scrollbar-hide">
                <EnhancedDocumentUploadForm
                  onSuccess={handleUploadSuccess}
                  onCancel={handleCancelUpload}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onOpenChange={setIsPDFViewerOpen}
        title={selectedDocument?.titulo || 'Documento'}
        pdfUrl={selectedDocument?.arquivo_url || selectedDocument?.link_dropbox}
        documentId={selectedDocument?.id}
      />

      {/* Question Chat Dialog */}
      <Dialog open={isQuestionChatOpen} onOpenChange={setIsQuestionChatOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] aurora-glass-enhanced aurora-border-enhanced">
          <DialogHeader>
            <DialogTitle className="aurora-text-gradient-enhanced">Perguntas sobre o Documento</DialogTitle>
            <DialogDescription className="aurora-body-enhanced">
              Faça perguntas sobre o conteúdo do documento selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <DocumentQuestionChat
              document={selectedDocument}
              isOpen={isQuestionChatOpen}
              onClose={() => {
                setIsQuestionChatOpen(false);
                setSelectedDocument(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedScientificArticleManager;
