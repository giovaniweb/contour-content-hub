
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ScientificArticleForm from './ScientificArticleForm';

interface ScientificArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data?: any) => void;
  articleData?: any;
}

const ScientificArticleDialog: React.FC<ScientificArticleDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  articleData
}) => {
  // More robust unique key generation that includes edit/new mode and timestamp
  // This ensures the form is always completely remounted when dialog state changes
  const [formKey, setFormKey] = useState<string>(`form-${Date.now()}`);
  
  // Force remount when the dialog opens/closes or when article data changes
  useEffect(() => {
    console.log(`Dialog state changed - isOpen: ${isOpen}, articleData: ${articleData?.id || 'none'}`);
    
    // Only regenerate key when the dialog is actually open
    if (isOpen) {
      // Include a clear indicator if this is an edit or create operation in the key
      const operation = articleData ? 'edit' : 'new';
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 9); // Add random component
      const newKey = `form-${operation}-${timestamp}-${uniqueId}`;
      
      console.log(`Generating new form key: ${newKey}`);
      setFormKey(newKey);
    }
  }, [isOpen, articleData]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          console.log("Dialog closing, calling onClose");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{articleData ? 'Editar Artigo Científico' : 'Novo Artigo Científico'}</DialogTitle>
          <DialogDescription>
            {articleData 
              ? 'Edite as informações do artigo científico existente.'
              : 'Adicione um novo artigo científico ao banco de artigos.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Key pattern includes edit/new status to ensure proper remounting */}
        {isOpen && (
          <ScientificArticleForm
            key={formKey}
            isOpen={isOpen}
            articleData={articleData}
            onSuccess={(data) => {
              console.log("Form submitted successfully, calling onSuccess");
              onSuccess(data);
              onClose();
            }}
            onCancel={() => {
              console.log("Form cancelled, calling onClose");
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScientificArticleDialog;
