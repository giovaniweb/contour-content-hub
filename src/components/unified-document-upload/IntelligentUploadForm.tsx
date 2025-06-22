
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DocumentTypeEnum } from '@/types/document';
import { useEquipments } from '@/hooks/useEquipments';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Loader2, FileText, Save, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import FileUploader from '@/components/admin/article-form/FileUploader';

interface ExtractedData {
  title?: string;
  authors?: string[];
  keywords?: string[];
  content?: string;
}

export const IntelligentUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'form'>('upload');
  
  // Form fields
  const [documentType, setDocumentType] = useState<DocumentTypeEnum>('artigo_cientifico');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Extract and auto-save
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { equipments } = useEquipments();

  // Auto-save draft functionality
  useEffect(() => {
    if (title || description || authors.length > 0 || keywords.length > 0) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [title, description, authors, keywords, documentType, equipmentId]);

  const saveDraft = () => {
    const draftData = {
      documentType,
      title,
      authors,
      keywords,
      description,
      equipmentId,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('intelligent-upload-draft', JSON.stringify(draftData));
    setIsDraft(true);
    setLastSaved(new Date());
  };

  const loadDraft = () => {
    const draftData = localStorage.getItem('intelligent-upload-draft');
    if (draftData) {
      const draft = JSON.parse(draftData);
      setDocumentType(draft.documentType || 'artigo_cientifico');
      setTitle(draft.title || '');
      setAuthors(draft.authors || []);
      setKeywords(draft.keywords || []);
      setDescription(draft.description || '');
      setEquipmentId(draft.equipmentId || '');
      setIsDraft(true);
      setLastSaved(new Date(draft.savedAt));
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('intelligent-upload-draft');
    setIsDraft(false);
    setLastSaved(null);
  };

  // Load draft on component mount
  useEffect(() => {
    loadDraft();
  }, []);

  const resetData = () => {
    setFile(null);
    setFileUrl(null);
    setUploadError(null);
    setProcessingFailed(false);
    setProcessingProgress(null);
    setExtractedData(null);
  };

  const processFile = async (): Promise<boolean> => {
    if (!file) return false;

    setIsProcessing(true);
    setProcessingProgress('Fazendo upload do arquivo...');
    setUploadError(null);
    setProcessingFailed(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setProcessingProgress('Processamento concluído!');
        setFileUrl(result.fileUrl);
        
        // Auto-fill extracted data
        if (result.extracted) {
          setExtractedData(result.extracted);
          setTitle(result.extracted.title || '');
          setAuthors(result.extracted.authors || []);
          setKeywords(result.extracted.keywords || []);
          setDescription(result.extracted.content?.substring(0, 500) || '');
        }
        
        toast({
          title: 'Arquivo processado',
          description: 'O documento foi processado com sucesso e os dados foram extraídos.',
        });
        
        return true;
      } else {
        throw new Error(result.error || 'Falha no processamento');
      }
    } catch (error: any) {
      console.error('Erro no processamento:', error);
      setUploadError(error.message || 'Erro desconhecido no processamento');
      setProcessingFailed(true);
      
      toast({
        variant: 'destructive',
        title: 'Erro no processamento',
        description: error.message || 'Falha ao processar o arquivo',
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
      setAuthors([...authors, newAuthor.trim()]);
      setNewAuthor('');
    }
  };

  const removeAuthor = (author: string) => {
    setAuthors(authors.filter(a => a !== author));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: 'O título é obrigatório.',
      });
      return;
    }

    try {
      const documentData = {
        tipo_documento: documentType,
        titulo_extraido: title,
        autores: authors,
        palavras_chave: keywords,
        descricao: description,
        equipamento_id: equipmentId || null,
        file_path: fileUrl,
        status_processamento: fileUrl ? 'concluido' : 'pendente',
      };

      const response = await fetch('/api/create-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar documento');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Documento salvo',
          description: 'O documento foi salvo com sucesso na biblioteca.',
        });
        
        // Clear form and draft
        setTitle('');
        setAuthors([]);
        setKeywords([]);
        setDescription('');
        setEquipmentId('');
        setFile(null);
        setFileUrl(null);
        setExtractedData(null);
        clearDraft();
        setUploadStep('upload');
      }
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message || 'Falha ao salvar o documento',
      });
    }
  };

  if (uploadStep === 'upload') {
    return (
      <div className="space-y-6">
        {isDraft && lastSaved && (
          <Alert className="aurora-glass-enhanced border-yellow-500/30">
            <Clock className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Rascunho salvo automaticamente em {lastSaved.toLocaleTimeString()}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadStep('form')}
                className="ml-2 text-yellow-400 hover:text-yellow-300"
              >
                Continuar editando
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <FileUploader
          file={file}
          setFile={setFile}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
          isProcessing={isProcessing}
          uploadError={uploadError}
          processingProgress={processingProgress}
          processingFailed={processingFailed}
          onProcessFile={processFile}
          onSetUploadStep={setUploadStep}
          onResetData={resetData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Informações do Documento</h3>
          <p className="text-sm text-slate-400">
            {extractedData ? 'Dados extraídos automaticamente - você pode editá-los' : 'Preencha as informações do documento'}
          </p>
        </div>
        
        {isDraft && lastSaved && (
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <Save className="h-4 w-4" />
            Salvo {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {extractedData && (
        <Alert className="aurora-glass-enhanced border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            ✅ Dados extraídos automaticamente do PDF. Você pode revisar e editar as informações abaixo.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentType" className="text-slate-200">Tipo de Documento</Label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentTypeEnum)}>
              <SelectTrigger className="aurora-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
                <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                <SelectItem value="manual_tecnico">Manual Técnico</SelectItem>
                <SelectItem value="estudo_caso">Estudo de Caso</SelectItem>
                <SelectItem value="protocolo_tratamento">Protocolo de Tratamento</SelectItem>
                <SelectItem value="relatorio_pesquisa">Relatório de Pesquisa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title" className="text-slate-200">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="aurora-input"
              placeholder="Digite o título do documento"
            />
          </div>

          <div>
            <Label htmlFor="equipment" className="text-slate-200">Equipamento Relacionado</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger className="aurora-input">
                <SelectValue placeholder="Selecione um equipamento (opcional)" />
              </SelectTrigger>
              <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
                {equipments.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-200">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="aurora-textarea"
              placeholder="Adicione uma descrição ou resumo do documento"
              rows={4}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label className="text-slate-200">Autores</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Nome do autor"
                className="aurora-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addAuthor()}
              />
              <Button onClick={addAuthor} variant="outline" className="aurora-button-enhanced border-cyan-500/70 text-cyan-400">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {authors.map((author, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-600/30 text-blue-300 border border-blue-500/30">
                  {author}
                  <button onClick={() => removeAuthor(author)} className="ml-1 hover:text-red-300">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-slate-200">Palavras-chave</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Palavra-chave"
                className="aurora-input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} variant="outline" className="aurora-button-enhanced border-cyan-500/70 text-cyan-400">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:text-red-300">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="thumbnail" className="text-slate-200">Thumbnail (Opcional)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="aurora-input"
            />
            <p className="text-xs text-slate-500 mt-1">Imagem de capa para o documento (JPG, PNG)</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setUploadStep('upload')}
            className="aurora-button-enhanced border-slate-500/70 text-slate-400"
          >
            Voltar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearDraft}
            className="aurora-button-enhanced border-red-500/70 text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Rascunho
          </Button>
        </div>

        <Button 
          onClick={handleSubmit}
          className="aurora-button-enhanced bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Salvar Documento
        </Button>
      </div>
    </div>
  );
};
