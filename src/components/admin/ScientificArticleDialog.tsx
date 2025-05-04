
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
  // Significantly more robust key generation system
  // Uses operation type + timestamp + random value + article ID if present
  const generateFormKey = () => {
    const operation = articleData ? `edit-${articleData.id}` : 'new';
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2, 15);
    return `article-form-${operation}-${timestamp}-${randomValue}`;
  };
  
  // Initialize form key state
  const [formKey, setFormKey] = useState(generateFormKey());
  
  // Force a complete remount of the component whenever dialog opens or article changes
  useEffect(() => {
    console.log(`Dialog state changed - isOpen: ${isOpen}, mode: ${articleData ? 'edit' : 'new'}`);
    
    if (isOpen) {
      const newKey = generateFormKey();
      console.log(`Generating new form key: ${newKey}`);
      setFormKey(newKey);
      
      // Additional cleanup for safety
      if (!articleData) {
        console.log("Creating new article - ensuring all previous states are cleared");
      }
    }
  }, [isOpen, articleData]);

  // Ensure the dialog is completely remounted when article ID changes
  useEffect(() => {
    if (articleData?.id) {
      console.log(`Article ID changed to: ${articleData.id}, forcing remount`);
      setFormKey(generateFormKey());
    }
  }, [articleData?.id]);

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
        
        {/* Only render form when dialog is open and with a unique key to force remount */}
        {isOpen && (
          <ScientificArticleForm
            key={formKey}
            isOpen={isOpen}
            articleData={articleData}
            forceClearState={!articleData} // Pass explicit flag to clear state for new articles
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
