
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import DocumentUploadForm from '@/components/documents/DocumentUploadForm';
import DocumentList from '@/components/documents/DocumentList';
import DocumentFilters from '@/components/documents/DocumentFilters';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentType, GetDocumentsParams } from '@/types/document';
import { useDocuments } from '@/hooks/use-documents';

const TechnicalDocumentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("view");
  const { documents, loading, fetchDocuments } = useDocuments();
  const { toast } = useToast();
  const [filters, setFilters] = useState<GetDocumentsParams>({
    type: undefined,
    equipmentId: undefined,
    language: undefined,
    search: undefined,
  });
  
  // Using a stable function reference to prevent loops
  const applyFilters = useCallback(() => {
    fetchDocuments(filters);
  }, [filters, fetchDocuments]);
  
  // Effect to apply filters - Using the stable callback
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const handleFiltersChange = (newFilters: Partial<GetDocumentsParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Documentos Técnicos | Fluida</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documentos Técnicos</h1>
            <p className="text-muted-foreground">
              Gerencie artigos científicos, fichas técnicas e protocolos
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="view" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Visualizar</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              <span>Adicionar Documento</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Filtrar Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentFilters onChange={handleFiltersChange} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Biblioteca de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentList 
                  documents={documents}
                  isLoading={loading}
                  onRefresh={() => fetchDocuments(filters)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Adicionar Novo Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUploadForm 
                  onSuccess={() => {
                    toast({
                      title: "Documento adicionado",
                      description: "O documento foi adicionado com sucesso.",
                    });
                    setActiveTab("view");
                    fetchDocuments(filters);
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TechnicalDocumentsPage;
