import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { VimeoPlayer } from './VimeoPlayer';
import { LessonFeedback } from './LessonFeedback';
import { AcademyLesson } from '@/hooks/useLessons';

interface LessonPlayerProps {
  lesson: AcademyLesson;
  courseTitle: string;
  isCompleted: boolean;
  onComplete: () => void;
  onBack: () => void;
  onProgress: (watchTimeSeconds: number) => void;
  watchTime?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  courseTitle,
  isCompleted,
  onComplete,
  onBack,
  onProgress,
  watchTime = 0,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [showNextSuggestion, setShowNextSuggestion] = useState(false);

  const effectiveDuration = videoDuration ?? (lesson.duration_minutes ? lesson.duration_minutes * 60 : 0);

  const handleVideoProgress = (watchTimeSeconds: number) => {
    if (!hasStarted) setHasStarted(true);
    onProgress(watchTimeSeconds);
  };

  const handleVideoComplete = () => {
    if (!isCompleted) {
      onComplete();
    }
    setShowNextSuggestion(true);
  };

  const progressPercentage = effectiveDuration > 0 
    ? Math.min((watchTime / effectiveDuration) * 100, 100)
    : 0;

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
            onClick={onBack}
            className="aurora-glass border-aurora-electric-purple/30 hover:bg-aurora-electric-purple/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Curso
          </Button>
        </div>

        {/* Course & Lesson Info */}
        <div className="aurora-glass rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-aurora-teal border-aurora-teal">
              {courseTitle}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Concluída
              </Badge>
            )}
          </div>
          
          <h1 className="aurora-text-gradient text-3xl font-light mb-4">
            {lesson.title}
          </h1>
          
          {lesson.description && (
            <p className="aurora-body text-white/70 mb-6">
              {lesson.description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-aurora-electric-purple" />
                <div>
                  <p className="text-sm text-white/60">Aula</p>
                  <p className="text-lg font-semibold text-white">{lesson.order_index}</p>
                </div>
              </div>
            </div>
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-aurora-teal" />
                <div>
                  <p className="text-sm text-white/60">Duração</p>
                  <p className="text-lg font-semibold text-white">
                    {lesson.duration_minutes || 0} min
                  </p>
                </div>
              </div>
            </div>
            <div className="aurora-glass p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-aurora-lavender" />
                <div>
                  <p className="text-sm text-white/60">Progresso</p>
                  <p className="text-lg font-semibold text-white">
                    {Math.round(progressPercentage)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {hasStarted && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Progresso da Aula</span>
                <span>{Math.round(progressPercentage)}% assistido</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VimeoPlayer
            vimeoUrl={lesson.vimeo_url}
            title={lesson.title}
            onProgress={handleVideoProgress}
            onComplete={handleVideoComplete}
            autoPlay={true}
            initialTime={watchTime}
            onDurationChange={(d) => setVideoDuration(d)}
          />
        </div>

        {/* Navegação entre aulas */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button variant="outline" disabled={!hasPrevious} onClick={() => onPrevious && onPrevious()}>
            Anterior
          </Button>
          <Button className="aurora-button" disabled={!hasNext} onClick={() => onNext && onNext()}>
            Próxima aula
          </Button>
        </div>

        {showNextSuggestion && hasNext && (
          <Card className="aurora-glass border-aurora-electric-purple/20 mb-8">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Pronto! Vá para a próxima aula</h3>
                <p className="text-white/70">Continue seu progresso sem perder o ritmo.</p>
              </div>
              <Button className="aurora-button" onClick={() => onNext && onNext()}>Ir para a próxima</Button>
            </CardContent>
          </Card>
        )}

        {/* Feedback */}
        <div className="mb-12">
          <LessonFeedback lessonId={lesson.id} />
        </div>

        {/* Completion Status */}
        {isCompleted && (
          <Card className="aurora-glass border-green-500/30 bg-green-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Aula Concluída!
                  </h3>
                  <p className="text-white/70">
                    Parabéns! Você completou esta aula com sucesso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};