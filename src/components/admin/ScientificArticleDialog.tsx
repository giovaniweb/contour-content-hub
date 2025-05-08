
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
  // Geração de chave única para forçar remontagem do componente
  const generateFormKey = () => {
    const operation = articleData ? `edit-${articleData.id}` : 'new';
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2, 15);
    return `article-form-${operation}-${timestamp}-${randomValue}`;
  };
  
  // Estado para a chave do formulário
  const [formKey, setFormKey] = useState(generateFormKey());
  
  // Força remontagem do componente quando o diálogo abre ou o artigo muda
  useEffect(() => {
    console.log(`Dialog state changed - isOpen: ${isOpen}, mode: ${articleData ? 'edit' : 'new'}`);
    
    if (isOpen) {
      const newKey = generateFormKey();
      console.log(`Generating new form key: ${newKey}`);
      setFormKey(newKey);
      
      // Limpeza adicional para segurança
      if (!articleData) {
        console.log("Creating new article - ensuring all previous states are cleared");
      }
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
        
        {/* Renderiza o formulário apenas quando o diálogo está aberto e com uma chave única para forçar remontagem */}
        {isOpen && (
          <ScientificArticleForm
            key={formKey}
            isOpen={isOpen}
            articleData={articleData}
            forceClearState={!articleData} // Flag explícita para limpar o estado para novos artigos
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
