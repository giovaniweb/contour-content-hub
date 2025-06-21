import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEquipments } from '@/hooks/useEquipments'; // Assuming this hook fetches equipments
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
// Assuming DocumentTypeEnum matches the SQL ENUM 'document_type_enum'
// This should ideally be generated from your DB schema or shared types
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
    .refine((files) => files?.[0]?.size <= 50 * 1024 * 1024, 'O arquivo não pode exceder 50MB.'), // 50MB limit
});

type IntelligentUploadFormValues = z.infer<typeof formSchema>;

interface UploadProgress {
  step: 'idle' | 'uploading_storage' | 'creating_record' | 'triggering_function' | 'success' | 'error';
  message: string;
  documentId?: string;
  fileName?: string;
}

export const IntelligentUploadForm: React.FC = () => {
  const { user } = useAuth();
  const { equipments, isLoading: isLoadingEquipments } = useEquipments(); // Fetching equipment
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
      toast({ variant: 'destructive', title: 'Erro de Autenticação', description: 'Você precisa estar logado para enviar documentos.' });
      setUploadProgress({ step: 'error', message: 'Usuário não autenticado.' });
      return;
    }

    const fileToUpload = data.file[0];
    const fileName = `${user.id}/${Date.now()}_${fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    setUploadProgress({ step: 'uploading_storage', message: `Enviando ${fileToUpload.name} para o armazenamento...`, fileName: fileToUpload.name });

    try {
      // 1. Upload to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('documents') // Bucket name from your migration
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        throw new Error(`Falha ao enviar arquivo para o armazenamento: ${uploadError.message}`);
      }
      const filePath = uploadResult?.path;
      if (!filePath) {
        throw new Error('Caminho do arquivo não retornado pelo armazenamento.');
      }
      setUploadProgress(prev => ({ ...prev, step: 'creating_record', message: 'Arquivo enviado. Criando registro do documento...' }));

      // 2. Create record in unified_documents
      const documentRecord = {
        tipo_documento: data.tipo_documento,
        user_id: user.id,
        file_path: filePath,
        equipamento_id: data.equipamento_id || null,
        status_processamento: 'pendente', // Initial status
        titulo_extraido: fileToUpload.name.replace(/\.pdf$/i, ''), // Temporary title from filename
      };

      const { data: newDocument, error: insertError } = await supabase
        .from('unified_documents')
        .insert(documentRecord)
        .select('id, tipo_documento, titulo_extraido')
        .single();

      if (insertError || !newDocument) {
        console.error('DB Insert Error:', insertError);
        // Attempt to delete orphaned file from storage if DB insert fails
        await supabase.storage.from('documents').remove([filePath]);
        throw new Error(`Falha ao criar registro do documento no banco: ${insertError?.message}`);
      }
      setUploadProgress(prev => ({
        ...prev,
        step: 'triggering_function',
        message: `Registro criado (ID: ${newDocument.id}). Disparando processamento...`,
        documentId: newDocument.id
      }));

      // 3. Invoke 'process-document' Supabase function
      const { error: functionError } = await supabase.functions.invoke('process-document', {
        body: { documentId: newDocument.id },
      });

      if (functionError) {
        console.error('Function Invoke Error:', functionError);
        // Update status to 'falhou' if function invocation fails immediately
        await supabase.from('unified_documents').update({ status_processamento: 'falhou', detalhes_erro: `Falha ao iniciar o processamento: ${functionError.message}`}).eq('id', newDocument.id);
        throw new Error(`Falha ao disparar a função de processamento: ${functionError.message}`);
      }

      setUploadProgress(prev => ({
        ...prev,
        step: 'success',
        message: `Processamento do documento '${newDocument.titulo_extraido}' (Tipo: ${newDocument.tipo_documento}) iniciado. Você pode acompanhar o status na sua lista de documentos.`
      }));
      toast({ title: 'Upload Concluído', description: `O documento '${fileToUpload.name}' foi enviado e o processamento foi iniciado.` });
      reset(); // Reset form after successful submission

    } catch (error: any) {
      console.error('Intelligent Upload Error:', error);
      setUploadProgress(prev => ({
        ...prev,
        step: 'error',
        message: error.message || 'Ocorreu um erro inesperado durante o upload.'
      }));
      toast({ variant: 'destructive', title: 'Erro no Upload', description: error.message });
    }
  };

  const getProgressIcon = () => {
    switch (uploadProgress.step) {
      case 'uploading_storage':
      case 'creating_record':
      case 'triggering_function':
        return <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="mr-2 h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="mr-2 h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="tipo_documento" className="text-slate-300">Tipo do Documento</Label>
        <Controller
          name="tipo_documento"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="tipo_documento" className="mt-1 bg-slate-700 border-slate-600 text-white focus:ring-cyan-500">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                {DocumentTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-slate-700 focus:bg-slate-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.tipo_documento && <p className="mt-1 text-xs text-red-400">{errors.tipo_documento.message}</p>}
      </div>

      <div>
        <Label htmlFor="equipamento_id" className="text-slate-300">Equipamento (Opcional)</Label>
        <Controller
          name="equipamento_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value || ""} disabled={isLoadingEquipments}>
              <SelectTrigger id="equipamento_id" className="mt-1 bg-slate-700 border-slate-600 text-white focus:ring-cyan-500">
                <SelectValue placeholder={isLoadingEquipments ? "Carregando equipamentos..." : "Selecione um equipamento (opcional)"} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="" className="hover:bg-slate-700 focus:bg-slate-700">Nenhum</SelectItem>
                {equipments.map(equip => (
                  <SelectItem key={equip.id} value={equip.id} className="hover:bg-slate-700 focus:bg-slate-700">
                    {equip.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.equipamento_id && <p className="mt-1 text-xs text-red-400">{errors.equipamento_id.message}</p>}
      </div>

      <div>
        <Label htmlFor="file" className="text-slate-300">Arquivo PDF</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md bg-slate-700/50 hover:border-cyan-500 transition-colors">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
            <div className="flex text-sm text-slate-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-cyan-500"
              >
                <span>Carregar um arquivo</span>
                <input id="file-upload" type="file" className="sr-only" {...register('file')} accept="application/pdf" />
              </label>
              <p className="pl-1">ou arraste e solte</p>
            </div>
            <p className="text-xs text-slate-500">PDF até 50MB</p>
            {selectedFile && selectedFile[0] && (
              <p className="text-xs text-green-400 pt-2">Selecionado: {selectedFile[0].name}</p>
            )}
          </div>
        </div>
        {errors.file && <p className="mt-1 text-xs text-red-400">{errors.file.message}</p>}
      </div>

      {uploadProgress.step !== 'idle' && (
        <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${
            uploadProgress.step === 'error' ? 'bg-red-900/30 text-red-300 border border-red-700/50' :
            uploadProgress.step === 'success' ? 'bg-green-900/30 text-green-300 border border-green-700/50' :
            'bg-blue-900/30 text-blue-300 border border-blue-700/50'
          }`}
        >
          {getProgressIcon()}
          <div>
            <p className="font-semibold">
              {uploadProgress.step === 'uploading_storage' ? `Enviando '${uploadProgress.fileName}'...` :
               uploadProgress.step === 'creating_record' ? 'Criando registro...' :
               uploadProgress.step === 'triggering_function' ? 'Iniciando processamento...' :
               uploadProgress.step === 'success' ? 'Sucesso!' :
               uploadProgress.step === 'error' ? 'Falha no Upload' :
               'Progresso do Upload'}
            </p>
            <p className="text-xs">{uploadProgress.message}</p>
            {uploadProgress.documentId && uploadProgress.step !== 'error' && (
              <p className="text-xs mt-1">ID do Documento: {uploadProgress.documentId}</p>
            )}
          </div>
        </div>
      )}


      <Button
        type="submit"
        disabled={isSubmitting || (uploadProgress.step !== 'idle' && uploadProgress.step !== 'success' && uploadProgress.step !== 'error')}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting || (uploadProgress.step !== 'idle' && uploadProgress.step !== 'success' && uploadProgress.step !== 'error') ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <FileText className="mr-2 h-5 w-5" />
        )}
        {isSubmitting ? 'Enviando...' : 'Enviar e Processar Documento'}
      </Button>
       {uploadProgress.step === 'success' && (
         <Button
            type="button"
            variant="outline"
            onClick={() => {
                reset();
                setUploadProgress({step: 'idle', message: ''});
            }}
            className="w-full mt-3 text-cyan-400 border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
            Enviar Outro Documento
        </Button>
       )}
    </form>
  );
};
