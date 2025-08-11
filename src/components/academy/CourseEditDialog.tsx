import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CourseForm } from './CourseForm';
import { CourseFormData, AcademyCourse } from '@/types/academy';

interface CourseEditDialogProps {
  course: AcademyCourse;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<CourseFormData>) => Promise<any>;
  isLoading?: boolean;
}

export const CourseEditDialog: React.FC<CourseEditDialogProps> = ({
  course,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const handleSubmit = async (data: CourseFormData) => {
    await onSubmit(course.id, data);
    onClose();
  };

  const initialData: CourseFormData = {
    title: course.title,
    description: course.description || '',
    equipment_id: course.equipment_id || '',
    difficulty_level: course.difficulty_level || 'beginner',
    estimated_duration_hours: course.estimated_duration_hours || 1,
    gamification_points: course.gamification_points || 100,
    has_final_exam: course.has_final_exam || false,
    has_satisfaction_survey: course.has_satisfaction_survey || false
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
        </DialogHeader>
        <CourseForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
};