
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEquipments } from '@/hooks/useEquipments';
import { DocumentTypeEnum, ProcessingStatusEnum } from '@/types/document';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Brain,
  Zap,
  Edit,
  Save
} from 'lucide-react';

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message: string;
  documentId?: string;
}

interface ExtractedData {
  title?: string;
  authors?: string[];
  keywords?: string[];
  summary?: string;
}

export const IntelligentUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentTypeEnum>('artigo_cientifico');
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    message: ''
  });
  
  // Campos editáveis após processamento
  const [isEditing, setIsEditing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [editableTitle, setEditableTitle] = useState('');
  const [editableAuthors, setEditableAuthors] = useState('');
  const [editableKeywords, setEditableKeywords] = useState('');
  const [editableSummary, setEditableSummary] = useState('');
  
  const { toast } = useToast();
  const { equipments, loading: equipmentsLoading } = useEquipments();

  const documentTypes = [
    { value: 'artigo_cientifico', label: 'Artigo Científico', icon: '📊' },
    { value: 'ficha_tecnica', label: 'Ficha Técnica', icon: '📋' },
    { value: 'protocolo', label: 'Protocolo', icon: '📝' },
    { value: 'folder_publicitario', label: 'Folder Publicitário', icon: '📢' },
    { value: 'outro', label: 'Outro', icon: '📄' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Arquivo Inválido",
          description: "Por favor, selecione apenas arquivos PDF.",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Arquivo Muito Grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadState({ status: 'idle', message: '' });
      setIsEditing(false);
      setExtractedData({});
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum Arquivo Selecionado",
        description: "Por favor, selecione um arquivo PDF para fazer upload.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadState({
        status: 'uploading',
        message: 'Enviando arquivo para o servidor...'
      });

      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadState({
        status: 'processing',
        message: 'Arquivo enviado! Processando com IA...'
      });

      // Create document record in unified_documents table
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

      // Call the process-document function
      const { error: processError } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: insertedDoc.id,
          forceRefresh: true,
          timestamp: Date.now()
        }
      });

      if (processError) {
        console.error('Process function error:', processError);
      }

      // Aguardar o processamento e buscar dados extraídos
      await waitForProcessing(insertedDoc.id);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadState({
        status: 'error',
        message: `Erro no upload: ${error.message}`
      });
      
      toast({
        title: "Erro no Upload",
        description: error.message || "Ocorreu um erro durante o upload do documento.",
        variant: "destructive"
      });
    }
  };

  const waitForProcessing = async (documentId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos
    
    const checkStatus = async () => {
      const { data: doc } = await supabase
        .from('unified_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (doc?.status_processamento === 'concluido') {
        setExtractedData({
          title: doc.titulo_extraido,
          authors: doc.autores,
          keywords: doc.palavras_chave,
          summary: doc.texto_completo?.substring(0, 500)
        });

        // Preencher campos editáveis
        setEditableTitle(doc.titulo_extraido || '');
        setEditableAuthors(doc.autores?.join(', ') || '');
        setEditableKeywords(doc.palavras_chave?.join(', ') || '');
        setEditableSummary(doc.texto_completo?.substring(0, 500) || '');

        setUploadState({
          status: 'success',
          message: 'Documento processado com sucesso!',
          documentId: documentId
        });

        // Automaticamente abrir para edição
        setIsEditing(true);

        toast({
          title: "Processamento Concluído",
          description: "Documento processado! Você pode editar os campos extraídos.",
        });

        return;
      } else if (doc?.status_processamento === 'falhou') {
        throw new Error(doc.detalhes_erro || 'Falha no processamento');
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 1000);
      } else {
        throw new Error('Timeout no processamento');
      }
    };

    checkStatus();
  };

  const handleSaveChanges = async () => {
    if (!uploadState.documentId) return;

    try {
      const { error } = await supabase
        .from('unified_documents')
        .update({
          titulo_extraido: editableTitle,
          autores: editableAuthors.split(',').map(a => a.trim()).filter(Boolean),
          palavras_chave: editableKeywords.split(',').map(k => k.trim()).filter(Boolean),
          texto_completo: editableSummary,
          updated_at: new Date().toISOString()
        })
        .eq('id', uploadState.documentId);

      if (error) throw error;

      toast({
        title: "Alterações Salvas",
        description: "As informações do documento foram atualizadas com sucesso.",
      });

      // Reset form
      setFile(null);
      setDocumentType('artigo_cientifico');
      setEquipmentId('');
      setIsEditing(false);
      setExtractedData({});
      setUploadState({ status: 'idle', message: '' });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'processing':
        return <Brain className="h-5 w-5 text-purple-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const isProcessing = uploadState.status === 'uploading' || uploadState.status === 'processing';

  return (
    <div className="space-y-6">
      {/* Document Type Selection */}
      <Card className="aurora-glass-enhanced border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            Tipo de Documento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documentTypes.map((type) => (
              <Button
                key={type.value}
                variant={documentType === type.value ? "default" : "outline"}
                className={`h-auto p-4 justify-start ${
                  documentType === type.value
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white aurora-glow'
                    : 'aurora-glass-enhanced border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setDocumentType(type.value as DocumentTypeEnum)}
                disabled={isProcessing}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="text-lg">{type.icon}</div>
                  <span className="font-medium">{type.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Selection */}
      <Card className="aurora-glass-enhanced border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white">Equipamento (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={equipmentId} onValueChange={setEquipmentId} disabled={isProcessing}>
            <SelectTrigger className="aurora-input">
              <SelectValue placeholder="Selecione um equipamento (opcional)" />
            </SelectTrigger>
            <SelectContent className="aurora-glass-enhanced border-slate-600">
              <SelectItem value="none" className="text-white hover:bg-slate-700">
                Nenhum equipamento
              </SelectItem>
              {equipments?.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id} className="text-white hover:bg-slate-700">
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="aurora-glass-enhanced border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            Upload do Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-white mb-2 block">
              Selecione o arquivo PDF
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="aurora-input file:bg-slate-700 file:text-white file:border-0"
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 rounded-lg aurora-glass-enhanced border border-slate-600">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-300 text-sm">{file.name}</span>
              <Badge variant="secondary" className="ml-auto">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            </div>
          )}

          {uploadState.status !== 'idle' && (
            <div className="flex items-center gap-3 p-4 rounded-lg aurora-glass-enhanced border border-slate-600">
              {getStatusIcon()}
              <span className="text-slate-300">{uploadState.message}</span>
            </div>
          )}

          {!isEditing && (
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white aurora-glow"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadState.status === 'uploading' ? 'Enviando...' : 'Processando...'}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload e Processar
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Campos Editáveis após Processamento */}
      {isEditing && (
        <Card className="aurora-glass-enhanced border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-green-400" />
              Editar Informações Extraídas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-title" className="text-white mb-2 block">
                Título
              </Label>
              <Input
                id="edit-title"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="aurora-input"
                placeholder="Título do documento"
              />
            </div>

            <div>
              <Label htmlFor="edit-authors" className="text-white mb-2 block">
                Autores (separados por vírgula)
              </Label>
              <Input
                id="edit-authors"
                value={editableAuthors}
                onChange={(e) => setEditableAuthors(e.target.value)}
                className="aurora-input"
                placeholder="Autor 1, Autor 2, Autor 3"
              />
            </div>

            <div>
              <Label htmlFor="edit-keywords" className="text-white mb-2 block">
                Palavras-chave (separadas por vírgula)
              </Label>
              <Input
                id="edit-keywords"
                value={editableKeywords}
                onChange={(e) => setEditableKeywords(e.target.value)}
                className="aurora-input"
                placeholder="palavra1, palavra2, palavra3"
              />
            </div>

            <div>
              <Label htmlFor="edit-summary" className="text-white mb-2 block">
                Resumo/Abstract
              </Label>
              <Textarea
                id="edit-summary"
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                className="aurora-textarea"
                placeholder="Resumo ou abstract do documento"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSaveChanges}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white aurora-glow"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Info */}
      {!isEditing && (
        <Card className="aurora-glass-enhanced border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="text-center text-slate-400 text-sm">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <p className="font-medium text-slate-300 mb-1">Processamento Inteligente</p>
              <p>
                A IA irá extrair automaticamente o título, autores, palavras-chave e conteúdo do documento.
                {documentType === 'artigo_cientifico' && (
                  <span className="block mt-1 text-cyan-400">
                    Para artigos científicos, título e autores são obrigatórios.
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
