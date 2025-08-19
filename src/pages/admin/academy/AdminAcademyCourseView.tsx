import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Clock, Users, Award, PlayCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAcademyLessons } from '@/hooks/useAcademyLessons';
import { AcademyCourse } from '@/types/academy';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminAcademyCourseView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { lessons, isLoading: lessonsLoading } = useAcademyLessons(id || '');
  
  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    if (!id) return;
    
    try {
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
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/academia');
  };

  const handleEdit = () => {
    navigate(`/admin/academia/curso/editar/${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Inativo</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Rascunho</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Iniciante</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Intermediário</Badge>;
      case 'advanced':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Avançado</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-slate-400">Carregando curso...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-slate-400">Curso não encontrado</p>
        </div>
      </AdminLayout>
    );
  }

  const totalDuration = lessons.reduce((total, lesson) => total + (lesson.duration_minutes || 0), 0);
  const totalHours = Math.ceil(totalDuration / 60);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold text-slate-50">{course.title}</h1>
              <p className="text-slate-400">Visualização do curso</p>
            </div>
          </div>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Curso
          </Button>
        </div>

        {/* Course Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-50">Informações do Curso</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(course.status || 'active')}
                {getDifficultyBadge(course.difficulty_level || 'beginner')}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">Descrição</h3>
              <p className="text-slate-400">{course.description || 'Sem descrição'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">Equipamento</h3>
                <p className="text-slate-400">{course.equipment_name || 'Não especificado'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">Data de Criação</h3>
                <p className="text-slate-400">
                  {course.created_at ? format(new Date(course.created_at), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">Última Atualização</h3>
                <p className="text-slate-400">
                  {course.updated_at ? format(new Date(course.updated_at), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              {course.has_final_exam && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Award className="h-3 w-3 mr-1" />
                  Exame Final
                </Badge>
              )}
              {course.has_satisfaction_survey && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Pesquisa de Satisfação
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Aulas</span>
              </div>
              <div className="text-2xl font-bold text-slate-50">{lessons.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Duração</span>
              </div>
              <div className="text-2xl font-bold text-slate-50">{totalDuration}min</div>
              <p className="text-xs text-slate-400">≈ {totalHours}h</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Pontos XP</span>
              </div>
              <div className="text-2xl font-bold text-slate-50">{course.gamification_points}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Estudantes</span>
              </div>
              <div className="text-2xl font-bold text-slate-50">0</div>
              <p className="text-xs text-slate-400">matriculados</p>
            </CardContent>
          </Card>
        </div>

        {/* Lessons */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Aulas do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            {lessonsLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Carregando aulas...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Nenhuma aula cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 border border-slate-700 rounded-lg bg-slate-700/30"
                  >
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-sm font-mono w-8 text-center">{index + 1}</span>
                      <PlayCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-50">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-sm text-slate-400 mt-1">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {lesson.duration_minutes && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.duration_minutes}min
                          </Badge>
                        )}
                        {lesson.is_mandatory && (
                          <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-400">
                            Obrigatória
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAcademyCourseView;