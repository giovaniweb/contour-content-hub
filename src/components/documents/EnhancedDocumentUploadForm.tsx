
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp, Upload, CheckCircle, X, AlertCircle } from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useEquipments } from '@/hooks/useEquipments';
import { DocumentUploadForm as DocumentFormData } from '@/types/document';
import { filterValidEquipments } from '@/utils/equipmentValidation';
import { useToast } from '@/hooks/use-toast';

const documentFormSchema = z.object({
  titulo: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  descricao: z.string().optional(),
  tipo: z.enum(['artigo_cientifico', 'ficha_tecnica', 'protocolo', 'outro'] as const),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default('pt'),
});

interface EnhancedDocumentUploadFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const EnhancedDocumentUploadForm: React.FC<EnhancedDocumentUploadFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { uploadDocument, isUploading, uploadProgress } = useDocumentUpload();
  const { equipments } = useEquipments();
  const { toast } = useToast();
  
  // Filter equipments to prevent Select.Item errors
  const validEquipments = filterValidEquipments(equipments);
  
  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      tipo: 'artigo_cientifico',
      equipamento_id: undefined,
      idioma_original: 'pt',
    },
  });

  const validateFile = (file: File): string | null => {
    if (!file) {
      return 'Nenhum arquivo selecionado';
    }
    
    if (file.type !== 'application/pdf') {
      return 'Por favor, selecione apenas arquivos PDF';
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'O arquivo deve ter no máximo 10MB';
    }
    
    return null;
  };

  const handleFileChange = (file: File | null) => {
    setFileError(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      toast({
        title: "Arquivo inválido",
        description: error,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Auto-fill title from filename
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
    if (!form.getValues('titulo')) {
      form.setValue('titulo', nameWithoutExt);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    form.setValue('titulo', '');
  };

  const onSubmit = async (data: z.infer<typeof documentFormSchema>) => {
    if (!selectedFile) {
      const error = 'Por favor, selecione um arquivo PDF';
      setFileError(error);
      toast({
        title: "Erro",
        description: error,
        variant: "destructive"
      });
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setFileError(validationError);
      toast({
        title: "Arquivo inválido",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    const formData: DocumentFormData = {
      titulo: data.titulo,
      descricao: data.descricao || '',
      tipo: data.tipo,
      equipamento_id: data.equipamento_id && data.equipamento_id !== 'none' ? data.equipamento_id : undefined,
      idioma_original: data.idioma_original,
      file: selectedFile
    };

    const documentId = await uploadDocument(formData);
    
    if (documentId) {
      form.reset();
      setSelectedFile(null);
      setFileError(null);
      onSuccess();
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

      <div className="relative z-10 max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Adicionar Novo Documento
          </h2>
          <p className="text-slate-300">Faça upload de um documento científico para sua biblioteca</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-2">
              <FormLabel className="text-slate-100">Arquivo PDF</FormLabel>
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
                    dragActive 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-cyan-500/30 bg-slate-800/30 hover:border-cyan-400/50 hover:bg-slate-700/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                    <FileUp className="h-12 w-12 text-cyan-400 mb-4" />
                    <p className="text-lg font-medium text-slate-100 mb-2">
                      Arraste e solte seu PDF aqui
                    </p>
                    <p className="text-sm text-slate-400 mb-4">
                      ou clique para selecionar um arquivo
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                      disabled={isUploading}
                    >
                      Selecionar PDF
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="border rounded-xl p-4 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="font-medium text-slate-100">{selectedFile.name}</p>
                        <p className="text-sm text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={isUploading}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {fileError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-500/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">{fileError}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2 p-4 bg-slate-800/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Enviando documento...</span>
                  <span className="text-cyan-400">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Form Fields */}
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-100">Título do Documento</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Eficácia do tratamento XYZ..."
                      className="bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm"
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-100">Descrição/Resumo</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva brevemente o conteúdo deste documento"
                      className="h-24 bg-slate-800/50 border-cyan-500/30 text-slate-100 placeholder:text-slate-400 rounded-xl backdrop-blur-sm resize-none"
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-100">Tipo de Documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isUploading}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-100 rounded-xl backdrop-blur-sm">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-cyan-500/30">
                        <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                        <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                        <SelectItem value="protocolo">Protocolo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipamento_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-100">Equipamento Relacionado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isUploading}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-100 rounded-xl backdrop-blur-sm">
                          <SelectValue placeholder="Selecione um equipamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-cyan-500/30">
                        <SelectItem value="none">Nenhum</SelectItem>
                        {validEquipments.map(equipment => (
                          <SelectItem key={equipment.id} value={equipment.id}>
                            {equipment.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idioma_original"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-100">Idioma Original</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isUploading}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-100 rounded-xl backdrop-blur-sm">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">Inglês</SelectItem>
                      <SelectItem value="es">Espanhol</SelectItem>
                      <SelectItem value="fr">Francês</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isUploading}
                  className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 rounded-xl"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 rounded-xl"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Enviando...' : 'Enviar Documento'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EnhancedDocumentUploadForm;
