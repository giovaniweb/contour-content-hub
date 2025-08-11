import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { CourseForm } from '@/components/academy/CourseForm';
import { LessonFormDialog } from '@/components/academy/LessonFormDialog';
import { LessonsList } from '@/components/academy/LessonsList';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { useLessons } from '@/hooks/useLessons';
import { CourseFormData, AcademyCourse } from '@/types/academy';
import { supabase } from '@/integrations/supabase/client';

const AdminAcademyCourseEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateCourse, isLoading: courseLoading } = useAcademyCourses();
  const { lessons, createLesson, updateLesson, updateLessonsOrder, deleteLesson, isLoading: lessonsLoading } = useLessons(id || '');
  
  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('academy_courses')
      .select(`
        *,
        equipamentos(nome)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      navigate('/admin/academia');
      return;
    }

      if (data) {
        setCourse({
          ...data,
          equipment_name: data.equipamentos?.nome || '',
          difficulty_level: (data.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          status: (data.status as 'active' | 'inactive' | 'draft') || 'active'
        });
      }
  };

  const handleCourseUpdate = async (data: CourseFormData) => {
    if (!id) return;
    
    try {
      await updateCourse(id, data);
      await fetchCourse(); // Refresh course data
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleLessonSubmit = async (lessonData: any) => {
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
      } else {
        await createLesson(lessonData);
      }
      setShowLessonForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await deleteLesson(lessonId);
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleReorderLessons = async (reorderedLessons: any[]) => {
    try {
      await updateLessonsOrder(reorderedLessons);
    } catch (error) {
      console.error('Error reordering lessons:', error);
    }
  };

  const handleBack = () => {
    navigate('/admin/academia');
  };

  if (!course) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-slate-400">Carregando curso...</p>
        </div>
      </AdminLayout>
    );
  }

  const totalDuration = lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0);
  const totalHours = Math.ceil(totalDuration / 60);

  const courseFormData: CourseFormData = {
    title: course.title,
    description: course.description || '',
    equipment_id: course.equipment_id || '',
    difficulty_level: course.difficulty_level || 'beginner',
    estimated_duration_hours: totalHours, // Use calculated duration
    gamification_points: course.gamification_points || 100,
    has_final_exam: course.has_final_exam || false,
    has_satisfaction_survey: course.has_satisfaction_survey || false
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="border-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Editar Curso</h1>
            <p className="text-slate-400">Gerencie as informações e aulas do curso</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Stats */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-slate-50">{lessons.length}</div>
                  <p className="text-xs text-slate-400">aulas cadastradas</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-slate-50">{totalDuration}min</div>
                  <p className="text-xs text-slate-400">duração total</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-slate-50">{course.gamification_points}</div>
                  <p className="text-xs text-slate-400">pontos XP</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="info" className="data-[state=active]:bg-slate-700">
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-slate-700">
              Aulas ({lessons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Informações do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseForm 
                  onSubmit={handleCourseUpdate}
                  onCancel={handleBack}
                  isLoading={courseLoading}
                  initialData={courseFormData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-slate-50">Aulas do Curso</CardTitle>
                <Button onClick={() => setShowLessonForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </CardHeader>
              <CardContent>
                <LessonsList
                  lessons={lessons}
                  onEdit={(lesson) => {
                    setEditingLesson(lesson);
                    setShowLessonForm(true);
                  }}
                  onDelete={handleDeleteLesson}
                  onReorder={handleReorderLessons}
                  onPlay={() => {}} // Not needed in admin
                  showPlayButton={false}
                  isAdmin={true}
                />
                {lessons.length === 0 && !lessonsLoading && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Nenhuma aula cadastrada</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowLessonForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeira Aula
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lesson Form Dialog */}
      <LessonFormDialog
        isOpen={showLessonForm}
        onClose={() => {
          setShowLessonForm(false);
          setEditingLesson(null);
        }}
        onSubmit={handleLessonSubmit}
        initialData={editingLesson}
        courseId={id || ''}
      />
    </AdminLayout>
  );
};

export default AdminAcademyCourseEdit;