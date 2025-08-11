import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CourseForm } from './CourseForm';
import { CourseFormData } from '@/types/academy';

interface CourseFormDialogProps {
  onSubmit: (data: CourseFormData) => Promise<any>;
  isLoading?: boolean;
}

export const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: CourseFormData) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Curso</DialogTitle>
        </DialogHeader>
        <CourseForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};