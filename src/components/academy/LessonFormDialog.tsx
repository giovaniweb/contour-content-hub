import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LessonForm } from './LessonForm';
import { LessonFormData } from '@/hooks/useAcademyLessons';

interface LessonFormDialogProps {
  onSubmit: (data: LessonFormData) => Promise<void>;
  isLoading?: boolean;
  nextOrderIndex?: number;
}

export const LessonFormDialog: React.FC<LessonFormDialogProps> = ({
  onSubmit,
  isLoading = false,
  nextOrderIndex = 1
}) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: LessonFormData) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Aula
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Aula</DialogTitle>
        </DialogHeader>
        <LessonForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
          nextOrderIndex={nextOrderIndex}
        />
      </DialogContent>
    </Dialog>
  );
};