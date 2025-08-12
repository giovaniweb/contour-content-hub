import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Trophy, Clock, Star, Users, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { LazyImage } from '@/components/ui/lazy-image';

interface Course {
  id: string;
  title: string;
  description: string;
  equipment_name: string;
  total_lessons: number;
  estimated_duration_hours: number;
  difficulty_level: string;
  gamification_points: number;
  has_final_exam: boolean;
  has_satisfaction_survey: boolean;
  status: string;
  thumbnail_url?: string;
}

interface UserCourseAccess {
  id: string;
  course: Course;
  status: string;
  progress_percentage: number;
  exam_status?: string;
  survey_completed: boolean;
  access_expires_at: string;
}

const Academia: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<UserCourseAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchMyCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_courses')
        .select(`
          id,
          title,
          description,
          estimated_duration_hours,
          difficulty_level,
          gamification_points,
          has_final_exam,
          has_satisfaction_survey,
          status,
          thumbnail_url,
          equipamentos(nome),
          academy_lessons(id)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithLessons = data?.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        equipment_name: course.equipamentos?.nome || 'Equipamento não especificado',
        total_lessons: course.academy_lessons?.length || 0,
        estimated_duration_hours: course.estimated_duration_hours || 0,
        difficulty_level: course.difficulty_level || 'beginner',
        gamification_points: course.gamification_points || 0,
        has_final_exam: course.has_final_exam || false,
        has_satisfaction_survey: course.has_satisfaction_survey || false,
        status: course.status || 'active',
        thumbnail_url: course.thumbnail_url
      })) || [];
      
      setAvailableCourses(coursesWithLessons);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar cursos",
        description: "Não foi possível carregar os cursos disponíveis."
      });
    }
  };

  const fetchMyCourses = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('academy_user_course_access')
        .select(`
          id,
          status,
          progress_percentage,
          exam_status,
          survey_completed,
          access_expires_at,
          academy_courses(
            id,
            title,
            description,
            estimated_duration_hours,
            difficulty_level,
            gamification_points,
            has_final_exam,
            has_satisfaction_survey,
            status,
            thumbnail_url,
            equipamentos(nome),
            academy_lessons(id)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userCourses = data?.map(access => ({
        id: access.id,
        course: {
          id: access.academy_courses.id,
          title: access.academy_courses.title,
          description: access.academy_courses.description || '',
          equipment_name: access.academy_courses.equipamentos?.nome || 'Equipamento não especificado',
          total_lessons: access.academy_courses.academy_lessons?.length || 0,
          estimated_duration_hours: access.academy_courses.estimated_duration_hours || 0,
          difficulty_level: access.academy_courses.difficulty_level || 'beginner',
          gamification_points: access.academy_courses.gamification_points || 0,
          has_final_exam: access.academy_courses.has_final_exam || false,
          has_satisfaction_survey: access.academy_courses.has_satisfaction_survey || false,
          status: access.academy_courses.status || 'active',
          thumbnail_url: access.academy_courses.thumbnail_url
        },
        status: access.status || 'not_started',
        progress_percentage: access.progress_percentage || 0,
        exam_status: access.exam_status,
        survey_completed: access.survey_completed || false,
        access_expires_at: access.access_expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })) || [];
      
      setMyCourses(userCourses);
    } catch (error) {
      console.error('Error fetching my courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestCourseAccess = async (courseId: string) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para solicitar acesso ao curso."
        });
        return;
      }

      const { error } = await supabase
        .from('academy_access_requests')
        .insert([{
          user_id: user.id,
          course_id: courseId,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de acesso foi enviada para aprovação. Em breve você receberá uma resposta."
      });
    } catch (error) {
      console.error('Error requesting course access:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível solicitar acesso ao curso."
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'not_started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
        <div className="aurora-glass rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple mx-auto mb-4"></div>
          <p className="aurora-body text-white">Carregando academia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-dark-bg min-h-screen">
      <div className="aurora-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="aurora-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="aurora-glass rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-aurora-lavender to-aurora-teal">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="aurora-text-gradient text-4xl font-light mb-2">
                Fluida Academy
              </h1>
              <p className="aurora-body text-white/70">
                Aprenda sobre equipamentos estéticos com nossos cursos especializados
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-aurora-electric-purple" />
                <div>
                  <p className="text-sm text-white/60">Cursos Concluídos</p>
                  <p className="text-xl font-semibold text-white">
                    {myCourses.filter(c => c.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Play className="h-6 w-6 text-aurora-teal" />
                <div>
                  <p className="text-sm text-white/60">Em Progresso</p>
                  <p className="text-xl font-semibold text-white">
                    {myCourses.filter(c => c.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-aurora-lavender" />
                <div>
                  <p className="text-sm text-white/60">Certificados</p>
                  <p className="text-xl font-semibold text-white">
                    {myCourses.filter(c => c.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-aurora-electric-purple" />
                <div>
                  <p className="text-sm text-white/60">XP Total</p>
                  <p className="text-xl font-semibold text-white">
                    {myCourses
                      .filter(c => c.status === 'completed')
                      .reduce((total, course) => total + (course.course.gamification_points || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="aurora-glass mb-6">
            <TabsTrigger value="available" className="text-white">
              Cursos Disponíveis
            </TabsTrigger>
            <TabsTrigger value="mycourses" className="text-white">
              Meus Cursos
            </TabsTrigger>
          </TabsList>

          {/* Available Courses */}
          <TabsContent value="available">
            {availableCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-white/30 mb-4" />
                <h3 className="text-xl text-white/70 mb-2">Nenhum curso disponível</h3>
                <p className="text-white/50 text-center">
                  Não há cursos ativos no momento. Novos cursos serão adicionados em breve.
                </p>
              </div>
            ) : (
                availableCourses.map((course) => (
                  <Card key={course.id} className="aurora-glass border-aurora-electric-purple/20 overflow-hidden">
                    <div className="relative">
                      <LazyImage
                        src={course.thumbnail_url}
                        alt={`Thumbnail do curso ${course.title}`}
                        aspectRatio="video"
                        fallbackSrc="/placeholder.svg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white`}>
                          {course.difficulty_level === 'beginner' ? 'Iniciante' : 
                           course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </Badge>
                        <div className="flex items-center gap-1 text-aurora-electric-purple">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">{course.gamification_points} XP</span>
                        </div>
                      </div>
                      <CardTitle className="aurora-text-gradient text-xl">
                        {course.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-aurora-teal border-aurora-teal w-fit">
                        {course.equipment_name}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="aurora-body text-white/70 mb-4">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.total_lessons} aulas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.estimated_duration_hours}h</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {course.has_final_exam && (
                          <Badge variant="outline" className="text-xs">
                            Prova Final
                          </Badge>
                        )}
                        {course.has_satisfaction_survey && (
                          <Badge variant="outline" className="text-xs">
                            Pesquisa
                          </Badge>
                        )}
                      </div>
                      <Button 
                        onClick={() => requestCourseAccess(course.id)}
                        className="w-full aurora-button"
                      >
                        Solicitar Acesso
                      </Button>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          {/* My Courses */}
          <TabsContent value="mycourses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-white/30 mb-4" />
                  <h3 className="text-xl text-white/70 mb-2">Nenhum curso matriculado</h3>
                  <p className="text-white/50 text-center">
                    Você ainda não tem acesso a nenhum curso. Solicite acesso aos cursos disponíveis.
                  </p>
                </div>
              ) : (
                myCourses.map((courseAccess) => (
                  <Card key={courseAccess.id} className="aurora-glass border-aurora-electric-purple/20 overflow-hidden">
                    <div className="relative">
                      <LazyImage
                        src={courseAccess.course.thumbnail_url}
                        alt={`Thumbnail do curso ${courseAccess.course.title}`}
                        aspectRatio="video"
                        fallbackSrc="/placeholder.svg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`${getStatusColor(courseAccess.status)} text-white`}>
                          {courseAccess.status === 'completed' ? 'Concluído' : 
                           courseAccess.status === 'in_progress' ? 'Em Progresso' : 'Não Iniciado'}
                        </Badge>
                        <div className="flex items-center gap-1 text-aurora-electric-purple">
                          <Star className="h-4 w-4" />
                          <span className="text-sm">{courseAccess.course.gamification_points} XP</span>
                        </div>
                      </div>
                      <CardTitle className="aurora-text-gradient text-xl">
                        {courseAccess.course.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-aurora-teal border-aurora-teal w-fit">
                        {courseAccess.course.equipment_name}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-white/70 mb-2">
                          <span>Progresso</span>
                          <span>{courseAccess.progress_percentage}%</span>
                        </div>
                        <Progress value={courseAccess.progress_percentage} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-white/60 mb-4">
                        <p>Acesso expira em: {new Date(courseAccess.access_expires_at).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {courseAccess.exam_status && (
                          <Badge variant={courseAccess.exam_status === 'passed' ? 'default' : 'destructive'} className="text-xs">
                            Prova: {courseAccess.exam_status === 'passed' ? 'Aprovado' : 'Reprovado'}
                          </Badge>
                        )}
                        {courseAccess.survey_completed && (
                          <Badge variant="outline" className="text-xs">
                            Pesquisa Concluída
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className="w-full aurora-button"
                        onClick={() => window.location.href = `/academia/curso/${courseAccess.course.id}`}
                      >
                        {courseAccess.status === 'not_started' ? 'Iniciar Curso' : 'Continuar'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Academia;