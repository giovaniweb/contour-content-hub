import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock course data
  const course = {
    id: '1',
    title: 'Introdução ao HIFU',
    description: 'Curso completo sobre tecnologia HIFU e suas aplicações na estética moderna',
    equipment_name: 'HIFU Profissional',
    difficulty_level: 'beginner',
    estimated_duration_hours: 3,
    gamification_points: 150,
    has_final_exam: true,
    progress_percentage: 60,
    lessons: [
      {
        id: '1',
        title: 'O que é HIFU?',
        duration_minutes: 15,
        order_index: 1,
        completed: true,
        vimeo_url: 'https://vimeo.com/123456789'
      },
      {
        id: '2',
        title: 'Indicações e Contraindicações',
        duration_minutes: 20,
        order_index: 2,
        completed: true,
        vimeo_url: 'https://vimeo.com/123456790'
      },
      {
        id: '3',
        title: 'Protocolos de Tratamento',
        duration_minutes: 25,
        order_index: 3,
        completed: false,
        vimeo_url: 'https://vimeo.com/123456791'
      }
    ]
  };

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = course.lessons.length;

  const handleLessonClick = (lesson: any) => {
    if (!lesson.completed) {
      toast({
        title: "Iniciando aula",
        description: `Abrindo: ${lesson.title}`
      });
    }
  };

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
                  {course.difficulty_level}
                </Badge>
                <Badge variant="outline" className="text-aurora-teal border-aurora-teal">
                  {course.equipment_name}
                </Badge>
              </div>
              
              <h1 className="aurora-text-gradient text-4xl font-light mb-4">
                {course.title}
              </h1>
              
              <p className="aurora-body text-white/70 mb-6">
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
                      <p className="text-lg font-semibold text-white">{course.progress_percentage}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progresso do Curso</span>
                  <span>{completedLessons} de {totalLessons} aulas concluídas</span>
                </div>
                <Progress value={course.progress_percentage} className="h-3" />
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
            {course.lessons.map((lesson, index) => (
              <Card 
                key={lesson.id} 
                className={`aurora-glass border-aurora-electric-purple/20 cursor-pointer transition-all hover:border-aurora-electric-purple/40 ${
                  lesson.completed ? 'bg-green-500/10' : ''
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      lesson.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-aurora-electric-purple/20 text-aurora-electric-purple'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>Aula {lesson.order_index}</span>
                        <span>{lesson.duration_minutes} min</span>
                        {lesson.completed && (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                      disabled={completedLessons < totalLessons}
                      className="aurora-button"
                    >
                      Fazer Prova
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