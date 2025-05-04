
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
  // Generate a unique key whenever the dialog opens, articleData changes, or isOpen changes
  // This forces a complete remount of the form component
  const [dialogKey, setDialogKey] = useState<string>(() => `form-${Date.now()}`);
  
  // Regenerate key when dialog opens, closes or articleData changes 
  // This forces the form to be completely recreated
  useEffect(() => {
    console.log("Dialog state changed - isOpen:", isOpen, "articleData:", articleData?.id || 'none');
    // We generate a new unique key that includes whether this is an edit or create operation
    const newKey = `form-${articleData ? 'edit' : 'new'}-${Date.now()}`;
    setDialogKey(newKey);
    console.log("Generated new form key:", newKey);
  }, [isOpen, articleData]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
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
        
        <ScientificArticleForm
          key={dialogKey} // Force new instance with a more robust unique key
          isOpen={isOpen}
          articleData={articleData}
          onSuccess={(data) => {
            onSuccess(data);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScientificArticleDialog;
