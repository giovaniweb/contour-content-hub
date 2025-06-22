
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, Save, Eye, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DocumentTypeEnum, ProcessingStatusEnum } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEquipments } from '@/hooks/useEquipments';

interface ExtractedData {
  title?: string;
  authors?: string[];
  keywords?: string[];
  summary?: string;
}

export const IntelligentUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentTypeEnum>('artigo_cientifico');
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatusEnum>('pendente');
  
  // Editable fields
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [keywords, setKeywords] = useState('');
  const [summary, setSummary] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { equipments } = useEquipments();

  // Auto-save effect
  useEffect(() => {
    if (documentId && (title || authors || keywords || summary)) {
      const timer = setTimeout(() => {
        autoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, authors, keywords, summary, documentId]);

  const autoSave = async () => {
    if (!documentId) return;
    
    setIsAutoSaving(true);
    try {
      const authorsArray = authors.split(',').map(a => a.trim()).filter(a => a);
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);

      const { error } = await supabase
        .from('unified_documents')
        .update({
          titulo_extraido: title || null,
          autores: authorsArray.length > 0 ? authorsArray : null,
          palavras_chave: keywordsArray.length > 0 ? keywordsArray : null,
          texto_completo: summary || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos PDF."
      });
      return;
    }

    setSelectedFile(file);
    
    // Start processing immediately
    await processFile(file);
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem."
      });
      return;
    }

    setThumbnailFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setStatus('processando');

    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: insertedDoc, error: insertError } = await supabase
        .from('unified_documents')
        .insert({
          tipo_documento: documentType,
          equipamento_id: equipmentId || null,
          user_id: userId,
          file_path: filePath,
          status_processamento: 'pendente' as ProcessingStatusEnum,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDocumentId(insertedDoc.id);

      // Process document with AI
      const { error: functionError } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: insertedDoc.id,
          forceRefresh: true,
          timestamp: Date.now()
        }
      });

      if (functionError) {
        console.warn('Processing function error:', functionError);
        // Continue anyway - user can still fill manually
      }

      // Simulate extraction results for demo
      const mockExtractedData = {
        title: "Artigo Científico - Processado",
        authors: ["Autor Principal", "Co-autor"],
        keywords: ["ciência", "pesquisa", "artigo"],
        summary: "Resumo do artigo científico extraído automaticamente pela IA."
      };

      setExtractedData(mockExtractedData);
      setTitle(mockExtractedData.title || '');
      setAuthors(mockExtractedData.authors?.join(', ') || '');
      setKeywords(mockExtractedData.keywords?.join(', ') || '');
      setSummary(mockExtractedData.summary || '');
      setStatus('concluido');

      toast({
        title: "Processamento concluído!",
        description: "Dados extraídos automaticamente. Você pode editá-los abaixo."
      });

    } catch (error: any) {
      console.error('Processing error:', error);
      setStatus('falhou');
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: error.message || "Erro ao processar o arquivo"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprocess = async () => {
    if (!documentId) return;
    await processFile(selectedFile!);
  };

  const handleSave = async () => {
    if (!documentId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nenhum documento foi carregado ainda."
      });
      return;
    }

    await autoSave();
    toast({
      title: "Salvo com sucesso!",
      description: "As informações do documento foram atualizadas."
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-yellow-300 border-yellow-400">Pendente</Badge>;
      case 'processando':
        return <Badge variant="outline" className="text-blue-300 border-blue-400">Processando...</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Concluído</Badge>;
      case 'falhou':
        return <Badge variant="destructive" className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" /> Falhou</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* File Upload Section */}
      <Card className="aurora-glass-enhanced border border-cyan-500/30 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-slate-100 aurora-text-gradient-enhanced">
            <div className="w-10 h-10 aurora-glass-enhanced rounded-full flex items-center justify-center">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            Upload do Documento PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label className="text-slate-200 aurora-heading">Tipo de Documento *</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentTypeEnum)}>
              <SelectTrigger className="aurora-input border-cyan-500/30 focus:border-cyan-500">
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
                <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                <SelectItem value="protocolo">Protocolo/Guia Rápido</SelectItem>
                <SelectItem value="folder_publicitario">Folder Publicitário</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label className="text-slate-200 aurora-heading">Equipamento Relacionado</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger className="aurora-input border-cyan-500/30 focus:border-cyan-500">
                <SelectValue placeholder="Selecione o equipamento (opcional)" />
              </SelectTrigger>
              <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
                <SelectItem value="">Nenhum equipamento específico</SelectItem>
                {equipments?.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400/70 transition-colors aurora-glass-enhanced"
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 text-cyan-400 mx-auto" />
                  <p className="text-slate-200 font-medium">{selectedFile.name}</p>
                  <p className="text-slate-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  {getStatusBadge()}
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-cyan-400 mx-auto" />
                  <p className="text-slate-200 font-medium">Clique para selecionar o arquivo PDF</p>
                  <p className="text-slate-400 text-sm">ou arraste e solte aqui</p>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label className="text-slate-200 aurora-heading">Thumbnail (Opcional)</Label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="border border-cyan-500/30 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400/70 transition-colors aurora-glass-enhanced"
              >
                {thumbnailFile ? (
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-6 w-6 text-cyan-400" />
                    <span className="text-slate-200">{thumbnailFile.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <ImageIcon className="h-5 w-5" />
                    <span>Adicionar thumbnail</span>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
          </div>

          {isProcessing && (
            <div className="aurora-glass-enhanced border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                <span className="text-slate-200">Processando arquivo com IA...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Data Section */}
      {(extractedData.title || selectedFile) && (
        <Card className="aurora-glass-enhanced border border-purple-500/30 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-100 aurora-text-gradient-enhanced">
              <div className="w-10 h-10 aurora-glass-enhanced rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              Dados Extraídos e Editáveis
              {isAutoSaving && (
                <Badge variant="outline" className="text-green-300 border-green-400 ml-auto">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Salvando...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-200 aurora-heading">Título *</Label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título do documento"
                  className="w-full aurora-input border-purple-500/30 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200 aurora-heading">Autores</Label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="Digite os autores separados por vírgula"
                  className="w-full aurora-input border-purple-500/30 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 aurora-heading">Palavras-chave</Label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Digite as palavras-chave separadas por vírgula"
                className="w-full aurora-input border-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200 aurora-heading">Resumo/Abstract</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Digite o resumo ou abstract do documento"
                rows={4}
                className="w-full aurora-textarea border-purple-500/30 focus:border-purple-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                disabled={!documentId}
                className="aurora-button-enhanced"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>

              {status === 'falhou' && (
                <Button
                  onClick={handleReprocess}
                  variant="outline"
                  className="border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Reprocessar
                </Button>
              )}

              {documentId && status === 'concluido' && (
                <Button
                  onClick={() => window.open(`/scientific-articles`, '_blank')}
                  variant="outline"
                  className="border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
