
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Loader2, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEquipments } from '@/hooks/useEquipments';

const formSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default('pt'),
});

type FormData = z.infer<typeof formSchema>;

interface ScientificArticleUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ScientificArticleUploadForm: React.FC<ScientificArticleUploadFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { equipments } = useEquipments();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      equipamento_id: undefined,
      idioma_original: 'pt',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Por favor, selecione apenas arquivos PDF.');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('O arquivo deve ter no máximo 50MB.');
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileExt = 'pdf';
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `articles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      setUploadError('Por favor, selecione um arquivo PDF.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Upload file to storage
      const fileUrl = await uploadFileToStorage(selectedFile);

      // Create document record
      const { error: insertError } = await supabase
        .from('documentos_tecnicos')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          tipo: 'artigo_cientifico',
          equipamento_id: data.equipamento_id || null,
          link_dropbox: fileUrl,
          idioma_original: data.idioma_original,
          status: 'ativo',
          criado_por: user.id,
        });

      if (insertError) {
        throw new Error(`Erro ao salvar documento: ${insertError.message}`);
      }

      toast({
        title: "Sucesso!",
        description: "Artigo científico cadastrado com sucesso.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Erro no upload:', error);
      setUploadError(error.message || 'Erro desconhecido no upload');
      toast({
        title: "Erro",
        description: "Não foi possível fazer o upload do artigo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* File Upload Section */}
        <div className="space-y-2">
          <Label htmlFor="file">Arquivo PDF *</Label>
          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:bg-slate-700/20 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-12 w-12 mx-auto text-cyan-400 mb-4" />
              <p className="text-slate-300 font-medium mb-2">Clique para selecionar um arquivo PDF</p>
              <p className="text-slate-400 text-sm">Máximo 50MB</p>
            </div>
          ) : (
            <div className="border border-cyan-500/30 rounded-xl p-4 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="font-medium text-slate-200">{selectedFile.name}</p>
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
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{uploadError}</p>
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input
            id="titulo"
            {...form.register('titulo')}
            placeholder="Ex: Efeitos da criofrequência na adiposidade localizada"
            className="bg-slate-800/50 border-cyan-500/30 text-slate-100"
          />
          {form.formState.errors.titulo && (
            <p className="text-red-400 text-sm">{form.formState.errors.titulo.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="descricao">Resumo/Descrição</Label>
          <Textarea
            id="descricao"
            {...form.register('descricao')}
            placeholder="Descreva brevemente o conteúdo do artigo"
            className="bg-slate-800/50 border-cyan-500/30 text-slate-100 h-24"
          />
        </div>

        {/* Equipment and Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Equipamento Relacionado</Label>
            <Select onValueChange={(value) => form.setValue('equipamento_id', value === 'none' ? undefined : value)}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-100">
                <SelectValue placeholder="Selecione um equipamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {equipments?.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Idioma Original</Label>
            <Select onValueChange={(value) => form.setValue('idioma_original', value)} defaultValue="pt">
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">Inglês</SelectItem>
                <SelectItem value="es">Espanhol</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-cyan-500/20">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Salvar Artigo
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ScientificArticleUploadForm;
