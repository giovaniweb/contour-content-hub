
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  // Generate a unique key to force remounting the component
  const generateFormKey = () => {
    const operation = articleData ? `edit-${articleData.id}` : 'new';
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2, 15);
    return `article-form-${operation}-${timestamp}-${randomValue}`;
  };
  
  // Form key state
  const [formKey, setFormKey] = useState(generateFormKey());
  
  // Force component remounting when dialog opens or article changes
  useEffect(() => {
    console.log(`Dialog state changed - isOpen: ${isOpen}, mode: ${articleData ? 'edit' : 'new'}`);
    
    if (isOpen) {
      // Generate a new key to force remounting the form component
      const newKey = generateFormKey();
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
        
        {/* Render form only when dialog is open with a unique key to force remounting */}
        {isOpen && (
          <ScientificArticleForm
            key={formKey}
            isOpen={isOpen}
            articleData={articleData}
            forceClearState={!articleData} // Explicitly clear state for new articles
            onSuccess={(data) => {
              console.log("Form submitted successfully, calling onSuccess");
              onSuccess(data);
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
