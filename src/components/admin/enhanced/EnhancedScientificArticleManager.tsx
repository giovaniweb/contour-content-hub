import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ArrowLeft, FileText, Users, Calendar, ExternalLink } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { TechnicalDocument, DocumentType } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import EnhancedScientificArticleForm from './EnhancedScientificArticleForm';

const EnhancedScientificArticleManager: React.FC = () => {
  const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documentos_tecnicos')
        .select(`
          *,
          equipamentos:equipamento_id (
            nome
          )
        `)
        .eq('tipo', 'artigo_cientifico')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar documentos:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os artigos científicos'
        });
        return;
      }

      const formattedDocuments = data?.map(doc => ({
        ...doc,
        tipo: doc.tipo as DocumentType, // Cast explícito para DocumentType
        equipamento_nome: doc.equipamentos?.nome || null
      })) || [];

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro inesperado ao carregar documentos'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc =>
    doc.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.researchers?.some(researcher => 
      researcher.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    doc.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleNewArticle = () => {
    setSelectedDocument(null);
    setCurrentView('form');
  };

  const handleEditArticle = (document: TechnicalDocument) => {
    setSelectedDocument(document);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDocument(null);
    fetchDocuments(); // Refresh the list
  };

  const handleFormSuccess = () => {
    setCurrentView('list');
    setSelectedDocument(null);
    fetchDocuments();
    toast({
      title: 'Sucesso',
      description: selectedDocument ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!'
    });
  };

  if (currentView === 'form') {
    return (
      <div className="min-h-screen aurora-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button
              onClick={handleBackToList}
              variant="outline"
              className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Lista
            </Button>
          </div>
          
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                {selectedDocument ? 'Editar Artigo Científico' : 'Novo Artigo Científico'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedScientificArticleForm
                isOpen={true}
                articleData={selectedDocument}
                forceClearState={!selectedDocument}
                onSuccess={handleFormSuccess}
                onCancel={handleBackToList}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aurora-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Artigos Científicos
              </h1>
              <p className="text-aurora-lavender">
                Gerencie a biblioteca de artigos científicos
              </p>
            </div>
            <Button
              onClick={handleNewArticle}
              className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white hover:from-aurora-electric-purple/80 hover:to-aurora-neon-blue/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-aurora-lavender w-4 h-4" />
            <Input
              placeholder="Buscar por título, autor ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 aurora-glass border-aurora-electric-purple/30 text-white placeholder:text-aurora-lavender"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="aurora-glass border-aurora-electric-purple/30 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-aurora-electric-purple/20 rounded mb-3"></div>
                  <div className="h-3 bg-aurora-electric-purple/10 rounded mb-2"></div>
                  <div className="h-3 bg-aurora-electric-purple/10 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-aurora-electric-purple/10 rounded"></div>
                    <div className="h-6 w-20 bg-aurora-electric-purple/10 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="aurora-glass border-aurora-electric-purple/30">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-aurora-lavender mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'Nenhum artigo encontrado' : 'Nenhum artigo cadastrado'}
              </h3>
              <p className="text-aurora-lavender mb-6">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece adicionando seu primeiro artigo científico'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleNewArticle}
                  className="bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Artigo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Card 
                key={document.id} 
                className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/50 transition-all duration-300 hover:shadow-aurora-glow"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {document.titulo}
                    </h3>
                    {document.descricao && (
                      <p className="text-aurora-lavender text-sm line-clamp-3">
                        {document.descricao}
                      </p>
                    )}
                  </div>

                  {/* Researchers */}
                  {document.researchers && document.researchers.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-2">
                        <Users className="w-3 h-3 text-aurora-electric-purple" />
                        <span className="text-xs text-aurora-electric-purple font-medium">
                          Pesquisadores
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {document.researchers.slice(0, 3).map((researcher, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30"
                          >
                            {researcher}
                          </Badge>
                        ))}
                        {document.researchers.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30"
                          >
                            +{document.researchers.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Keywords */}
                  {document.keywords && document.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {document.keywords.slice(0, 4).map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs border-aurora-neon-blue/30 text-aurora-neon-blue"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {document.keywords.length > 4 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-aurora-neon-blue/30 text-aurora-neon-blue"
                          >
                            +{document.keywords.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-aurora-lavender mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {document.data_criacao 
                        ? new Date(document.data_criacao).toLocaleDateString('pt-BR')
                        : 'Data não informada'
                      }
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        document.status === 'ativo' 
                          ? 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30' 
                          : 'bg-aurora-coral/20 text-aurora-coral border-aurora-coral/30'
                      }`}
                    >
                      {document.status === 'ativo' ? 'Ativo' : document.status || 'Processando'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditArticle(document)}
                      variant="outline"
                      size="sm"
                      className="flex-1 aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/20"
                    >
                      Editar
                    </Button>
                    {document.link_dropbox && (
                      <Button
                        onClick={() => window.open(document.link_dropbox, '_blank')}
                        variant="outline"
                        size="sm"
                        className="aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedScientificArticleManager;
