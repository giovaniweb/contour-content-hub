import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CourseFormData } from '@/types/academy';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminAcademyCourseNew = () => {
  const navigate = useNavigate();
  const { createCourse } = useAcademyCourses();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CourseFormData>({
    defaultValues: {
      difficulty_level: 'beginner',
      estimated_duration_hours: 1,
      gamification_points: 100,
      has_final_exam: false,
      has_satisfaction_survey: false,
    }
  });

  const watchHasFinalExam = watch('has_final_exam');
  const watchHasSurvey = watch('has_satisfaction_survey');

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      await createCourse(data);
      navigate('/admin/academia');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/academia')}
            className="border-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Novo Curso</h1>
            <p className="text-slate-400">Crie um novo curso para a academia</p>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Informações do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="title" className="text-slate-300">Título do Curso *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Título é obrigatório' })}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="Digite o título do curso"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">Descrição</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="Descreva o conteúdo e objetivos do curso"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="equipment_id" className="text-slate-300">Equipamento</Label>
                    <Input
                      id="equipment_id"
                      {...register('equipment_id')}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="ID do equipamento (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty_level" className="text-slate-300">Nível de Dificuldade</Label>
                    <Select 
                      onValueChange={(value) => setValue('difficulty_level', value as 'beginner' | 'intermediate' | 'advanced')}
                      defaultValue="beginner"
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="estimated_duration_hours" className="text-slate-300">Duração Estimada (horas) *</Label>
                    <Input
                      id="estimated_duration_hours"
                      type="number"
                      min="1"
                      {...register('estimated_duration_hours', { 
                        required: 'Duração é obrigatória',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Duração mínima é 1 hora' }
                      })}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                    />
                    {errors.estimated_duration_hours && (
                      <p className="text-red-400 text-sm mt-1">{errors.estimated_duration_hours.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gamification_points" className="text-slate-300">Pontos de Gamificação *</Label>
                    <Input
                      id="gamification_points"
                      type="number"
                      min="0"
                      {...register('gamification_points', { 
                        required: 'Pontos são obrigatórios',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Pontos não podem ser negativos' }
                      })}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                    />
                    {errors.gamification_points && (
                      <p className="text-red-400 text-sm mt-1">{errors.gamification_points.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-50">Configurações Avançadas</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <Label htmlFor="has_final_exam" className="text-slate-300 font-medium">Exame Final</Label>
                      <p className="text-sm text-slate-400">O curso terá um exame final obrigatório para conclusão</p>
                    </div>
                    <Switch
                      id="has_final_exam"
                      checked={watchHasFinalExam}
                      onCheckedChange={(checked) => setValue('has_final_exam', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                    <div>
                      <Label htmlFor="has_satisfaction_survey" className="text-slate-300 font-medium">Pesquisa de Satisfação</Label>
                      <p className="text-sm text-slate-400">O curso terá uma pesquisa de satisfação ao final</p>
                    </div>
                    <Switch
                      id="has_satisfaction_survey"
                      checked={watchHasSurvey}
                      onCheckedChange={(checked) => setValue('has_satisfaction_survey', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/academia')}
                  className="border-slate-600 text-slate-300"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                >
                  Criar Curso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAcademyCourseNew;