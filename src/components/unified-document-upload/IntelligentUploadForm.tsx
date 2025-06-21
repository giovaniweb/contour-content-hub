
import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEquipments } from '@/hooks/useEquipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileText, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DocumentTypeOptions = [
  { value: 'artigo_cientifico', label: 'Artigo Científico' },
  { value: 'ficha_tecnica', label: 'Ficha Técnica' },
  { value: 'protocolo', label: 'Protocolo' },
  { value: 'folder_publicitario', label: 'Folder Publicitário' },
  { value: 'outro', label: 'Outro' },
] as const;

type DocumentTypeEnum = typeof DocumentTypeOptions[number]['value'];

const formSchema = z.object({
  tipo_documento: z.custom<DocumentTypeEnum>(
    (val) => DocumentTypeOptions.some(opt => opt.value === val),
    { message: "Tipo de documento inválido" }
  ),
  equipamento_id: z.string().uuid().optional().nullable(),
  file: z.instanceof(FileList)
    .refine((files) => files?.length === 1, 'É necessário enviar um arquivo.')
    .refine((files) => files?.[0]?.type === 'application/pdf', 'O arquivo deve ser um PDF.')
    .refine((files) => files?.[0]?.size <= 50 * 1024 * 1024, 'O arquivo não pode exceder 50MB.'),
});

type IntelligentUploadFormValues = z.infer<typeof formSchema>;

interface UploadProgress {
  step: 'idle' | 'uploading_storage' | 'creating_record' | 'triggering_function' | 'success' | 'error';
  message: string;
  documentId?: string;
  fileName?: string;
  processingResult?: any;
}

