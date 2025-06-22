
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileUploader } from '@/components/admin/article-form/FileUploader';
import { supabase } from '@/integrations/supabase/client';
import { processFileContent, uploadFileToStorage } from '@/services/documentProcessing';
import { processExistingDocument } from '@/services/documentProcessing';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Save,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ExtractedData {
  title: string | null;
  conclusion: string | null;
  keywords: string[] | null;
  researchers: string[] | null;
  error?: string | null;
}

export const IntelligentUploadForm: React.FC = () => {
  // Estados do formulário
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'form'>('upload');
  
  // Estados de processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState(false);
  
  // Estados dos dados extraídos
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    autores: [] as string[],
    palavrasChave: [] as string[],
    resumo: '',
    tipoDocumento: 'artigo_cientifico' as string,
    equipamentoId: '',
    thumbnailFile: null as File | null
  });
  
  // Estados de rascunho
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();

  // Auto-save do rascunho a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.titulo || formData.resumo || formData.autores.length > 0) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  // Salvar rascunho
  const saveDraft = useCallback(async () => {
    try {
      if (!formData.titulo && !formData.resumo && formData.autores.length === 0) {
        return; // Não salva rascunho vazio
      }

      const draftData = {
        tipo_documento: formData.tipoDocumento,
        titulo_extraido: formData.titulo || null,
        autores: formData.autores,
        palavras_chave: formData.palavrasChave,
        texto_completo: formData.resumo || null,
        equipamento_id: formData.equipamentoId || null,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status_processamento: 'pendente' as const,
        file_path: fileUrl,
        updated_at: new Date().toISOString()
      };

      if (draftId) {
        // Atualizar rascunho existente
        const { error } = await supabase
          .from('unified_documents')
          .update(draftData)
          .eq('id', draftId);

        if (error) throw error;
      } else {
        // Criar novo rascunho
        const { data, error } = await supabase
          .from('unified_documents')
          .insert(draftData)
          .select()
          .single();

        if (error) throw error;
        setDraftId(data.id);
      }

      setLastSaved(new Date());
      console.log('💾 Rascunho salvo automaticamente');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  }, [formData, draftId, fileUrl]);

  // Processar arquivo
  const handleProcessFile = async (): Promise<boolean> => {
    if (!file) {
      setUploadError('Nenhum arquivo selecionado');
      return false;
    }

    try {
      setIsProcessing(true);
      setUploadError(null);
      setProcessingFailed(false);
      setProcessingProgress('Fazendo upload do arquivo...');

      // 1. Upload do arquivo
      console.log('📤 Iniciando upload do arquivo...');
      setIsUploading(true);
      
      const uploadedUrl = await uploadFileToStorage(file);
      setFileUrl(uploadedUrl);
      setIsUploading(false);
      
      setProcessingProgress('Extraindo informações do documento...');

      // 2. Converter arquivo para base64 para processamento
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Remover prefixo data:application/pdf;base64,
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 3. Processar conteúdo
      console.log('🔄 Processando conteúdo do arquivo...');
      const extracted = await processFileContent(fileContent);
      
      if (extracted.error) {
        throw new Error(extracted.error);
      }

      setExtractedData(extracted);

      // 4. Preencher formulário com dados extraídos
      setFormData(prev => ({
        ...prev,
        titulo: extracted.title || '',
        autores: extracted.researchers || [],
        palavrasChave: extracted.keywords || [],
        resumo: extracted.conclusion || ''
      }));

      setProcessingProgress('Processamento concluído com sucesso!');
      
      toast({
        title: 'Arquivo processado',
        description: 'As informações foram extraídas e podem ser editadas.',
      });

      return true;
    } catch (error: any) {
      console.error('Erro no processamento:', error);
      setProcessingFailed(true);
      setUploadError(error.message || 'Erro ao processar arquivo');
      
      toast({
        variant: 'destructive',
        title: 'Erro no processamento',
        description: error.message || 'Não foi possível processar o arquivo.',
      });
      
      return false;
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
    }
  };

  // Reprocessar arquivo
  const handleReprocess = async () => {
    if (!draftId) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Documento não encontrado para reprocessamento.',
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingProgress('Reprocessando documento...');

      const success = await processExistingDocument(draftId);
      
      if (success) {
        toast({
          title: 'Reprocessamento concluído',
          description: 'O documento foi reprocessado com sucesso.',
        });
        
        // Recarregar dados do documento
        const { data, error } = await supabase
          .from('unified_documents')
          .select('*')
          .eq('id', draftId)
          .single();

        if (!error && data) {
          setFormData(prev => ({
            ...prev,
            titulo: data.titulo_extraido || '',
            autores: data.autores || [],
            palavrasChave: data.palavras_chave || [],
            resumo: data.texto_completo || ''
          }));
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no reprocessamento',
        description: error.message || 'Não foi possível reprocessar o documento.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Salvar documento final
  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!formData.titulo.trim()) {
        toast({
          variant: 'destructive',
          title: 'Título obrigatório',
          description: 'Por favor, insira um título para o documento.',
        });
        return;
      }

      // Salvar como rascunho primeiro
      await saveDraft();

      if (draftId) {
        // Atualizar status para concluído
        const { error } = await supabase
          .from('unified_documents')
          .update({ 
            status_processamento: 'concluido',
            updated_at: new Date().toISOString()
          })
          .eq('id', draftId);

        if (error) throw error;
      }

      toast({
        title: 'Documento salvo',
        description: 'O documento foi salvo com sucesso na biblioteca.',
      });

      // Reset do formulário
      setFile(null);
      setFileUrl(null);
      setFormData({
        titulo: '',
        autores: [],
        palavrasChave: [],
        resumo: '',
        tipoDocumento: 'artigo_cientifico',
        equipamentoId: '',
        thumbnailFile: null
      });
      setExtractedData(null);
      setDraftId(null);
      setLastSaved(null);
      setUploadStep('upload');

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar o documento.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset dos dados
  const handleReset = () => {
    setFile(null);
    setFileUrl(null);
    setFormData({
      titulo: '',
      autores: [],
      palavrasChave: [],
      resumo: '',
      tipoDocumento: 'artigo_cientifico',
      equipamentoId: '',
      thumbnailFile: null
    });
    setExtractedData(null);
    setUploadError(null);
    setProcessingProgress(null);
    setProcessingFailed(false);
    setDraftId(null);
    setLastSaved(null);
    setUploadStep('upload');
  };

  // Adicionar autor
  const addAuthor = (author: string) => {
    if (author.trim() && !formData.autores.includes(author.trim())) {
      setFormData(prev => ({
        ...prev,
        autores: [...prev.autores, author.trim()]
      }));
    }
  };

  // Remover autor
  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      autores: prev.autores.filter((_, i) => i !== index)
    }));
  };

  // Adicionar palavra-chave
  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.palavrasChave.includes(keyword.trim())) {
      setFormData(prev => ({
        ...prev,
        palavrasChave: [...prev.palavrasChave, keyword.trim()]
      }));
    }
  };

  // Remover palavra-chave
  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      palavrasChave: prev.palavrasChave.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Indicador de Progresso */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${uploadStep === 'upload' ? 'text-cyan-400' : 'text-green-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'upload' ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-green-500/20 border-2 border-green-500'}`}>
              {uploadStep === 'upload' ? '1' : <CheckCircle className="h-5 w-5" />}
            </div>
            <span className="font-medium">Upload</span>
          </div>
          <div className={`w-12 h-px ${uploadStep === 'form' ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
          <div className={`flex items-center space-x-2 ${uploadStep === 'form' ? 'text-cyan-400' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'form' ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-slate-700 border-2 border-slate-600'}`}>
              2
            </div>
            <span className="font-medium">Dados</span>
          </div>
        </div>

        {lastSaved && (
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <Save className="h-3 w-3" />
            <span>Salvo {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {uploadStep === 'upload' ? (
        // Etapa 1: Upload do arquivo
        <Card className="aurora-card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 aurora-text-gradient-enhanced">
              <Upload className="h-5 w-5" />
              <span>Upload de Documento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader
              file={file}
              setFile={setFile}
              fileUrl={fileUrl}
              setFileUrl={setFileUrl}
              isProcessing={isProcessing}
              uploadError={uploadError}
              processingProgress={processingProgress}
              processingFailed={processingFailed}
              onProcessFile={handleProcessFile}
              onSetUploadStep={setUploadStep}
              onResetData={handleReset}
            />
          </CardContent>
        </Card>
      ) : (
        // Etapa 2: Formulário de dados
        <div className="space-y-6">
          {/* Informações Extraídas */}
          {extractedData && (
            <Card className="aurora-card-enhanced border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-400">
                  <Sparkles className="h-5 w-5" />
                  <span>Informações Extraídas Automaticamente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-slate-300">Título:</strong>
                    <p className="text-slate-400 mt-1">{extractedData.title || 'Não detectado'}</p>
                  </div>
                  <div>
                    <strong className="text-slate-300">Autores:</strong>
                    <p className="text-slate-400 mt-1">
                      {extractedData.researchers?.join(', ') || 'Não detectados'}
                    </p>
                  </div>
                </div>
                {extractedData.keywords && extractedData.keywords.length > 0 && (
                  <div>
                    <strong className="text-slate-300">Palavras-chave:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {extractedData.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-600/30 text-green-300">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReprocess}
                    disabled={isProcessing}
                    className="aurora-button-enhanced border-blue-500/70 text-blue-400"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Reprocessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulário Principal */}
          <Card className="aurora-card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 aurora-text-gradient-enhanced">
                <FileText className="h-5 w-5" />
                <span>Informações do Documento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipo de Documento */}
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-slate-200">Tipo de Documento *</Label>
                <Select
                  value={formData.tipoDocumento}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipoDocumento: value }))}
                >
                  <SelectTrigger className="aurora-input">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
                    <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                    <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                    <SelectItem value="protocolo">Protocolo</SelectItem>
                    <SelectItem value="folder_publicitario">Folder Publicitário</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-slate-200">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Digite o título do documento"
                  className="aurora-input"
                />
              </div>

              {/* Autores */}
              <div className="space-y-2">
                <Label className="text-slate-200">Autores</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o nome do autor e pressione Enter"
                    className="aurora-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addAuthor(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                {formData.autores.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.autores.map((author, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-600/30 text-blue-300 cursor-pointer hover:bg-red-600/30 hover:text-red-300"
                        onClick={() => removeAuthor(index)}
                      >
                        {author} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Palavras-chave */}
              <div className="space-y-2">
                <Label className="text-slate-200">Palavras-chave</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma palavra-chave e pressione Enter"
                    className="aurora-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                {formData.palavrasChave.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.palavrasChave.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-600/30 text-purple-300 cursor-pointer hover:bg-red-600/30 hover:text-red-300"
                        onClick={() => removeKeyword(index)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo/Conclusão */}
              <div className="space-y-2">
                <Label htmlFor="resumo" className="text-slate-200">Resumo/Conclusão</Label>
                <Textarea
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) => setFormData(prev => ({ ...prev, resumo: e.target.value }))}
                  placeholder="Digite um resumo ou a conclusão principal do documento"
                  rows={4}
                  className="aurora-textarea"
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep('upload')}
                  className="aurora-button-enhanced border-slate-500/70 text-slate-400"
                >
                  Voltar
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="aurora-button-enhanced border-slate-500/70 text-slate-400"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetar
                  </Button>

                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !formData.titulo.trim()}
                    className="aurora-button-enhanced bg-gradient-to-r from-cyan-500 to-purple-500"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Documento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
