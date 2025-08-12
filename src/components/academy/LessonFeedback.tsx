import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLessonFeedback } from '@/hooks/useLessonFeedback';
import StarRating from '@/components/media-library/StarRating';

interface LessonFeedbackProps {
  lessonId: string;
}

export const LessonFeedback: React.FC<LessonFeedbackProps> = ({ lessonId }) => {
  const { loading, feedback, myFeedback, average, count, submitFeedback } = useLessonFeedback(lessonId);
  const [rating, setRating] = useState<number>(myFeedback?.rating || 0);
  const [comment, setComment] = useState<string>(myFeedback?.comment || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRating(myFeedback?.rating || 0);
    setComment(myFeedback?.comment || '');
  }, [myFeedback]);

  const handleRate = (r: number) => setRating(r);

  const handleSubmit = async () => {
    if (!rating) return;
    setSaving(true);
    try {
      await submitFeedback(rating, comment);
    } finally {
      setSaving(false);
    }
  };

  const roundedAvg = useMemo(() => average.toFixed(1), [average]);

  return (
    <Card className="aurora-glass border-aurora-electric-purple/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="aurora-text-gradient">Avalie esta aula</span>
          <span className="text-sm text-white/70">Média: {roundedAvg} ({count} avaliações)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StarRating rating={rating} isRating={false} onRate={handleRate} size="default" showValue />
          {rating > 0 && <span className="text-sm text-white/70">Sua nota</span>}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Deixe um comentário (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={saving || !rating}>
              {saving ? 'Salvando...' : 'Salvar feedback'}
            </Button>
          </div>
        </div>

        {!loading && feedback.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Comentários recentes</h4>
            <div className="grid gap-3">
              {feedback.map((f) => (
                <div key={f.id} className="aurora-glass p-3 rounded-xl border-aurora-electric-purple/10">
                  <div className="flex items-center justify-between">
                    <StarRating rating={f.rating} isRating={false} onRate={() => {}} size="small" />
                    <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
                  </div>
                  {f.comment && <p className="text-sm text-white/80 mt-2">{f.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
