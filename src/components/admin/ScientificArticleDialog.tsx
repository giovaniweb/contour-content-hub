
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
  // Generate a unique key whenever the dialog opens or articleData changes
  // This forces a complete remount of the form component
  const [dialogKey, setDialogKey] = useState(() => Date.now());
  
  // Regenerate key when dialog opens or articleData changes - this forces the form to be completely recreated
  useEffect(() => {
    if (isOpen) {
      console.log("Diálogo aberto ou dados do artigo mudaram, forçando recriação do formulário");
      setDialogKey(Date.now());
    }
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
          key={dialogKey} // Force new instance on each open with unique key
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
