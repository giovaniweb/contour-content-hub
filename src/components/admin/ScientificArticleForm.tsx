
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArticleForm, FormValues, formSchema } from "./article-form/useArticleForm";
import FileUploader from "./article-form/FileUploader";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";

interface ArticleFormProps {
  articleData?: any;
  onSuccess: (articleData?: any) => void;
  onCancel: () => void;
}

const ScientificArticleForm: React.FC<ArticleFormProps> = ({ 
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
    setSuggestedTitle,
    suggestedDescription,
    setSuggestedDescription,
    uploadError,
    setUploadError,
    extractedKeywords,
    extractedResearchers,
    processingProgress,
    processingFailed,
    handleFileChange,
    handleFileUpload,
    onSubmit,
    resetExtractedData,
    formSchema
  } = useArticleForm(articleData, (data) => onSuccess(data));
  
  // Initialize form using React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: articleData?.titulo || suggestedTitle || "",
      descricao: articleData?.descricao || suggestedDescription || "",
      equipamento_id: articleData?.equipamento_id || "",
      idioma_original: articleData?.idioma_original || "pt",
      link_dropbox: articleData?.link_dropbox || ""
    }
  });

  // Update form values when suggested data is updated
  React.useEffect(() => {
    if (suggestedTitle && !form.getValues("titulo")) {
      form.setValue("titulo", suggestedTitle);
    }
    
    if (suggestedDescription && !form.getValues("descricao")) {
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form]);

  // Upload step UI
  if (uploadStep === 'upload') {
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Extracted information alert */}
          {(extractedKeywords.length > 0 || extractedResearchers.length > 0) && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informações extraídas</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-2">
                  {extractedKeywords.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Palavras-chave:</p>
                      <div className="flex flex-wrap gap-1">
                        {extractedKeywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {extractedResearchers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Pesquisadores:</p>
                      <div className="flex flex-wrap gap-1">
                        {extractedResearchers.map((researcher, i) => (
                          <Badge key={i} variant="outline">{researcher}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Title field */}
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Artigo*</FormLabel>
                <FormControl>
                  <Input placeholder="Título do artigo científico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Equipment field */}
          <FormField
            control={form.control}
            name="equipamento_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipamento</FormLabel>
                <Select 
                  value={field.value || ""} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um equipamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Nenhum equipamento</SelectItem>
                    {equipments.map((equip) => (
                      <SelectItem key={equip.id} value={equip.id}>
                        {equip.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description field */}
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descrição ou resumo do artigo" 
                    className="resize-y min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Language field */}
          <FormField
            control={form.control}
            name="idioma_original"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma Original</FormLabel>
                <Select 
                  value={field.value || "pt"} 
                  onValueChange={field.onChange}
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
          
          {/* External link field */}
          {(!file && !fileUrl) && (
            <FormField
              control={form.control}
              name="link_dropbox"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Externo (Dropbox, Google Drive, etc.)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* File preview */}
          {file && (
            <div className="p-4 border rounded-md">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
          
          {fileUrl && !file && (
            <div>
              <Label>Arquivo</Label>
              <div className="p-4 border rounded-md">
                <p className="break-all text-sm">
                  {fileUrl}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Artigo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScientificArticleForm;
