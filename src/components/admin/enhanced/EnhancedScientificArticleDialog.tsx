
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EnhancedScientificArticleForm from './EnhancedScientificArticleForm';

interface EnhancedScientificArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data?: any) => void;
  articleData?: any;
}

const EnhancedScientificArticleDialog: React.FC<EnhancedScientificArticleDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  articleData
}) => {
  const [formKey, setFormKey] = useState(() => 
    `article-form-${articleData ? `edit-${articleData.id}` : 'new'}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  );
  
  useEffect(() => {
    if (isOpen) {
      const newKey = `article-form-${articleData ? `edit-${articleData.id}` : 'new'}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      setFormKey(newKey);
    }
  }, [isOpen, articleData]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 aurora-enhanced-theme bg-card/95 backdrop-blur-lg border border-primary/20 shadow-2xl">
        <div className="overflow-y-auto max-h-[95vh] scrollbar-hide">
          {isOpen && (
            <EnhancedScientificArticleForm
              key={formKey}
              isOpen={isOpen}
              articleData={articleData}
              forceClearState={!articleData}
              onSuccess={(data) => {
                onSuccess(data);
              }}
              onCancel={() => {
                onClose();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedScientificArticleDialog;
