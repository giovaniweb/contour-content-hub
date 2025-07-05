import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, Book, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useScientificArticles } from '@/hooks/use-scientific-articles';
import { useEquipments } from '@/hooks/useEquipments';
import { DocumentTypeEnum, UnifiedDocument } from '@/types/document';
import { Badge } from '@/components/ui/badge';

const ScientificArticlesUserManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentTypeEnum | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  const { equipments } = useEquipments();
  
  const {
    articles,
    loading,
    error,
    fetchScientificArticles,
  } = useScientificArticles();

  useEffect(() => {
    const params = {
      search: searchTerm,
      equipmentId: selectedEquipment === 'all' ? undefined : selectedEquipment,
      tipo_documento: selectedType === 'all' ? undefined : selectedType,
    };
    fetchScientificArticles(params);
  }, [searchTerm, selectedType, selectedEquipment, fetchScientificArticles]);

  const handleViewDocument = (document: UnifiedDocument) => {
    // Navigate to dedicated page instead of modal
    window.location.href = `/scientific-articles/${document.id}`;
  };

  if (error) {
    return (
      <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
        <div className="container mx-auto px-4 py-8">
          <Card className="aurora-glass-enhanced border-red-500/30">
            <CardContent className="p-6">
              <p className="text-red-400 text-center">
                Erro ao carregar artigos científicos: {error}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 mx-auto block aurora-button-enhanced"
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-page-container min-h-screen aurora-enhanced-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="aurora-heading-enhanced text-4xl sm:text-5xl lg:text-6xl">
            Artigos Científicos
          </h1>
          <p className="aurora-body-enhanced text-lg sm:text-xl max-w-3xl mx-auto">
            Explore nossa biblioteca de artigos científicos e documentos técnicos sobre estética avançada
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="aurora-glass-enhanced border-aurora-electric-purple/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 aurora-text-gradient-enhanced">
              <Search className="h-5 w-5 text-aurora-cyan" />
              Buscar Documentos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, conteúdo, palavras-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 aurora-input"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium aurora-text-gradient-enhanced">Tipo de Documento</label>
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DocumentTypeEnum | 'all')}>
                  <SelectTrigger className="aurora-glass-enhanced border-aurora-electric-purple/30">
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass-enhanced border-aurora-electric-purple/30">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                    <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                    <SelectItem value="protocolo">Protocolo</SelectItem>
                    <SelectItem value="folder_publicitario">Folder Publicitário</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Equipment Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium aurora-text-gradient-enhanced">Equipamento</label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger className="aurora-glass-enhanced border-aurora-electric-purple/30">
                    <SelectValue placeholder="Selecionar equipamento" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass-enhanced border-aurora-electric-purple/30">
                    <SelectItem value="all">Todos os equipamentos</SelectItem>
                    {equipments?.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="aurora-glass-enhanced border-aurora-electric-purple/30 aurora-loading-enhanced">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-aurora-electric-purple/20 rounded animate-pulse"></div>
                    <div className="h-3 bg-aurora-electric-purple/15 rounded animate-pulse"></div>
                    <div className="h-3 bg-aurora-electric-purple/10 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : articles && articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id} className="aurora-card-enhanced hover:border-aurora-cyan/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                        {article.tipo_documento}
                      </Badge>
                      <Badge variant="secondary" className={
                        article.status_processamento === 'concluido' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : article.status_processamento === 'falhou' 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }>
                        {article.status_processamento}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold aurora-text-gradient-enhanced mb-2 line-clamp-2">
                        {article.titulo_extraido || 'Título não disponível'}
                      </h3>
                      {article.texto_completo && (
                        <p className="text-sm text-slate-300 line-clamp-3">
                          {article.texto_completo.substring(0, 150)}...
                        </p>
                      )}
                    </div>

                    {article.equipamento_nome && (
                      <div className="text-xs text-aurora-cyan">
                        📱 {article.equipamento_nome}
                      </div>
                    )}

                    {article.palavras_chave && article.palavras_chave.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.palavras_chave.slice(0, 3).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                            {keyword}
                          </Badge>
                        ))}
                        {article.palavras_chave.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-aurora-emerald/10 text-aurora-emerald border-aurora-emerald/30">
                            +{article.palavras_chave.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewDocument(article)}
                        size="sm"
                        className="flex-1 aurora-button-enhanced"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        onClick={() => handleViewDocument(article)}
                        size="sm"
                        variant="outline"
                        className="border-aurora-cyan text-aurora-cyan hover:bg-aurora-cyan/10"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="aurora-glass-enhanced border-aurora-electric-purple/30">
                <CardContent className="p-12 text-center">
                  <Book className="h-16 w-16 text-aurora-electric-purple mx-auto mb-4" />
                  <h3 className="aurora-heading-enhanced text-xl mb-2">
                    Nenhum documento encontrado
                  </h3>
                  <p className="text-slate-400">
                    Ajuste os filtros ou tente uma busca diferente.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ScientificArticlesUserManager;