
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { processFileContent, ExtractedDocumentData } from '@/services/documentProcessing';
import { useEquipments } from '@/hooks/useEquipments';

// Steps for the form
enum FormStep {
  UPLOAD = 'upload',
  PROCESSING = 'processing', 
  REVIEW = 'review',
  SAVING = 'saving',
  SUCCESS = 'success'
}

const ScientificArticleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { equipments } = useEquipments();
  
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.UPLOAD);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [processingError, setProcessingError] = useState<string>('');
  
  // Form data
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    equipamento_id: '',
    idioma_original: 'pt',
    keywords: [] as string[],
    researchers: [] as string[]
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo PDF."
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive", 
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 10MB."
      });
      return;
    }

    setSelectedFile(file);
    setCurrentStep(FormStep.PROCESSING);
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      setProcessingError('');
      
      const result = await processFileContent(file);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Falha no processamento');
      }

      // Update form data with extracted information
      setExtractedData(result.data);
      setFileUrl(result.fileUrl || '');
      setFormData(prev => ({
        ...prev,
        titulo: result.data?.title || '',
        descricao: result.data?.description || '',
        keywords: result.data?.keywords || [],
        researchers: result.data?.researchers || []
      }));

      setCurrentStep(FormStep.REVIEW);
      
      toast({
        title: "Processamento concluído",
        description: "Dados extraídos com sucesso do documento."
      });
    } catch (error: any) {
      console.error('Processing error:', error);
      setProcessingError(error.message);
      setCurrentStep(FormStep.UPLOAD);
      
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: error.message
      });
    }
  };

  const handleSave = async () => {
    try {
      setCurrentStep(FormStep.SAVING);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      const documentData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        equipamento_id: formData.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: formData.idioma_original,
        link_dropbox: fileUrl,
        arquivo_url: fileUrl,
        status: 'ativo',
        criado_por: user.user.id,
        keywords: formData.keywords,
        researchers: formData.researchers,
        conteudo_extraido: extractedData?.content || ''
      };

      const { error } = await supabase
        .from('documentos_tecnicos')
        .insert([documentData]);

      if (error) {
        throw error;
      }

      setCurrentStep(FormStep.SUCCESS);
      
      toast({
        title: "Artigo salvo com sucesso",
        description: "O artigo científico foi adicionado à biblioteca."
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/scientific-articles');
      }, 2000);

    } catch (error: any) {
      console.error('Save error:', error);
      setCurrentStep(FormStep.REVIEW);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message
      });
    }
  };

  const renderUploadStep = () => (
    <div className="text-center space-y-6">
      <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500/50 transition-colors">
        <FileText className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          Selecione um arquivo PDF
        </h3>
        <p className="text-slate-400 mb-4">
          Faça upload do artigo científico para extração automática dos dados
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload">
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
            <span className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar PDF
            </span>
          </Button>
        </label>
      </div>
      {processingError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{processingError}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          Processando documento...
        </h3>
        <p className="text-slate-400">
          Extraindo título, resumo, autores e palavras-chave
        </p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Título
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-slate-100"
            placeholder="Título do artigo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Equipamento
          </label>
          <select
            value={formData.equipamento_id}
            onChange={(e) => setFormData(prev => ({ ...prev, equipamento_id: e.target.value }))}
            className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-slate-100"
          >
            <option value="">Selecione um equipamento</option>
            {equipments.map(equipment => (
              <option key={equipment.id} value={equipment.id}>
                {equipment.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Descrição/Resumo
        </label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          rows={4}
          className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-slate-100"
          placeholder="Resumo do artigo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Autores ({formData.researchers.length})
          </label>
          <div className="bg-slate-800/30 rounded-xl p-4 max-h-32 overflow-y-auto">
            {formData.researchers.map((researcher, index) => (
              <div key={index} className="text-sm text-slate-300 mb-1">
                • {researcher}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Palavras-chave ({formData.keywords.length})
          </label>
          <div className="bg-slate-800/30 rounded-xl p-4 max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-lg text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setCurrentStep(FormStep.UPLOAD);
            setSelectedFile(null);
            setExtractedData(null);
          }}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Voltar
        </Button>
        <Button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          Salvar Artigo
        </Button>
      </div>
    </div>
  );

  const renderSavingStep = () => (
    <div className="text-center space-y-6">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          Salvando artigo...
        </h3>
        <p className="text-slate-400">
          Finalizando o cadastro
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          Artigo salvo com sucesso!
        </h3>
        <p className="text-slate-400">
          Redirecionando para a biblioteca...
        </p>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case FormStep.UPLOAD: return 'Upload do Documento';
      case FormStep.PROCESSING: return 'Processando';
      case FormStep.REVIEW: return 'Revisar Dados';
      case FormStep.SAVING: return 'Salvando';
      case FormStep.SUCCESS: return 'Concluído';
      default: return 'Cadastro de Artigo';
    }
  };

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
      <div className="relative z-10 container mx-auto py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/scientific-articles')}
            className="text-slate-300 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cadastrar Artigo Científico
            </h1>
            <p className="text-slate-400">Etapa: {getStepTitle()}</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl mx-auto bg-slate-800/30 backdrop-blur-sm border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-slate-100">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === FormStep.UPLOAD && renderUploadStep()}
            {currentStep === FormStep.PROCESSING && renderProcessingStep()}
            {currentStep === FormStep.REVIEW && renderReviewStep()}
            {currentStep === FormStep.SAVING && renderSavingStep()}
            {currentStep === FormStep.SUCCESS && renderSuccessStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScientificArticleFormPage;
