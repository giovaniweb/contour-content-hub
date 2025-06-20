
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, FileUp, File, X, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentType } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
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
  onCancel: () => void;
}

const EnhancedDocumentUploadForm: React.FC<EnhancedDocumentUploadFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<{ id: string; nome: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
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
  
  // Fetch equipment list
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');
          
        if (error) throw error;
        
        setEquipments(data || []);
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
      }
    };
    
    fetchEquipments();
  }, []);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
  };
  
  const removeFile = () => {
    setSelectedFile(null);
  };
  
  const onSubmit = async (data: z.infer<typeof documentFormSchema>) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      
      if (!selectedFile) {
        setUploadError('Selecione um arquivo para upload');
        return;
      }
      
      // Get the current user
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('documents')
        .upload(filePath, selectedFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Create entry in the database
      const { data: insertedData, error: insertError } = await supabase
        .from('documentos_tecnicos')
        .insert({
          titulo: data.titulo,
          descricao: data.descricao || null,
          tipo: data.tipo,
          equipamento_id: data.equipamento_id || null,
          link_dropbox: publicUrl,
          arquivo_url: publicUrl,
          idioma_original: data.idioma_original,
          status: 'processando',
          criado_por: userId,
        })
        .select('id')
        .single();
        
      if (insertError) {
        throw insertError;
      }

      if (!insertedData || !insertedData.id) {
        throw new Error('Falha ao obter o ID do documento recém-criado.');
      }
      
      const newDocumentId = insertedData.id;
      console.log(`Documento inserido com ID: ${newDocumentId}`);

      // Trigger document processing
      try {
        console.log(`Invocando a função 'process-document' para o documentId: ${newDocumentId}`);
        const { error: functionError } = await supabase.functions.invoke('process-document', {
          body: { documentId: newDocumentId },
        });

        if (functionError) {
          console.error(`Erro ao invocar a função 'process-document':`, functionError);
          toast({
            title: "Aviso",
            description: "Documento enviado, mas o processamento automático falhou. O documento pode precisar ser processado manualmente.",
            variant: "default",
          });
        } else {
          console.log(`Função 'process-document' invocada com sucesso para o documentId: ${newDocumentId}`);
          toast({
            title: "Sucesso",
            description: "Documento enviado e processamento iniciado com sucesso!",
            variant: "default",
          });
        }
      } catch (functionInvokeError: any) {
        console.error(`Erro ao invocar a função 'process-document':`, functionInvokeError);
        toast({
          title: "Aviso",
          description: "Documento enviado, mas o processamento automático falhou. O documento pode precisar ser processado manualmente.",
          variant: "default",
        });
      }
      
      // Success
      form.reset();
      setSelectedFile(null);
      onSuccess();
      
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      setUploadError(error.message || 'Erro ao fazer upload do documento');
      toast({
        title: "Erro",
        description: error.message || 'Erro ao fazer upload do documento',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      {uploadError && (
        <Alert variant="destructive" className="aurora-glass border border-red-500/30 aurora-glow-enhanced">
          <AlertTitle className="text-red-100">Erro</AlertTitle>
          <AlertDescription className="text-red-200">{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-aurora-electric-purple" />
                  Título do Documento
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Ex: Protocolo de tratamento para lipedema"
                    className="aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-100 placeholder:text-slate-400 focus:border-aurora-neon-blue/60 focus:ring-2 focus:ring-aurora-neon-blue/30 aurora-glow transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium">Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Descreva brevemente o conteúdo deste documento"
                    className="h-32 aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-100 placeholder:text-slate-400 focus:border-aurora-neon-blue/60 focus:ring-2 focus:ring-aurora-neon-blue/30 aurora-glow transition-all duration-300 resize-none"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium">Tipo de Documento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-100 focus:border-aurora-neon-blue/60 focus:ring-2 focus:ring-aurora-neon-blue/30 aurora-glow">
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="aurora-glass-enhanced border-aurora-electric-purple/30 backdrop-blur-xl">
                      <SelectItem value="artigo_cientifico" className="text-slate-200 hover:bg-aurora-electric-purple/20">Artigo Científico</SelectItem>
                      <SelectItem value="ficha_tecnica" className="text-slate-200 hover:bg-aurora-electric-purple/20">Ficha Técnica</SelectItem>
                      <SelectItem value="protocolo" className="text-slate-200 hover:bg-aurora-electric-purple/20">Protocolo</SelectItem>
                      <SelectItem value="outro" className="text-slate-200 hover:bg-aurora-electric-purple/20">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="equipamento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium">Equipamento Relacionado</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-100 focus:border-aurora-neon-blue/60 focus:ring-2 focus:ring-aurora-neon-blue/30 aurora-glow">
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="aurora-glass-enhanced border-aurora-electric-purple/30 backdrop-blur-xl">
                      <SelectItem value="none" className="text-slate-200 hover:bg-aurora-electric-purple/20">Nenhum</SelectItem>
                      {equipments.map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.id} className="text-slate-200 hover:bg-aurora-electric-purple/20">
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idioma_original"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium">Idioma Original</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-100 focus:border-aurora-neon-blue/60 focus:ring-2 focus:ring-aurora-neon-blue/30 aurora-glow">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="aurora-glass-enhanced border-aurora-electric-purple/30 backdrop-blur-xl">
                      <SelectItem value="pt" className="text-slate-200 hover:bg-aurora-electric-purple/20">Português</SelectItem>
                      <SelectItem value="en" className="text-slate-200 hover:bg-aurora-electric-purple/20">Inglês</SelectItem>
                      <SelectItem value="es" className="text-slate-200 hover:bg-aurora-electric-purple/20">Espanhol</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-8">
            <FormLabel className="aurora-text-gradient-enhanced text-lg font-medium block mb-4">Arquivo</FormLabel>
            {!selectedFile ? (
              <div className="aurora-glass-enhanced border-2 border-dashed border-aurora-electric-purple/40 rounded-2xl p-8 flex flex-col items-center justify-center aurora-glow-enhanced hover:border-aurora-neon-blue/60 transition-all duration-300 cursor-pointer group">
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer w-full"
                >
                  <div className="p-4 aurora-glass-enhanced rounded-full mb-4 group-hover:aurora-glow-enhanced">
                    <FileUp className="h-12 w-12 text-aurora-electric-purple group-hover:text-aurora-neon-blue transition-colors" />
                  </div>
                  <span className="text-lg aurora-text-gradient-enhanced font-medium mb-2">
                    Clique para fazer upload de um documento
                  </span>
                  <span className="text-sm text-slate-400">
                    PDF, DOCX (máx. 10MB)
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="aurora-glass-enhanced border border-aurora-electric-purple/30 rounded-2xl p-6 flex justify-between items-center aurora-glow">
                <div className="flex items-center">
                  <div className="p-3 aurora-glass-enhanced rounded-xl mr-4">
                    <File className="h-10 w-10 text-aurora-electric-purple" />
                  </div>
                  <div>
                    <p className="font-medium aurora-text-gradient-enhanced text-lg">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={removeFile}
                  className="text-slate-400 hover:text-slate-200 aurora-glass-enhanced hover:aurora-glow"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-300 hover:text-white hover:aurora-glow px-8 py-3"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile}
              className="aurora-button-enhanced px-8 py-3 text-lg font-medium"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Enviar Documento
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedDocumentUploadForm;
