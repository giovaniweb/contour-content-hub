
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Tag, Lightbulb, Loader2, Save, X } from "lucide-react";
import { useScientificArticleForm } from "../article-form/useScientificArticleForm";
import { useEquipments } from "@/hooks/useEquipments";
import AuroraUploadZone from "@/components/aurora/AuroraUploadZone";
import AuroraProgressBar from "@/components/aurora/AuroraProgressBar";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const { equipments } = useEquipments();

  const {
    form,
    isLoading,
    file,
    fileUrl,
    fileInputRef,
    isProcessing,
    uploadError,
    processingProgress,
    processingFailed,
    extractedKeywords,
    extractedResearchers,
    suggestedTitle,
    suggestedDescription,
    onFileChange,
    onSubmit,
    handleFileUpload,
    handleClearFile,
    handleCancel
  } = useScientificArticleForm({
    articleData,
    onSuccess,
    onCancel,
    isOpen,
    forceClearState
  });

  // Simulate upload progress for visual feedback
  React.useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isProcessing]);

  const handleFileSelect = async (selectedFile: File) => {
    const event = {
      target: { files: [selectedFile] }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onFileChange(event);
    
    // Auto-process file after selection
    setTimeout(() => {
      handleFileUpload();
    }, 500);
  };

  return (
    <div className="aurora-dark-bg min-h-screen p-6">
      <div className="aurora-particles fixed inset-0 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light aurora-text-gradient">
            {articleData ? 'Editar Artigo Científico' : 'Novo Artigo Científico'}
          </h1>
          <p className="text-slate-400 aurora-body">
            {articleData 
              ? 'Atualize as informações do artigo científico'
              : 'Faça upload do PDF e extraia informações automaticamente'
            }
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* File Upload Section */}
            <div className="aurora-card p-8 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                  <span className="text-aurora-electric-purple font-bold">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-medium aurora-heading">Upload do Documento</h2>
                  <p className="text-slate-400 text-sm">Selecione o arquivo PDF do artigo científico</p>
                </div>
              </div>

              <AuroraUploadZone
                onFileSelect={handleFileSelect}
                file={file}
                onClearFile={handleClearFile}
                isProcessing={isProcessing}
                error={uploadError}
              />

              {isProcessing && (
                <div className="space-y-4">
                  <AuroraProgressBar 
                    progress={uploadProgress}
                    label="Processando documento..."
                  />
                  {processingProgress && (
                    <div className="flex items-center gap-2 text-aurora-electric-purple">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{processingProgress}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Extracted Information Display */}
            {(extractedKeywords?.length > 0 || extractedResearchers?.length > 0 || suggestedTitle || suggestedDescription) && (
              <div className="aurora-card p-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 aurora-glass rounded-full flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-aurora-neon-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium aurora-heading">Informações Extraídas</h2>
                    <p className="text-slate-400 text-sm">Dados identificados automaticamente no documento</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedTitle && (
                    <div className="space-y-2">
                      <Label className="text-aurora-electric-purple flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Título Sugerido
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
                        Resumo Sugerido
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
                        Palavras-chave Identificadas
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
                        Pesquisadores Identificados
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
                  <h2 className="text-xl font-medium aurora-heading">Informações do Artigo</h2>
                  <p className="text-slate-400 text-sm">Complete ou ajuste os dados extraídos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="aurora-heading">Título *</Label>
                  <Input
                    id="titulo"
                    {...form.register("titulo")}
                    className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple"
                    placeholder="Digite o título do artigo científico"
                  />
                  {form.formState.errors.titulo && (
                    <p className="text-sm text-red-400">{form.formState.errors.titulo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao" className="aurora-heading">Resumo/Abstract</Label>
                  <Textarea
                    id="descricao"
                    rows={4}
                    {...form.register("descricao")}
                    className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple resize-none"
                    placeholder="Digite o resumo ou abstract do artigo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipamento_id" className="aurora-heading">Equipamento Relacionado</Label>
                  <Select
                    onValueChange={(value) => form.setValue("equipamento_id", value)}
                    defaultValue={form.getValues("equipamento_id")}
                  >
                    <SelectTrigger className="aurora-glass border-aurora-electric-purple/30 focus:border-aurora-electric-purple">
                      <SelectValue placeholder="Selecione um equipamento (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="aurora-glass border-aurora-electric-purple/30">
                      <SelectItem value="">Nenhum equipamento</SelectItem>
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
                disabled={isLoading || isProcessing}
                className="aurora-glass border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || isProcessing}
                className="aurora-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {articleData ? 'Atualizar Artigo' : 'Salvar Artigo'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EnhancedScientificArticleForm;
