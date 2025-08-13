import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Play, Edit, Trash2, GripVertical } from 'lucide-react';
import { AcademyCourse } from '@/types/academy';
import { useLessons } from '@/hooks/useLessons';
import { LessonFormDialog } from './LessonFormDialog';

interface CourseDetailModalProps {
  course: AcademyCourse;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const [showLessonForm, setShowLessonForm] = useState(false);
  const { lessons, isLoading, createLesson, updateLesson, deleteLesson } = useLessons(course.id);

  const handleCreateLesson = async (lessonData: any) => {
    await createLesson(lessonData);
    setShowLessonForm(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{course.title}</span>
              <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                {course.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="lessons">Aulas ({lessons?.length || 0})</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Informações do Curso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Descrição:</span>
                      <p className="text-sm text-muted-foreground">{course.description || 'Sem descrição'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Equipamento:</span>
                      <p className="text-sm text-muted-foreground">{course.equipment_name || 'Não especificado'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Nível:</span>
                      <p className="text-sm text-muted-foreground">
                        {course.difficulty_level === 'beginner' ? 'Iniciante' : 
                         course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Duração estimada:</span>
                      <p className="text-sm text-muted-foreground">{course.estimated_duration_hours || 0}h</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Configurações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Pontos de gamificação:</span>
                      <p className="text-sm text-muted-foreground">{course.gamification_points || 0}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Prova final:</span>
                      <p className="text-sm text-muted-foreground">{course.has_final_exam ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Pesquisa de satisfação:</span>
                      <p className="text-sm text-muted-foreground">{course.has_satisfaction_survey ? 'Sim' : 'Não'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Aulas do Curso</h3>
                <Button onClick={() => setShowLessonForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando aulas...</p>
                </div>
              ) : lessons?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma aula cadastrada</p>
                  <Button className="mt-4" onClick={() => setShowLessonForm(true)}>
                    Adicionar primeira aula
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {lessons?.map((lesson, index) => (
                    <Card key={lesson.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {lesson.duration_minutes && (
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.duration_minutes} min
                                  </span>
                                )}
                                {lesson.is_mandatory && (
                                  <Badge variant="secondary" className="text-xs">Obrigatória</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.vimeo_url && (
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteLesson(lesson.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estudantes Matriculados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">alunos ativos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Taxa de Conclusão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">concluíram o curso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avaliação Média</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">sem avaliações</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <LessonFormDialog
        onSubmit={handleCreateLesson}
        nextOrderIndex={lessons.length + 1}
      />
    </>
  );
};