import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, GripVertical, Play, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAcademyLessons, AcademyLesson } from '@/hooks/useAcademyLessons';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { LessonFormDialog } from '@/components/academy/LessonFormDialog';
import { LessonEditDialog } from '@/components/academy/LessonEditDialog';

export default function AdminAcademyCourseLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useAcademyCourses();
  const { lessons, isLoading, createLesson, updateLesson, deleteLesson } = useAcademyLessons(courseId);
  const [editingLesson, setEditingLesson] = useState<AcademyLesson | null>(null);

  const course = courses.find(c => c.id === courseId);

  const nextOrderIndex = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index)) + 1 : 1;

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/academia">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aulas do Curso</h1>
              <p className="text-muted-foreground">{course?.title || 'Curso não encontrado'}</p>
            </div>
          </div>
          {courseId && (
            <LessonFormDialog
              onSubmit={createLesson}
              nextOrderIndex={nextOrderIndex}
            />
          )}
        </div>

        {lessons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma aula criada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comece criando a primeira aula para este curso.
              </p>
              {courseId && (
                <LessonFormDialog
                  onSubmit={createLesson}
                  nextOrderIndex={nextOrderIndex}
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span className="text-sm font-medium">#{lesson.order_index}</span>
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      {lesson.is_mandatory && (
                        <Badge variant="secondary">Obrigatória</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Aula</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a aula "{lesson.title}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteLesson(lesson.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lesson.description && (
                    <p className="text-muted-foreground mb-3">{lesson.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>Vimeo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(lesson.duration_minutes)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {editingLesson && (
          <LessonEditDialog
            lesson={editingLesson}
            isOpen={!!editingLesson}
            onClose={() => setEditingLesson(null)}
            onSubmit={updateLesson}
          />
        )}
      </div>
    </AdminLayout>
  );
}