
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
import { Loader2, Upload, FileUp, File, X, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [extractedResearchers, setExtractedResearchers] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState<string | null>(null);
  const [processingFailed, setProcessingFailed] = useState<boolean>(false);

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
      setProcessingFailed(false);
      
      // Reset extracted information when a new file is selected
      setSuggestedTitle('');
      setSuggestedDescription('');
      setExtractedKeywords([]);
      setExtractedResearchers([]);
      
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
      setProcessingFailed(false);
      setProcessingProgress("Lendo arquivo e extraindo conteúdo...");
      
      // Read file as base64
      const fileReader = new FileReader();
      const fileContentPromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.onerror = (e) => reject(e);
      });
      fileReader.readAsDataURL(file);
      const fileContent = await fileContentPromise;
      
      setProcessingProgress("Analisando conteúdo do documento...");
      
      // Process document content with edge function
      const processResponse = await supabase.functions.invoke('process-document', {
        body: { fileContent: fileContent.split(',')[1] } // Remove data URL prefix
      });
      
      if (processResponse.error) {
        console.error("Error processing document:", processResponse.error);
        throw new Error("Falha ao extrair conteúdo do documento");
      }
      
      const extractionData = processResponse.data;
      console.log("Extracted data:", extractionData);
      
      if (extractionData) {
        // Set extracted data - clean up the title first
        let cleanTitle = extractionData.title || file.name.replace('.pdf', '').replace(/_/g, ' ');
        
        // Remove prefixes like "1 " and suffixes like "OK" from the filename-based title
        cleanTitle = cleanTitle.replace(/^\d+\s+/, '');
        cleanTitle = cleanTitle.replace(/\s+OK$/i, '');
        
        setSuggestedTitle(cleanTitle);
        setSuggestedDescription(extractionData.conclusion || '');
        setExtractedKeywords(extractionData.keywords || []);
        setExtractedResearchers(extractionData.researchers || []);
        
        // Update form values
        form.setValue('titulo', cleanTitle);
        form.setValue('descricao', extractionData.conclusion || '');
        
        // Upload file to storage
        setProcessingProgress("Enviando arquivo para armazenamento...");
        try {
          const fileName = `articles/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { error: uploadError, data: uploadData } = await supabase
            .storage
            .from('documents')
            .upload(fileName, file);
            
          if (!uploadError && uploadData) {
            // Get the public URL
            const { data: urlData } = supabase
              .storage
              .from('documents')
              .getPublicUrl(fileName);
              
            setFileUrl(urlData.publicUrl);
          } else {
            console.warn("Storage upload failed:", uploadError);
            setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
          }
        } catch (storageError) {
          console.warn("Error during storage upload:", storageError);
          setUploadError("Não foi possível fazer upload do arquivo, mas você pode continuar com as informações extraídas.");
        }
        
        // Move to form step right away
        setProcessingProgress(null);
        setUploadStep('form');
        toast({
          title: "Documento processado",
          description: "Informações extraídas com sucesso do documento."
        });
      } else {
        setProcessingFailed(true);
        throw new Error("Nenhuma informação foi extraída do documento");
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
      setUploadError(error.message || "Ocorreu um erro ao processar o arquivo. Por favor, tente novamente ou forneça um link externo.");
      setProcessingFailed(true);
      toast({
        variant: "destructive",
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Por favor, tente novamente."
      });
      
      // Even on error, try to prepopulate the form with the filename at least
      if (file) {
        const suggestedTitleFromFilename = file.name
          .replace('.pdf', '')
          .replace(/_/g, ' ')
          .replace(/^\d+\s+/, '') // Remove leading numbers and spaces
          .replace(/\s+OK$/i, ''); // Remove trailing OK
          
        setSuggestedTitle(suggestedTitleFromFilename);
        form.setValue('titulo', suggestedTitleFromFilename);
        
        // Continue to form step even when extraction fails
        setUploadStep('form');
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      // Use the fileUrl from the upload step or the link_dropbox value
      const finalFileUrl = fileUrl || values.link_dropbox || null;
      
      const articlePayload = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" ? null : values.equipamento_id || null,
        tipo: 'artigo_cientifico',
        idioma_original: values.idioma_original,
        link_dropbox: finalFileUrl,
        status: 'ativo',
        criado_por: (await supabase.auth.getUser()).data.user?.id || null,
        keywords: extractedKeywords,
        researchers: extractedResearchers
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
                        {processingProgress || "Processando..."}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Processar Artigo
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

  // Form step UI with extracted information
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Extracted information alert */}
        {(extractedKeywords.length > 0 || extractedResearchers.length > 0 || suggestedTitle || suggestedDescription) && (
          <Alert className={processingFailed ? "bg-yellow-50 border-yellow-200" : "bg-muted"}>
            <AlertTitle className="flex items-center">
              {processingFailed ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  Processamento parcial do documento
                </>
              ) : (
                "Informações extraídas do documento"
              )}
            </AlertTitle>
            <AlertDescription>
              {processingFailed ? (
                <p className="text-sm text-muted-foreground mb-2">
                  O processamento do documento foi parcial. Algumas informações podem estar incompletas.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-2">
                  As informações abaixo foram extraídas automaticamente do documento.
                </p>
              )}
              
              {/* Display keywords */}
              {extractedKeywords.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Palavras-chave:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display researchers */}
              {extractedResearchers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Pesquisadores:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedResearchers.map((researcher, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {researcher}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
              <FormLabel>Conclusão / Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite a conclusão ou descrição do artigo" 
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
            {file && !isProcessing && (
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={handleFileUpload}
                  size="sm"
                >
                  Processar Arquivo
                </Button>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center mt-2">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {processingProgress || "Processando arquivo..."}
                </p>
              </div>
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
                <X className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        )}

        {/* Display keyword fields only if we have extracted keywords */}
        {extractedKeywords.length > 0 && (
          <div className="space-y-2">
            <Label>Palavras-chave</Label>
            <div className="p-3 border rounded-md">
              <div className="flex flex-wrap gap-2">
                {extractedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display researcher fields only if we have extracted researchers */}
        {extractedResearchers.length > 0 && (
          <div className="space-y-2">
            <Label>Pesquisadores</Label>
            <div className="p-3 border rounded-md">
              <div className="flex flex-wrap gap-2">
                {extractedResearchers.map((researcher, index) => (
                  <Badge key={index} variant="outline">
                    {researcher}
                  </Badge>
                ))}
              </div>
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
