
import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentTypeEnum } from '@/types/document';
import { useEquipments } from '@/hooks/useEquipments';

interface UploadState {
  uploading: boolean;
  processing: boolean;
  success: boolean;
  error: string | null;
  progress: number;
}

const IntelligentUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentTypeEnum>('artigo_cientifico');
  const [equipmentId, setEquipmentId] = useState<string>('');
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    processing: false,
    success: false,
    error: null,
    progress: 0
  });

  const { toast } = useToast();
  const { equipments } = useEquipments();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadState(prev => ({ ...prev, error: null, success: false }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione um arquivo para fazer upload'
      });
      return;
    }

    try {
      setUploadState(prev => ({ ...prev, uploading: true, error: null, progress: 0 }));

      // 1. Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // 2. Upload file to storage
      setUploadState(prev => ({ ...prev, progress: 25 }));
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = `${userData.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Create document record
      setUploadState(prev => ({ ...prev, progress: 50 }));
      const { data: documentData, error: insertError } = await supabase
        .from('unified_documents')
        .insert({
          tipo_documento: documentType,
          equipamento_id: equipmentId || null,
          user_id: userData.user.id,
          file_path: filePath,
          status_processamento: 'pendente'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Process document with AI
      setUploadState(prev => ({ ...prev, uploading: false, processing: true, progress: 75 }));
      
      const { error: processError } = await supabase.functions.invoke('process-document', {
        body: { 
          documentId: documentData.id,
          forceRefresh: true
        }
      });

      if (processError) {
        console.warn('Erro no processamento, mas documento foi salvo:', processError);
        // Não joga erro aqui pois o documento foi salvo
      }

      setUploadState(prev => ({ 
        ...prev, 
        processing: false, 
        success: true, 
        progress: 100 
      }));

      toast({
        title: 'Upload concluído!',
        description: 'Documento enviado e está sendo processado.'
      });

      // Reset form
      setFile(null);
      setDocumentType('artigo_cientifico');
      setEquipmentId('');

    } catch (error: any) {
      console.error('Erro no upload:', error);
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        processing: false, 
        error: error.message 
      }));
      
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message
      });
    }
  };

  const isLoading = uploadState.uploading || uploadState.processing;

  return (
    <div className="space-y-6 p-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          aurora-glass-enhanced border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 hover:border-cyan-400/50
          ${isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/30'}
          ${file ? 'border-green-400 bg-green-500/10' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {file ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-400" />
              <div>
                <p className="text-lg font-medium text-slate-100">{file.name}</p>
                <p className="text-sm text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-cyan-400" />
              <div>
                <p className="text-lg font-medium text-slate-100">
                  {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
                </p>
                <p className="text-sm text-slate-400">
                  PDF, DOC, DOCX até 50MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="document-type" className="text-slate-300">
            Tipo de Documento
          </Label>
          <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentTypeEnum)}>
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

        <div className="space-y-2">
          <Label htmlFor="equipment" className="text-slate-300">
            Equipamento (Opcional)
          </Label>
          <Select value={equipmentId} onValueChange={setEquipmentId}>
            <SelectTrigger className="aurora-input">
              <SelectValue placeholder="Selecione um equipamento" />
            </SelectTrigger>
            <SelectContent className="aurora-glass-enhanced border-cyan-500/30">
              <SelectItem value="">Nenhum equipamento</SelectItem>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">
              {uploadState.uploading ? 'Enviando arquivo...' : 'Processando com IA...'}
            </span>
            <span className="text-cyan-400">{uploadState.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadState.error && (
        <div className="aurora-glass-enhanced border border-red-500/50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300">{uploadState.error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadState.success && (
        <div className="aurora-glass-enhanced border border-green-500/50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-green-300">Documento enviado com sucesso!</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="w-full aurora-button-enhanced bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {uploadState.uploading ? 'Enviando...' : 'Processando...'}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Enviar Documento
          </>
        )}
      </Button>
    </div>
  );
};

export default IntelligentUploadForm;
