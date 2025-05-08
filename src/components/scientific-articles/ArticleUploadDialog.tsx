
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, X, User } from "lucide-react";
import { useScientificArticleForm } from "@/components/admin/article-form/useScientificArticleForm";
import { useEquipments } from "@/hooks/useEquipments";

interface ArticleUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ArticleUploadDialog: React.FC<ArticleUploadDialogProps> = ({ open, onClose, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { equipments } = useEquipments();

  const {
    form,
    file,
    fileUrl,
    fileInputRef,
    isProcessing,
    uploadError,
    processingProgress,
    extractedKeywords,
    extractedResearchers,
    onFileChange,
    handleFileUpload,
    handleClearFile,
    onSubmit,
    handleCancel,
  } = useScientificArticleForm({
    articleData: undefined,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onCancel: onClose,
    isOpen: open,
    forceClearState: !open,
  });

  const handleSubmit = async (values: any) => {
    setIsUploading(true);
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error uploading the article.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink">
            Upload Scientific Article
          </DialogTitle>
          <DialogDescription>
            Upload a PDF file to extract information and store it in the database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-6 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">PDF File</Label>
              {!file && !fileUrl ? (
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to select a PDF file</p>
                  <p className="text-xs text-muted-foreground mt-1">or drag and drop (max 10MB)</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-fluida-blue" />
                      <div>
                        <p className="font-medium text-sm">{file?.name || "Uploaded PDF"}</p>
                        <p className="text-xs text-muted-foreground">
                          {file && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isProcessing && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{processingProgress || "Processing..."}</span>
                    </div>
                  )}
                  
                  {uploadError && (
                    <p className="mt-2 text-sm text-destructive">{uploadError}</p>
                  )}
                </div>
              )}
              
              <input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Title</Label>
              <Input
                id="titulo"
                {...form.register("titulo")}
              />
              {form.formState.errors.titulo && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.titulo.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Abstract/Description</Label>
              <Textarea
                id="descricao"
                rows={4}
                {...form.register("descricao")}
              />
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <Label htmlFor="equipamento_id">Related Equipment</Label>
              <Select
                onValueChange={(value) => form.setValue("equipamento_id", value)}
                defaultValue={form.getValues("equipamento_id")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {equipments?.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extracted Keywords */}
            {extractedKeywords && extractedKeywords.length > 0 && (
              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedKeywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-muted px-2 py-1 rounded-md text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Researchers */}
            {extractedResearchers && extractedResearchers.length > 0 && (
              <div className="space-y-2">
                <Label>Researchers</Label>
                <div className="flex flex-wrap gap-2">
                  {extractedResearchers.map((researcher, index) => (
                    <span 
                      key={index} 
                      className="bg-muted px-2 py-1 rounded-md text-xs flex items-center"
                    >
                      <User className="h-3 w-3 mr-1" />
                      {researcher}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white"
              disabled={isUploading || isProcessing}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Article
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleUploadDialog;
