
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Download, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';
import EnhancedScientificArticleDialog from './EnhancedScientificArticleDialog';
import ScientificArticleGrid from './components/ScientificArticleGrid';
import ScientificArticleHeader from './components/ScientificArticleHeader';
// ScientificArticleControls and ScientificArticleFilters are not used, consider removing if part of old cleanup
// import ScientificArticleControls from './components/ScientificArticleControls';
// import ScientificArticleFilters from './components/ScientificArticleFilters';
import ScientificArticleViewer from '@/components/scientific-articles/ScientificArticleViewer';

import { DocumentTypeEnum, UnifiedDocument } from '@/types/document';


const EnhancedScientificArticleManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentTypeEnum | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false); // Renamed for clarity
  const [documentToEdit, setDocumentToEdit] = useState<UnifiedDocument | null>(null); // Typed and renamed
  const [documentToView, setDocumentToView] = useState<UnifiedDocument | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const { equipments } = useEquipments();
  
  const {
    articles,
    loading,
    error,
    fetchScientificArticles,
    deleteArticle,
    processArticle
  } = useScientificArticles();

  useEffect(() => {
    const params = {
      search: searchTerm,
      equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
      tipo_documento: selectedType === 'all' ? undefined : selectedType,
    };
    fetchScientificArticles(params);
  }, [searchTerm, selectedType, selectedEquipment, fetchScientificArticles]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as DocumentTypeEnum | 'all');
  };

  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(value);
  };

  const handleEditDocument = (document: UnifiedDocument) => {
    setDocumentToEdit(document);
    setIsFormDialogOpen(true);
  };

  const handleViewDocument = (document: UnifiedDocument) => {
    setDocumentToView(document);
  };


  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteArticle(documentId);
      toast({
        title: "Sucesso",
        description: "Documento removido com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o documento.",
      });
    }
  };

  const handleAddDocument = () => {
    setDocumentToEdit(null); // Clear any document being edited
    setIsFormDialogOpen(true);
  };

  const handleFormDialogClose = () => {
    setIsFormDialogOpen(false);
    setDocumentToEdit(null);
    // Refresh the articles list
    const params = {
      search: searchTerm,
      equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
      tipo_documento: selectedType === 'all' ? undefined : selectedType,
    };
    fetchScientificArticles(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedEquipment('all');
  };

  const hasActiveFilters = searchTerm || selectedType !== 'all' || selectedEquipment !== 'all';

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="aurora-glass border-red-500/30">
          <CardContent className="p-6">
            <p className="text-red-400 text-center">
              Erro ao carregar artigos científicos: {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 mx-auto block"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        <ScientificArticleHeader />

      {/* Search and Filters */}
      <Card className="aurora-glass-enhanced border-cyan-500/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-5 w-5 text-cyan-400" />
              Busca e Filtros
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isFilterExpanded ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Buscar por título, conteúdo, palavras-chave..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 aurora-input"
            />
          </div>

          {/* Filters */}
          {isFilterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-600">
              {/* Document Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Tipo de Documento</label>
                <Select value={selectedType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="aurora-glass border-slate-600 text-white">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todos os tipos
                    </SelectItem>
                    <SelectItem value="artigo_cientifico" className="text-white hover:bg-slate-700">
                      Artigo Científico
                    </SelectItem>
                    <SelectItem value="ficha_tecnica" className="text-white hover:bg-slate-700">
                      Ficha Técnica
                    </SelectItem>
                    <SelectItem value="protocolo" className="text-white hover:bg-slate-700">
                      Protocolo
                    </SelectItem>
                    <SelectItem value="folder_publicitario" className="text-white hover:bg-slate-700">
                      Folder Publicitário
                    </SelectItem>
                    <SelectItem value="outro" className="text-white hover:bg-slate-700">
                      Outro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Equipamento</label>
                <Select value={selectedEquipment} onValueChange={handleEquipmentChange}>
                  <SelectTrigger className="aurora-glass border-slate-600 text-white">
                    <SelectValue placeholder="Selecionar equipamento" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      Todos os equipamentos
                    </SelectItem>
                    {equipments?.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id} className="text-white hover:bg-slate-700">
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full aurora-button-enhanced border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-600">
              <span className="text-sm text-slate-400">Filtros ativos:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded text-sm">
                  Busca: {searchTerm}
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-sm">
                  Tipo: {selectedType}
                </span>
              )}
              {selectedEquipment !== 'all' && (
                <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-sm">
                  Equipamento: {equipments?.find(e => e.id === selectedEquipment)?.nome}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Document Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleAddDocument}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      {/* Documents Grid */}
      <ScientificArticleGrid
        articles={articles || []}
        isLoading={loading}
        onEdit={handleEditDocument}
        onView={handleViewDocument} // Pass the new handler
        onRefresh={() => {
          const params = {
            search: searchTerm,
            equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
            tipo_documento: selectedType === 'all' ? undefined : selectedType,
          };
          fetchScientificArticles(params);
        }}
      />

      {/* Form Dialog */}
      <EnhancedScientificArticleDialog
        isOpen={isFormDialogOpen}
        onClose={handleFormDialogClose}
        onSuccess={handleFormDialogClose}
        articleData={documentToEdit}
      />

      {/* Detail View */}
      {documentToView && (
        <ScientificArticleViewer 
          articleId={documentToView.id} 
          onBack={() => setDocumentToView(null)} 
        />
      )}

      </div>
    </div>
  );
};

export default EnhancedScientificArticleManager;