export const IntelligentUploadForm: React.FC = () => {
  const { user } = useAuth();
  const { equipments, isLoading: isLoadingEquipments } = useEquipments();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ step: 'idle', message: '' });

  const { control, handleSubmit, register, formState: { errors, isSubmitting }, watch, reset } = useForm<IntelligentUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_documento: 'artigo_cientifico',
      equipamento_id: null,
    },
  });

  const selectedFile = watch('file');

  const onSubmit = async (data: IntelligentUploadFormValues) => {
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para fazer upload de documentos.",
        variant: "destructive"
      });
      return;
    }

    const file = data.file[0];
    
    try {
      setUploadProgress({ step: 'uploading_storage', message: 'Enviando arquivo para storage...' });

      // 1. Upload para Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress({ step: 'creating_record', message: 'Criando registro no banco de dados...' });

      // 2. Criar registro em unified_documents
      const { data: insertedDoc, error: insertError } = await supabase
        .from('unified_documents')
        .insert({
          tipo_documento: data.tipo_documento,
          equipamento_id: data.equipamento_id || null,
          user_id: user.id,
          file_path: filePath,
          status_processamento: 'pendente',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploadProgress({ 
        step: 'triggering_function', 
        message: 'Processando documento com IA...',
        documentId: insertedDoc.id,
        fileName: file.name 
      });

      // 3. Chamar função de processamento
      const { data: processResult, error: processError } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: insertedDoc.id,
          forceRefresh: true,
          timestamp: Date.now()
        }
      });

      if (processError) {
        console.error('Erro no processamento:', processError);
        // Para tipos diferentes de artigo científico, continuamos mesmo com erro
        if (data.tipo_documento === 'artigo_cientifico') {
          throw new Error(`Falha no processamento: ${processError.message}`);
        }
      }

      setUploadProgress({ 
        step: 'success', 
        message: 'Documento processado com sucesso!',
        documentId: insertedDoc.id,
        fileName: file.name,
        processingResult: processResult
      });

      toast({
        title: "Upload Concluído",
        description: `${DocumentTypeOptions.find(opt => opt.value === data.tipo_documento)?.label} processado com sucesso!`
      });

      // Reset form após sucesso
      setTimeout(() => {
        reset();
        setUploadProgress({ step: 'idle', message: '' });
      }, 3000);

    } catch (error: any) {
      console.error('Erro no upload:', error);
      setUploadProgress({ 
        step: 'error', 
        message: error.message || 'Erro no processamento do documento' 
      });
      
      toast({
        title: "Erro no Upload",
        description: error.message || 'Ocorreu um erro durante o processamento.',
        variant: "destructive"
      });
    }
  };

  const handleReprocess = async () => {
    if (!uploadProgress.documentId) return;

    try {
      setUploadProgress(prev => ({ 
        ...prev, 
        step: 'triggering_function', 
        message: 'Reprocessando documento...' 
      }));

      const { error } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: uploadProgress.documentId,
          forceRefresh: true,
          timestamp: Date.now()
        }
      });

      if (error) throw error;

      setUploadProgress(prev => ({ 
        ...prev, 
        step: 'success', 
        message: 'Documento reprocessado com sucesso!' 
      }));

      toast({
        title: "Reprocessamento Concluído",
        description: "Documento reprocessado com sucesso!"
      });

    } catch (error: any) {
      console.error('Erro no reprocessamento:', error);
      toast({
        title: "Erro no Reprocessamento",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStepIcon = () => {
    switch (uploadProgress.step) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'idle':
        return <UploadCloud className="h-6 w-6 text-cyan-400" />;
      default:
        return <Loader2 className="h-6 w-6 text-cyan-400 animate-spin" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Upload Inteligente de Documentos
        </h2>
        <p className="text-slate-400">
          Envie PDFs e deixe nossa IA extrair as informações automaticamente
        </p>
      </div>

      {/* Progress Card */}
      {uploadProgress.step !== 'idle' && (
        <Card className="aurora-glass-enhanced border-cyan-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-white">
              {getStepIcon()}
              Status do Processamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-300">{uploadProgress.message}</p>
            
            {uploadProgress.fileName && (
              <p className="text-sm text-slate-400">
                Arquivo: {uploadProgress.fileName}
              </p>
            )}

            {uploadProgress.step === 'error' && uploadProgress.documentId && (
              <Button 
                onClick={handleReprocess}
                variant="outline"
                size="sm"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reprocessar Documento
              </Button>
            )}

            {uploadProgress.step === 'success' && uploadProgress.processingResult && (
              <div className="space-y-2">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Processamento Concluído
                </Badge>
                {uploadProgress.processingResult.title && (
                  <p className="text-sm text-slate-300">
                    <strong>Título:</strong> {uploadProgress.processingResult.title}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      {uploadProgress.step === 'idle' && (
        <Card className="aurora-glass-enhanced border-cyan-500/30">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de Documento */}
              <div className="space-y-3">
                <Label htmlFor="tipo_documento" className="text-white font-medium">
                  Tipo de Documento
                </Label>
                <Controller
                  name="tipo_documento"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="aurora-glass border-slate-600 text-white">
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                      <SelectContent className="aurora-glass border-slate-600">
                        {DocumentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tipo_documento && (
                  <p className="text-red-400 text-sm">{errors.tipo_documento.message}</p>
                )}
              </div>

              {/* Equipamento */}
              <div className="space-y-3">
                <Label htmlFor="equipamento_id" className="text-white font-medium">
                  Equipamento (Opcional)
                </Label>
                <Controller
                  name="equipamento_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <SelectTrigger className="aurora-glass border-slate-600 text-white">
                        <SelectValue placeholder="Vincular a um equipamento" />
                      </SelectTrigger>
                      <SelectContent className="aurora-glass border-slate-600">
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
                  )}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label htmlFor="file" className="text-white font-medium">
                  Arquivo PDF
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    {...register('file')}
                    className="aurora-glass border-slate-600 text-white file:bg-cyan-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                  />
                  {selectedFile && selectedFile[0] && (
                    <div className="mt-2 p-3 rounded-md bg-slate-800/50 border border-slate-600">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        <div>
                          <p className="text-white font-medium">{selectedFile[0].name}</p>
                          <p className="text-slate-400 text-sm">
                            {(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.file && (
                  <p className="text-red-400 text-sm">{errors.file.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Enviar e Processar Documento
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
