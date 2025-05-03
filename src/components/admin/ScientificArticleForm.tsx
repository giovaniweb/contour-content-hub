
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileUploader from "./article-form/FileUploader";
import ArticleInfoDisplay from "./article-form/ArticleInfoDisplay";
import ResearcherManager from "./article-form/ResearcherManager";
import FileDisplay from "./article-form/FileDisplay";
import KeywordsDisplay from "./article-form/KeywordsDisplay";
import { useArticleForm, formSchema, FormValues } from "./article-form/useArticleForm";

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

const ScientificArticleForm: React.FC<ScientificArticleFormProps> = ({ 
  articleData, 
  onSuccess, 
  onCancel 
}) => {
  const {
    isLoading,
    isProcessing,
    equipments,
    file,
    setFile,
    fileUrl,
    setFileUrl,
    uploadStep,
    setUploadStep,
    suggestedTitle,
    suggestedDescription,
    uploadError,
    extractedKeywords,
    extractedResearchers,
    setExtractedResearchers,
    processingProgress,
    processingFailed,
    handleFileChange,
    handleFileUpload,
    onSubmit,
    resetExtractedData
  } = useArticleForm(articleData, onSuccess);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: articleData ? {
      titulo: articleData.titulo || "",
      descricao: articleData.descricao || "",
      equipamento_id: articleData.equipamento_id || "",
      idioma_original: articleData.idioma_original || "pt",
      link_dropbox: articleData.link_dropbox || "",
    } : {
      titulo: suggestedTitle || "",
      descricao: suggestedDescription || "",
      equipamento_id: "",
      idioma_original: "pt",
      link_dropbox: "",
    }
  });

  // Update form values when suggested data changes
  React.useEffect(() => {
    if (suggestedTitle) {
      form.setValue('titulo', suggestedTitle);
    }
    if (suggestedDescription) {
      form.setValue('descricao', suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

  // Reset form when file changes
  React.useEffect(() => {
    if (!file) {
      resetExtractedData();
    }
  }, [file, resetExtractedData]);

  // Upload step UI
  if (uploadStep === 'upload' && !articleData) {
    return (
      <FileUploader
        file={file}
        setFile={setFile}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        isProcessing={isProcessing}
        uploadError={uploadError}
        processingProgress={processingProgress}
        processingFailed={processingFailed}
        onProcessFile={handleFileUpload}
        onSetUploadStep={setUploadStep}
        onResetData={resetExtractedData}
      />
    );
  }

  // Form step UI with extracted information
  return (
    <ScrollArea className="h-[calc(100vh-250px)] overflow-auto pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Extracted information alert */}
          <ArticleInfoDisplay 
            extractedKeywords={extractedKeywords}
            extractedResearchers={extractedResearchers}
            suggestedTitle={suggestedTitle}
            suggestedDescription={suggestedDescription}
            processingFailed={processingFailed}
          />
        
          {/* Form fields */}
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
          
          {/* Researcher manager component */}
          <ResearcherManager 
            extractedResearchers={extractedResearchers}
            setExtractedResearchers={setExtractedResearchers}
          />

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
          
          {/* File display/upload component when on form step */}
          {!fileUrl && uploadStep === 'form' && (
            <FileDisplay
              fileUrl={fileUrl}
              file={file}
              setFileUrl={setFileUrl}
              setFile={setFile}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              onResetData={resetExtractedData}
            />
          )}

          {fileUrl && (
            <FileDisplay
              fileUrl={fileUrl}
              file={file}
              setFileUrl={setFileUrl}
              setFile={setFile}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
              onResetData={resetExtractedData}
            />
          )}

          {/* Keywords display component */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KeywordsDisplay 
              extractedKeywords={extractedKeywords} 
              title="Palavras-chave"
            />

            <KeywordsDisplay 
              extractedKeywords={extractedResearchers}
              title="Pesquisadores"
              className="mt-0"
            />
          </div>

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
    </ScrollArea>
  );
};

export default ScientificArticleForm;
