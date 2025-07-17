
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Tag, Lightbulb, Loader2, Save, X, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useScientificArticleForm } from "../article-form/useScientificArticleForm";
import { useEquipments } from "@/hooks/useEquipments";
import AuroraUploadZone from "@/components/aurora/AuroraUploadZone";
import AuroraProgressBar from "@/components/aurora/AuroraProgressBar";
import AutoresInputSection from "./components/AutoresInputSection";

interface EnhancedScientificArticleFormProps {
  articleData?: any;
  onSuccess: (articleData?: any) => void;
  onCancel: () => void;
  isOpen?: boolean;
  forceClearState?: boolean;
}

const EnhancedScientificArticleForm: React.FC<EnhancedScientificArticleFormProps> = ({ 
  articleData,
  onSuccess, 
  onCancel,
  isOpen = true,
  forceClearState = false
}) => {
  const [uploadProgress, setUploadProgress] = useState(0); // This local progress can be driven by processingProgress string
  const { equipments } = useEquipments();

  const {
    form,
    file,
    fileUrl,
    fileInputRef,
    uploadError,
    processingProgress, // Message from the hook, e.g. "Analyzing content..."
    extractedKeywords,
    extractedResearchers,
    suggestedTitle,
    suggestedDescription,
    onFileChange,
    onSubmit,
    handleFileUpload,
    handleClearFile,
    handleCancel,
    status,
    isLoading: formIsLoading,
    isProcessing: formIsProcessingAi,
    processingFailed: formProcessingFailed,
    initiateReplaceFile, // Get the new callback
    handleExtractedData // Get the extracted data handler
  } = useScientificArticleForm({
    articleData,
    onSuccess,
    onCancel,
    isOpen,
    forceClearState
  });

  // Effect to manage a visual upload progress bar if desired, or use direct messages
  React.useEffect(() => {
    if (formIsProcessingAi && processingProgress) {
      // Example: try to parse progress if it's like "Step 1/3: Uploading"
      // For now, just simulate based on messages changing
      setUploadProgress(prev => Math.min(prev + 25, 90));
    } else if (!formIsProcessingAi) {
      setUploadProgress(0);
    }
    if (status === 'READY_TO_SUBMIT' && !formProcessingFailed && file) { // Assuming file processing just finished successfully
        setUploadProgress(100);
    }
  }, [formIsProcessingAi, processingProgress, status, formProcessingFailed, file]);

  const handleFileSelect = async (selectedFile: File) => {
    // Create a proper input element and trigger the change event
    if (fileInputRef?.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      fileInputRef.current.files = dataTransfer.files;
      
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
    
    // O auto-processamento já é feito pelo useScientificArticleForm
    // Removido a chamada dupla do handleFileUpload
  };

  return (
    <div className="p-6">
      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-aurora-electric-purple aurora-floating" />
            </div>
            <div>
              <h1 className="text-4xl font-light aurora-text-gradient">
                {articleData ? 'Editar Artigo Científico' : 'Novo Artigo Científico'}
              </h1>
              <p className="text-slate-400 aurora-body">
                {articleData 
                  ? 'Atualize as informações do artigo científico'
                  : 'Faça upload do PDF do artigo e extraia informações automaticamente com IA'
                }
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div className="aurora-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <span className="text-aurora-electric-purple font-bold">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-medium aurora-heading">Upload do Artigo Científico</h2>
                  <p className="text-slate-400 text-sm">Selecione o arquivo PDF do artigo científico para extração automática de dados</p>
                </div>
              </div>

              <AuroraUploadZone
                onFileSelect={handleFileSelect}
                file={file} // This will be null initially if isReplacingFile is true, enabling new selection
                onClearFile={handleClearFile}
                isProcessing={formIsProcessingAi}
                error={status === 'AI_PROCESSING' && uploadError ? uploadError : null}
              />

              {/* Display current file info when editing an existing article */}
              {articleData && articleData.file_path && !file && !formIsProcessingAi && !formIsLoading && (
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-sm text-slate-400">
                    Arquivo atual: <span className="font-medium text-slate-300">{articleData.file_path?.split('/').pop()}</span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={initiateReplaceFile}
                    className="aurora-button-enhanced border-amber-500/70 text-amber-400 hover:bg-amber-500/10"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Substituir PDF do Artigo
                  </Button>
                  <p className="text-xs text-slate-400 mt-1">O PDF atual será substituído. A IA irá reanalisar o novo conteúdo.</p>
                </div>
              )}


              {/* Progress Bar for AI processing */}
              {formIsProcessingAi && (
                <div className="space-y-4 mt-4">
                  <AuroraProgressBar 
                    progress={uploadProgress}
                    label={processingProgress || "Processando artigo científico..."}
                  />
                  {processingProgress && ( // Show detailed message if available
                    <div className="flex items-center gap-2 text-aurora-electric-purple">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{processingProgress}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Display for AI Processing Failed */}
              {formProcessingFailed && status !== 'AI_PROCESSING' && (
                 <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-center">
                    <p className="text-sm text-red-400">
                        A extração de dados por IA falhou. Você pode preencher os campos manualmente.
                        {uploadError && ` Detalhe: ${uploadError}`}
                    </p>
                 </div>
              )}

              {/* Display for general upload/file error NOT during active AI processing */}
              {uploadError && !formIsProcessingAi && status !== 'SUBMITTING' && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-center">
                  <p className="text-sm text-red-400">{uploadError}</p>
                </div>
              )}
            </div>

            {/* Display for critical submission error */}
            {status === 'ERROR' && uploadError && (
              <div className="aurora-card p-4 bg-red-900/50 border border-red-500/70 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-red-300">Erro na Operação</h3>
                <p className="text-sm text-red-400">{uploadError}</p>
              </div>
            )}

            {/* Extracted Information Display */}
            {(extractedKeywords?.length > 0 || extractedResearchers?.length > 0 || suggestedTitle || suggestedDescription) && (
              <div className="aurora-card p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-aurora-neon-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium aurora-heading">Dados Extraídos do Artigo</h2>
                    <p className="text-slate-400 text-sm">Informações científicas identificadas automaticamente pela IA</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedTitle && (
                    <div className="space-y-2">
                      <Label className="text-aurora-electric-purple flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Título do Artigo Identificado
                      </Label>
                      <div className="p-3 bg-aurora-electric-purple/10 border border-aurora-electric-purple/30 rounded-lg">
                        <p className="text-sm text-slate-300">{suggestedTitle}</p>
                      </div>
                    </div>
                  )}

                  {suggestedDescription && (
                    <div className="space-y-2">
                      <Label className="text-aurora-neon-blue flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Abstract/Resumo Científico
                      </Label>
                      <div className="p-3 bg-aurora-neon-blue/10 border border-aurora-neon-blue/30 rounded-lg">
                        <p className="text-sm text-slate-300">{suggestedDescription}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {extractedKeywords && extractedKeywords.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-aurora-emerald flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Palavras-chave Científicas
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {extractedKeywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {extractedResearchers && extractedResearchers.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-aurora-soft-pink flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Autores/Pesquisadores
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {extractedResearchers.map((researcher, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="bg-aurora-soft-pink/20 text-aurora-soft-pink border-aurora-soft-pink/30"
                          >
                            {researcher}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="aurora-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <span className="text-aurora-electric-purple font-bold">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-medium aurora-heading">Detalhes do Artigo Científico</h2>
                  <p className="text-slate-400 text-sm">Complete ou ajuste os dados científicos extraídos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="aurora-heading">Título do Artigo Científico *</Label>
                  <Input
                    id="titulo"
                    {...form.register("titulo")}
                    className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple"
                    placeholder="Digite o título completo do artigo científico"
                  />
                  {form.formState.errors.titulo && (
                    <p className="text-sm text-red-400">{form.formState.errors.titulo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="descricao" className="aurora-heading">Abstract/Resumo Científico</Label>
                    {file && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const currentTitle = form.getValues("titulo");
                            const currentContent = suggestedDescription || form.getValues("descricao");
                            
                            if (!currentTitle) {
                              toast.error("Título necessário", {
                                description: "Por favor, preencha o título do artigo antes de gerar o resumo."
                              });
                              return;
                            }

                            if (!currentContent || currentContent === "Resumo gerado automaticamente pela IA a partir do conteúdo do PDF...") {
                              toast.error("Conteúdo necessário", {
                                description: "Nenhum conteúdo disponível para gerar o resumo. Faça upload de um PDF primeiro."
                              });
                              return;
                            }

                            toast.loading("Gerando resumo com IA...", { id: "generate-summary" });

                            const { supabase } = await import("@/integrations/supabase/client");
                            const { data, error } = await supabase.functions.invoke('generate-summary', {
                              body: {
                                title: currentTitle,
                                content: currentContent
                              }
                            });

                            if (error || !data.success) {
                              throw new Error(data?.error || error?.message || 'Erro ao gerar resumo');
                            }

                            form.setValue("descricao", data.summary);
                            toast.success("Resumo gerado!", { 
                              id: "generate-summary",
                              description: "Resumo científico gerado com sucesso pela IA."
                            });
                          } catch (error: any) {
                            console.error("Erro ao gerar resumo:", error);
                            toast.error("Erro ao gerar resumo", {
                              id: "generate-summary",
                              description: error.message || "Não foi possível gerar o resumo automaticamente."
                            });
                          }
                        }}
                        className="aurora-button-enhanced border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/10"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Gerar Resumo IA
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id="descricao"
                    rows={4}
                    {...form.register("descricao")}
                    className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple resize-none"
                    placeholder="Digite o abstract ou resumo científico do artigo ou use o botão para gerar automaticamente"
                  />
                </div>

                {/* Seção de Autores */}
                <div className="space-y-4">
                  <Label className="aurora-heading flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Autores do Artigo
                  </Label>
                  <AutoresInputSection 
                    autores={extractedResearchers || []}
                    onAutoresChange={(newAutores) => {
                      // Atualizar os autores extraídos através do hook
                      handleExtractedData({
                        title: suggestedTitle,
                        content: suggestedDescription,
                        keywords: extractedKeywords,
                        authors: newAutores,
                        researchers: newAutores
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipamento_id" className="aurora-heading">Equipamento Relacionado ao Estudo</Label>
                  <Select
                    onValueChange={(value) => {
                      const equipmentValue = value === "none" ? "" : value;
                      form.setValue("equipamento_id", equipmentValue);
                      console.log("Equipamento selecionado:", { value, equipmentValue });
                    }}
                    value={form.watch("equipamento_id") || "none"}
                  >
                    <SelectTrigger className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple">
                      <SelectValue placeholder="Selecione o equipamento estudado no artigo (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="aurora-glass border-aurora-electric-purple/30">
                      <SelectItem value="none">Nenhum equipamento específico</SelectItem>
                      {equipments?.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={formIsLoading || formIsProcessingAi} // Disable if submitting or AI is actively running
                className="aurora-glass border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={formIsLoading || formIsProcessingAi}
                className="aurora-button"
              >
                {formIsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando Artigo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {articleData ? 'Atualizar Artigo Científico' : 'Salvar Artigo Científico'}
                  </>
                )}
              </Button>
            </div>

            {/* Hidden file input for compatibility */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={onFileChange}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EnhancedScientificArticleForm;
