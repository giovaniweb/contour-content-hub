
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [isQuestionChatOpen, setIsQuestionChatOpen] = useState(false);

  const { documents, loading, fetchDocuments } = useDocuments();
  const { equipments } = useEquipments();

  useEffect(() => {
    fetchDocuments({
      type: selectedType || undefined,
      equipmentId: selectedEquipment || undefined,
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
    
    const matchesType = !selectedType || doc.tipo === selectedType;
    const matchesEquipment = !selectedEquipment || doc.equipamento_id === selectedEquipment;
    
    return matchesSearch && matchesType && matchesEquipment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artigos Científicos</h1>
          <p className="text-gray-600">Gerencie e explore sua biblioteca de documentos científicos</p>
        </div>
        <Button 
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
        </div>
        
        <Select value={selectedType} onValueChange={(value: DocumentType | '') => setSelectedType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
            <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
            <SelectItem value="protocolo">Protocolo</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Equipamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos equipamentos</SelectItem>
            {equipments.map(equipment => (
              <SelectItem key={equipment.id} value={equipment.id}>
                {equipment.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Carregando documentos...</p>
          </div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento encontrado"
          description={searchTerm ? `Não encontramos documentos para "${searchTerm}"` : "Comece adicionando seus primeiros documentos científicos"}
          actionLabel="Adicionar Documento"
          onAction={() => setIsUploadDialogOpen(true)}
        />
      ) : (
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
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
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
        document={selectedDocument}
        isOpen={isPDFViewerOpen}
        onClose={() => {
          setIsPDFViewerOpen(false);
          setSelectedDocument(null);
        }}
      />

      {/* Question Chat Dialog */}
      <Dialog open={isQuestionChatOpen} onOpenChange={setIsQuestionChatOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Perguntas sobre o Documento</DialogTitle>
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
