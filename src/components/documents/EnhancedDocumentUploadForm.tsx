
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
import { FileUp, Upload, CheckCircle, X } from 'lucide-react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useEquipments } from '@/hooks/useEquipments';
import { DocumentUploadForm as DocumentFormData } from '@/types/document';

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
  const { uploadDocument, isUploading, uploadProgress } = useDocumentUpload();
  const { equipments } = useEquipments();
  
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

  const handleFileChange = (file: File | null) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      
      // Auto-fill title from filename
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      if (!form.getValues('titulo')) {
        form.setValue('titulo', nameWithoutExt);
      }
    } else if (file) {
      alert('Por favor, selecione apenas arquivos PDF.');
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
    form.setValue('titulo', '');
  };

  const onSubmit = async (data: z.infer<typeof documentFormSchema>) => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo PDF.');
      return;
    }

    const formData: DocumentFormData = {
      titulo: data.titulo,
      descricao: data.descricao || '',
      tipo: data.tipo,
      equipamento_id: data.equipamento_id,
      idioma_original: data.idioma_original,
      file: selectedFile
    };

    const documentId = await uploadDocument(formData);
    
    if (documentId) {
      form.reset();
      setSelectedFile(null);
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-2">
            <FormLabel>Arquivo PDF</FormLabel>
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  <FileUp className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Arraste e solte seu PDF aqui
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou clique para selecionar um arquivo
                  </p>
                  <Button type="button" variant="outline">
                    Selecionar PDF
                  </Button>
                </label>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{selectedFile.name}</p>
                      <p className="text-sm text-green-700">
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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviando documento...</span>
                <span>{uploadProgress}%</span>
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
                <FormLabel>Título do Documento</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Eficácia do tratamento XYZ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição/Resumo</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Descreva brevemente o conteúdo deste documento"
                    className="h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="artigo_cientifico">Artigo Científico</SelectItem>
                      <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                      <SelectItem value="protocolo">Protocolo</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipamento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipamento Relacionado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {equipments.map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="idioma_original"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma Original</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                    <SelectItem value="fr">Francês</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isUploading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? 'Enviando...' : 'Enviar Documento'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedDocumentUploadForm;
