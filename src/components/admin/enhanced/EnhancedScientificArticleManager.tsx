
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Upload, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/hooks/use-documents';
import { useEquipments } from '@/hooks/useEquipments';
import { TechnicalDocument, DocumentType } from '@/types/document';
import DocumentCard from '@/components/documents/DocumentCard';
import PDFViewer from '@/components/documents/PDFViewer';
import DocumentQuestionChat from '@/components/documents/DocumentQuestionChat';
import EnhancedDocumentUploadForm from '@/components/documents/EnhancedDocumentUploadForm';
import { EmptyState } from '@/components/ui/empty-state';

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
    setIsUploadDialogOpen(false);
    fetchDocuments();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.tipo === selectedType;
    const matchesEquipment = selectedEquipment === 'all' || doc.equipamento_id === selectedEquipment;
    
    return matchesSearch && matchesType && matchesEquipment;
  });

  // Filter equipments to ensure valid IDs
  const validEquipments = equipments.filter(equipment => 
    equipment && equipment.id && equipment.id.trim() !== ""
  );

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
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <FileText className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <div className="absolute inset-0 h-12 w-12 text-cyan-400 animate-pulse blur-sm"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Artigos Científicos
              </h1>
              <p className="text-slate-300">Gerencie e explore sua biblioteca de documentos científicos</p>
            </div>
          </div>

          {/* Status Tags */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 rounded-xl">
              <Flame className="h-4 w-4 mr-1" />
              Populares
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-xl">
              <Sparkles className="h-4 w-4 mr-1" />
              Recentes
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm"
              />
            </div>
            <Button variant="outline" size="icon" className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Novo Documento
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 p-4 bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl">
          <Select value={selectedType} onValueChange={(value: DocumentType | 'all') => setSelectedType(value)}>
            <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-500/30 text-slate-100">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
              <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
              <SelectItem value="protocolo">Protocolo</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-48 bg-slate-700/50 border-cyan-500/30 text-slate-100">
              <SelectValue placeholder="Equipamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos equipamentos</SelectItem>
              {validEquipments.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Carregando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <EmptyState
              icon={FileText}
              title="Nenhum documento encontrado"
              description={searchTerm ? `Não encontramos documentos para "${searchTerm}"` : "Comece adicionando seus primeiros documentos científicos"}
              actionLabel="Adicionar Documento"
              onAction={() => setIsUploadDialogOpen(true)}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={handleView}
                  onQuestion={handleQuestion}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800/95 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-100">
              <Upload className="h-5 w-5 text-cyan-400" />
              Adicionar Novo Documento
            </DialogTitle>
          </DialogHeader>
          <EnhancedDocumentUploadForm
            onSuccess={handleUploadSuccess}
            onCancel={() => setIsUploadDialogOpen(false)}
          />
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
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800/95 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Perguntas sobre o Documento</DialogTitle>
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
