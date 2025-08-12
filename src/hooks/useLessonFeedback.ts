import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LessonFeedbackEntry {
  id: string;
  user_id: string;
  lesson_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  user_name?: string | null;
  avatar_url?: string | null;
}

export const useLessonFeedback = (lessonId: string) => {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<LessonFeedbackEntry[]>([]);
  const [myFeedback, setMyFeedback] = useState<LessonFeedbackEntry | null>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      setLoading(true);
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id || null;

      const [{ data: list, error: listError }, { data: mine, error: mineError }] = await Promise.all([
        supabase
          .from('academy_lesson_feedback')
          .select('id, user_id, lesson_id, rating, comment, created_at')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: false })
          .limit(20),
        userId
          ? supabase
              .from('academy_lesson_feedback')
              .select('id, user_id, lesson_id, rating, comment, created_at')
              .eq('lesson_id', lessonId)
              .eq('user_id', userId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null })
      ]);

      if (listError) throw listError;
      if (mineError) throw mineError;

      let enriched: LessonFeedbackEntry[] = (list as LessonFeedbackEntry[]) || [];
      if (enriched.length) {
        const ids = Array.from(new Set(enriched.map(f => f.user_id)));
        const { data: profiles, error: profError } = await supabase
          .from('perfis')
          .select('id, nome, foto_url')
          .in('id', ids);
        if (!profError && profiles) {
          const map = new Map((profiles as any[]).map((p) => [p.id, p]));
          enriched = enriched.map((f) => {
            const p: any = map.get(f.user_id);
            return { ...f, user_name: p?.nome ?? null, avatar_url: p?.foto_url ?? null };
          });
        }
      }

      setFeedback(enriched);
      setMyFeedback((mine as any) || null);
    } catch (e) {
      console.error('Error loading lesson feedback', e);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (rating: number, comment?: string) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) {
        toast({ title: 'Faça login', description: 'Você precisa estar autenticado para avaliar.', variant: 'destructive' });
        return false;
      }

      const { error } = await supabase
        .from('academy_lesson_feedback')
        .upsert(
          [
            {
              user_id: userId,
              lesson_id: lessonId,
              rating,
              comment: comment?.trim() || null
            }
          ],
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw error;

      toast({ title: 'Obrigado pela sua avaliação!', description: 'Seu feedback foi salvo com sucesso.' });
      await fetchAll();
      return true;
    } catch (e) {
      console.error('Error submitting feedback', e);
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar seu feedback.', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    if (lessonId) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const { average, count } = useMemo(() => {
    const count = feedback.length;
    const sum = feedback.reduce((acc, f) => acc + (f.rating || 0), 0);
    const average = count ? Math.round((sum / count) * 10) / 10 : 0;
    return { average, count };
  }, [feedback]);

  return { loading, feedback, myFeedback, average, count, submitFeedback, refresh: fetchAll };
};
