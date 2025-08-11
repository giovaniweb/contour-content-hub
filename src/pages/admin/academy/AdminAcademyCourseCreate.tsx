import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { CourseForm } from '@/components/academy/CourseForm';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { CourseFormData } from '@/types/academy';
import { toast } from '@/hooks/use-toast';

const AdminAcademyCourseCreate = () => {
  const navigate = useNavigate();
  const { createCourse, isLoading } = useAcademyCourses();

  const handleSubmit = async (data: CourseFormData) => {
    try {
      await createCourse(data);
      navigate('/admin/academia');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/academia');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="border-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Criar Novo Curso</h1>
            <p className="text-slate-400">Crie um novo curso para a academia</p>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Informações do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAcademyCourseCreate;