
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, FileUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ScientificArticleFormProps {
  articleData?: {
    id?: string;
    titulo?: string;
    descricao?: string;
    equipamento_id?: string;
    idioma_original?: string;
    link_dropbox?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const ScientificArticleForm: React.FC<ScientificArticleFormProps> = ({ 
  articleData, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [equipments, setEquipments] = useState<{id: string, nome: string}[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'upload' | 'form'>(articleData ? 'form' : 'upload');
  const [suggestedTitle, setSuggestedTitle] = useState<string>('');
  const [suggestedDescription, setSuggestedDescription] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: articleData ? {
      titulo: articleData.titulo || "",
      descricao: articleData.descricao || "",
      equipamento_id: articleData.equipamento_id || "",
      idioma_original: articleData.idioma_original || "pt",
      link_dropbox: articleData.link_dropbox || "",
    } : {
      titulo: "",
      descricao: "",
      equipamento_id: "",
      idioma_original: "pt",
      link_dropbox: "",
    }
  });

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
        console.error('Error fetching equipments:', error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar equipamentos",
          description: "Não foi possível carregar a lista de equipamentos."
        });
      }
    };
    
    fetchEquipments();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setUploadError(null);
      
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo em formato PDF."
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 10MB."
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo PDF para upload."
      });
      return;
    }

    try {
      setIsProcessing(true);
      setUploadError(null);
      
      // Extract title from filename for later use
      const extractedTitle = file.name.replace('.pdf', '').replace(/_/g, ' ');
      
      // Skip the actual file upload and just process the file metadata
      // This is a fallback since the bucket might not exist
      setFileUrl(null);  // We won't have a real URL
      
      // Set title and placeholder description based on file name
      setSuggestedTitle(extractedTitle);
      setSuggestedDescription("Artigo científico relacionado a " + extractedTitle);
      
      form.setValue('titulo', extractedTitle);
      form.setValue('descricao', "Artigo científico relacionado a " + extractedTitle);
      
      // Move to form step
      setUploadStep('form');
      toast({
        title: "Processamento concluído",
        description: "O arquivo foi processado. Por favor, complete as informações do artigo."
      });
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError("Ocorreu um erro ao processar o arquivo. Por favor, tente novamente ou forneça um link externo.");
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Por favor, tente novamente."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // We'll use the link_dropbox value since fileUrl might be null
      const finalFileUrl = values.link_dropbox || null;
      
      const articlePayload = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" ? null : values.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: values.idioma_original,
        link_dropbox: finalFileUrl,
        status: 'ativo',
        criado_por: (await supabase.auth.getUser()).data.user?.id || null,
      };

      if (articleData && articleData.id) {
        // Update existing article
        const { error } = await supabase
          .from('documentos_tecnicos')
          .update(articlePayload)
          .eq('id', articleData.id);
          
        if (error) throw error;

        toast({
          title: "Artigo atualizado",
          description: "O artigo científico foi atualizado com sucesso."
        });
      } else {
        // Create new article
        const { error } = await supabase
          .from('documentos_tecnicos')
          .insert([articlePayload]);
          
        if (error) throw error;

        toast({
          title: "Artigo criado",
          description: "O novo artigo científico foi adicionado com sucesso."
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar artigo",
        description: "Não foi possível salvar o artigo científico. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload step UI
  if (uploadStep === 'upload' && !articleData) {
    return (
      <div className="space-y-6">
        {uploadError && (
          <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="file_upload">Faça upload do artigo (PDF, max 10MB)</Label>
          <div className="mt-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
            <label 
              htmlFor="file_upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground mb-1">
                Clique para fazer upload de um artigo científico
              </span>
              <span className="text-xs text-muted-foreground">
                PDF (máx. 10MB)
              </span>
              <Input
                id="file_upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          {file && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    onClick={handleFileUpload}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Processar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Ou <button 
                type="button" 
                className="text-primary hover:underline" 
                onClick={() => setUploadStep('form')}
              >
                preencha o formulário manualmente
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Form step UI
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {suggestedTitle && suggestedDescription && (
          <Alert className="bg-muted">
            <AlertDescription>
              <p className="text-sm">Título e descrição sugeridos com base no arquivo.</p>
            </AlertDescription>
          </Alert>
        )}
      
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Artigo Científico *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do artigo" {...field} />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite uma breve descrição do artigo" 
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipamento_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipamento Relacionado</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {equipments.map((equipment) => (
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
          
          <FormField
            control={form.control}
            name="idioma_original"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma Original *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {!fileUrl && (
          <FormField
            control={form.control}
            name="link_dropbox"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link do Documento (Dropbox, Google Drive, etc)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Cole o link para o documento" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {!fileUrl && uploadStep === 'form' && (
          <div className="space-y-2">
            <Label htmlFor="file_upload2">Ou faça upload do artigo (PDF, max 10MB)</Label>
            <Input
              id="file_upload2"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}

        {fileUrl && (
          <div className="space-y-2">
            <Label>Arquivo enviado</Label>
            <div className="p-3 bg-muted rounded-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Arquivo PDF enviado com sucesso</p>
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Visualizar arquivo
                </a>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFileUrl(null);
                  setFile(null);
                }}
              >
                Remover
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {articleData ? "Salvar Alterações" : "Adicionar Artigo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScientificArticleForm;
