import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, BookOpen, Clock, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCourseDetails } from '@/hooks/useCourseDetails';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { LessonPlayer } from '@/components/academy/LessonPlayer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const {
    course,
    lessons,
    userAccess,
    progressPercentage,
    totalLessons,
    hasAccess,
    accessExpired,
    isLoading: courseLoading,
    error: courseError,
    updateProgress
  } = useCourseDetails(id || '');

  const {
    isLessonCompleted,
    markLessonComplete,
    updateWatchTime,
    getLessonWatchTime
  } = useLessonProgress(id || '');

  if (courseLoading) {
    return <LoadingSpinner message="Carregando curso..." />;
  }

  if (courseError || !course) {
    return (
      <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
        <Card className="aurora-glass p-8 max-w-md">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Curso não encontrado</h2>
            <p className="text-white/70 mb-6">
              {courseError || 'O curso que você está procurando não existe.'}
            </p>
            <Button onClick={() => navigate('/academia')} className="aurora-button">
              Voltar para Academia
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
        <Card className="aurora-glass p-8 max-w-md">
          <CardContent className="text-center">
            <Lock className="h-12 w-12 text-aurora-electric-purple mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Acesso Negado</h2>
            <p className="text-white/70 mb-6">
              Você não tem acesso a este curso. Solicite acesso para poder visualizar o conteúdo.
            </p>
            <Button onClick={() => navigate('/academia')} className="aurora-button">
              Voltar para Academia
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accessExpired) {
    return (
      <div className="aurora-dark-bg min-h-screen flex items-center justify-center">
        <Card className="aurora-glass p-8 max-w-md">
          <CardContent className="text-center">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Acesso Expirado</h2>
            <p className="text-white/70 mb-6">
              Seu acesso a este curso expirou. Entre em contato para renovar.
            </p>
            <Button onClick={() => navigate('/academia')} className="aurora-button">
              Voltar para Academia
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show lesson player if a lesson is selected
  if (selectedLesson) {
    const lesson = lessons.find(l => l.id === selectedLesson);
    if (!lesson) {
      setSelectedLesson(null);
      return null;
    }

    const idx = lessons.findIndex(l => l.id === selectedLesson);
    const hasPrevious = idx > 0;
    const hasNext = idx >= 0 && idx < lessons.length - 1;

    return (
      <LessonPlayer
        lesson={lesson}
        courseTitle={course.title}
        isCompleted={isLessonCompleted(lesson.id)}
        onComplete={() => {
          markLessonComplete(lesson.id);
          // Update course progress
          const completedCount = lessons.filter(l => 
            isLessonCompleted(l.id) || l.id === lesson.id
          ).length;
          const newProgress = Math.round((completedCount / totalLessons) * 100);
          updateProgress(newProgress);
        }}
        onBack={() => setSelectedLesson(null)}
        onProgress={(seconds) => updateWatchTime(lesson.id, seconds)}
        watchTime={getLessonWatchTime(lesson.id)}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onNext={hasNext ? () => setSelectedLesson(lessons[idx + 1].id) : undefined}
        onPrevious={hasPrevious ? () => setSelectedLesson(lessons[idx - 1].id) : undefined}
      />
    );
  }

  const completedLessons = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;

  const handleLessonClick = (lesson: any) => {
    // Check if lesson is unlocked (sequential unlock logic)
    const lessonIndex = lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex > 0) {
      const previousLesson = lessons[lessonIndex - 1];
      if (!isLessonCompleted(previousLesson.id)) {
        toast({
          title: "Aula bloqueada",
          description: "Complete a aula anterior para desbloquear esta aula.",
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedLesson(lesson.id);
  };

  const canTakeExam = completedLessons === totalLessons;

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
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/academia')}
            className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Academia
          </Button>
        </div>

        {/* Course Info */}
        <div className="aurora-glass rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500 text-white">
                  {course.difficulty_level === 'beginner' ? 'Iniciante' : 
                   course.difficulty_level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </Badge>
                <Badge variant="outline" className="text-aurora-teal border-aurora-teal">
                  {course.equipment_name}
                </Badge>
                {userAccess?.status && (
                  <Badge variant="outline" className="text-aurora-lavender border-aurora-lavender">
                    {userAccess.status === 'in_progress' ? 'Em Progresso' : 
                     userAccess.status === 'completed' ? 'Concluído' : 'Não Iniciado'}
                  </Badge>
                )}
              </div>
              
              <h1 className="aurora-text-gradient text-4xl font-light mb-4">
                {course.title}
              </h1>
              
              <p className="aurora-body text-white/70 mb-6 line-clamp-3">
                {course.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="aurora-glass p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-aurora-electric-purple" />
                    <div>
                      <p className="text-sm text-white/60">Aulas</p>
                      <p className="text-lg font-semibold text-white">{totalLessons}</p>
                    </div>
                  </div>
                </div>
                <div className="aurora-glass p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-aurora-teal" />
                    <div>
                      <p className="text-sm text-white/60">Duração</p>
                      <p className="text-lg font-semibold text-white">{course.estimated_duration_hours}h</p>
                    </div>
                  </div>
                </div>
                <div className="aurora-glass p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-aurora-lavender" />
                    <div>
                      <p className="text-sm text-white/60">Progresso</p>
                      <p className="text-lg font-semibold text-white">{progressPercentage}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progresso do Curso</span>
                  <span>{completedLessons} de {totalLessons} aulas concluídas</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="aurora-glass rounded-3xl p-8">
          <h2 className="aurora-text-gradient text-2xl font-light mb-6">
            Conteúdo do Curso
          </h2>

          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isLocked = index > 0 && !isLessonCompleted(lessons[index - 1].id);
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`aurora-glass border-aurora-electric-purple/20 transition-all ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:border-aurora-electric-purple/40'
                  } ${isCompleted ? 'bg-green-500/10' : ''}`}
                  onClick={() => !isLocked && handleLessonClick(lesson)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isLocked
                            ? 'bg-gray-500/20 text-gray-500'
                            : 'bg-aurora-electric-purple/20 text-aurora-electric-purple'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isLocked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${
                          isLocked ? 'text-white/50' : 'text-white'
                        }`}>
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>Aula {lesson.order_index}</span>
                          <span>{lesson.duration_minutes || 0} min</span>
                          {isCompleted && (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Concluída
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="outline" className="text-gray-500 border-gray-500">
                              Bloqueada
                            </Badge>
                          )}
                        </div>
                        {lesson.description && (
                          <p className={`text-sm mt-2 ${
                            isLocked ? 'text-white/30' : 'text-white/70'
                          } line-clamp-2`}>
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Exam Section */}
          {course.has_final_exam && (
            <div className="mt-8">
              <Card className="aurora-glass border-aurora-electric-purple/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Prova Final
                      </h3>
                      <p className="text-white/70">
                        Complete todas as aulas para desbloquear a prova final
                      </p>
                    </div>
                    <Button 
                      disabled={!canTakeExam}
                      className="aurora-button"
                      onClick={() => {
                        if (canTakeExam) {
                          toast({
                            title: "Prova Final",
                            description: "Funcionalidade em desenvolvimento",
                          });
                        }
                      }}
                    >
                      {canTakeExam ? 'Fazer Prova' : 'Complete todas as aulas'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;