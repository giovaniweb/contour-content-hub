
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ScientificArticleForm from "./ScientificArticleForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScientificArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (articleData?: any) => void;
  articleData?: any;
}

const ScientificArticleDialog: React.FC<ScientificArticleDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  articleData
}) => {
  // Track a unique key for the form to force a complete reset when opening new form
  const [formKey, setFormKey] = useState<string>(`article-form-${Date.now()}`);
  
  // Generate a new form key when dialog opens to ensure component recreation
  useEffect(() => {
    if (isOpen) {
      setFormKey(`article-form-${Date.now()}`);
    }
  }, [isOpen]);

  const handleArticleAdded = async (articleData: any) => {
    // Close dialog before processing
    onClose();
    
    // After article is added, automatically extract content
    if (articleData?.id) {
      try {
        toast.info("Extraindo conteúdo do documento...", {
          duration: 10000
        });
        
        const { error } = await supabase.functions.invoke('process-document', {
          body: { documentId: articleData.id }
        });
        
        if (error) {
          console.error('Error processing document:', error);
          toast.error("Não foi possível extrair o conteúdo do documento.");
        } else {
          toast.success("O conteúdo do documento foi extraído com sucesso.");
        }
      } catch (err) {
        console.error('Error processing document:', err);
      }
    }
    
    // Call the parent success handler
    onSuccess(articleData);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Only close if open is false (user is closing dialog)
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>
            {articleData ? "Editar Artigo Científico" : "Adicionar Novo Artigo Científico"}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do artigo científico para {articleData ? "atualizar" : "adicioná-lo à"} biblioteca de conteúdo.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          {/* Use key to force component recreation when dialog is opened */}
          <ScientificArticleForm 
            key={formKey}
            articleData={articleData}
            onSuccess={handleArticleAdded} 
            onCancel={onClose}
            isOpen={isOpen}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ScientificArticleDialog;
