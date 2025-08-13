import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LessonForm } from './LessonForm';
import { LessonFormData, AcademyLesson } from '@/hooks/useAcademyLessons';

interface LessonEditDialogProps {
  lesson: AcademyLesson;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<LessonFormData>) => Promise<any>;
  isLoading?: boolean;
}

export const LessonEditDialog: React.FC<LessonEditDialogProps> = ({
  lesson,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const handleSubmit = async (data: LessonFormData) => {
    await onSubmit(lesson.id, data);
    onClose();
  };

  const initialData: LessonFormData = {
    title: lesson.title,
    description: lesson.description || '',
    vimeo_url: lesson.vimeo_url,
    order_index: lesson.order_index,
    duration_minutes: lesson.duration_minutes || 30,
    is_mandatory: lesson.is_mandatory ?? true
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Aula</DialogTitle>
        </DialogHeader>
        <LessonForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};