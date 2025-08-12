-- 1) Tabela de progresso por aula
CREATE TABLE IF NOT EXISTS public.academy_user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  watch_time_seconds integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.academy_user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Admin pode tudo
CREATE POLICY IF NOT EXISTS "Admins can manage all lesson progress"
ON public.academy_user_lesson_progress
AS PERMISSIVE FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

-- Usuário vê o próprio progresso
CREATE POLICY IF NOT EXISTS "Users can read own lesson progress"
ON public.academy_user_lesson_progress
AS PERMISSIVE FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Usuário cria/atualiza o próprio progresso
CREATE POLICY IF NOT EXISTS "Users can upsert own lesson progress"
ON public.academy_user_lesson_progress
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own lesson progress"
ON public.academy_user_lesson_progress
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.academy_user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON public.academy_user_lesson_progress(lesson_id);

CREATE TRIGGER set_timestamps_lesson_progress
BEFORE UPDATE ON public.academy_user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Tabela de feedback por aula
CREATE TABLE IF NOT EXISTS public.academy_lesson_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.academy_lesson_feedback ENABLE ROW LEVEL SECURITY;

-- Admin pode tudo
CREATE POLICY IF NOT EXISTS "Admins can manage all lesson feedback"
ON public.academy_lesson_feedback
AS PERMISSIVE FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

-- Qualquer usuário autenticado pode ler feedback
CREATE POLICY IF NOT EXISTS "Authenticated can read lesson feedback"
ON public.academy_lesson_feedback
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Usuário gerencia o próprio feedback
CREATE POLICY IF NOT EXISTS "Users can upsert own lesson feedback"
ON public.academy_lesson_feedback
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own lesson feedback"
ON public.academy_lesson_feedback
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_feedback_lesson ON public.academy_lesson_feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.academy_lesson_feedback(user_id);

CREATE TRIGGER set_timestamps_lesson_feedback
BEFORE UPDATE ON public.academy_lesson_feedback
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();