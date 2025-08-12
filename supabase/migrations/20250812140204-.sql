-- AI Knowledge and Copilot schema
-- 1) Tables

-- Knowledge sources (courses/lessons/articles)
CREATE TABLE IF NOT EXISTS public.ai_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL DEFAULT 'lesson', -- lesson | article | video | other
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID,
  lesson_id UUID,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  language TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chunks with embeddings
CREATE TABLE IF NOT EXISTS public.ai_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.ai_knowledge_sources(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  tokens INTEGER,
  embedding VECTOR(1536),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full transcripts per lesson/article
CREATE TABLE IF NOT EXISTS public.ai_lesson_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.ai_knowledge_sources(id) ON DELETE CASCADE,
  language TEXT,
  full_text TEXT NOT NULL,
  segments JSONB,
  word_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copilot chat sessions
CREATE TABLE IF NOT EXISTS public.copilot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copilot chat messages
CREATE TABLE IF NOT EXISTS public.copilot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.copilot_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user | assistant | system
  content TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Triggers for updated_at
CREATE TRIGGER update_ai_knowledge_sources_updated_at
BEFORE UPDATE ON public.ai_knowledge_sources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_knowledge_chunks_updated_at
BEFORE UPDATE ON public.ai_knowledge_chunks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_lesson_transcripts_updated_at
BEFORE UPDATE ON public.ai_lesson_transcripts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_copilot_sessions_updated_at
BEFORE UPDATE ON public.copilot_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Indexes
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_chunks_source ON public.ai_knowledge_chunks (source_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_sources_course_lesson ON public.ai_knowledge_sources (course_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_copilot_messages_session ON public.copilot_messages (session_id, created_at);

-- Vector index (cosine)
DO $$ BEGIN
  CREATE INDEX ai_knowledge_chunks_embedding_idx ON public.ai_knowledge_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
EXCEPTION WHEN OTHERS THEN
  -- Index may already exist or embedding is null initially
  NULL;
END $$;

-- 4) RLS
ALTER TABLE public.ai_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_lesson_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;

-- Admin helper condition
-- Policies for ai_knowledge_sources
CREATE POLICY IF NOT EXISTS "Admins manage knowledge sources"
ON public.ai_knowledge_sources
FOR ALL
USING (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Read knowledge sources by access"
ON public.ai_knowledge_sources
FOR SELECT
USING (
  is_public = true OR
  (course_id IS NOT NULL AND course_id IN (
    SELECT course_id FROM public.academy_user_course_access 
    WHERE user_id = auth.uid() AND status = 'approved'
  ))
);

-- Policies for ai_knowledge_chunks
CREATE POLICY IF NOT EXISTS "Admins manage knowledge chunks"
ON public.ai_knowledge_chunks
FOR ALL
USING (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Read knowledge chunks by source access"
ON public.ai_knowledge_chunks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.ai_knowledge_sources s
    WHERE s.id = ai_knowledge_chunks.source_id
      AND (
        s.is_public = true OR
        (s.course_id IS NOT NULL AND s.course_id IN (
          SELECT course_id FROM public.academy_user_course_access 
          WHERE user_id = auth.uid() AND status = 'approved'
        ))
      )
  )
);

-- Policies for ai_lesson_transcripts
CREATE POLICY IF NOT EXISTS "Admins manage transcripts"
ON public.ai_lesson_transcripts
FOR ALL
USING (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'));

CREATE POLICY IF NOT EXISTS "Read transcripts by source access"
ON public.ai_lesson_transcripts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.ai_knowledge_sources s
    WHERE s.id = ai_lesson_transcripts.source_id
      AND (
        s.is_public = true OR
        (s.course_id IS NOT NULL AND s.course_id IN (
          SELECT course_id FROM public.academy_user_course_access 
          WHERE user_id = auth.uid() AND status = 'approved'
        ))
      )
  )
);

-- Policies for copilot_sessions
CREATE POLICY IF NOT EXISTS "Users manage own copilot sessions"
ON public.copilot_sessions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admins can view all copilot sessions"
ON public.copilot_sessions
FOR SELECT
USING (auth.uid() IN (SELECT perfis.id FROM public.perfis WHERE perfis.role = 'admin'));

-- Policies for copilot_messages
CREATE POLICY IF NOT EXISTS "Read messages if own session"
ON public.copilot_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.copilot_sessions s
    WHERE s.id = copilot_messages.session_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Insert messages if own session"
ON public.copilot_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.copilot_sessions s
    WHERE s.id = copilot_messages.session_id AND s.user_id = auth.uid()
  )
);

-- 5) RPC for semantic search
CREATE OR REPLACE FUNCTION public.search_knowledge_chunks(
  p_embedding VECTOR,
  p_match_count INTEGER DEFAULT 6,
  p_course_id UUID DEFAULT NULL,
  p_lesson_id UUID DEFAULT NULL
)
RETURNS TABLE (
  chunk_id UUID,
  content TEXT,
  metadata JSONB,
  source_id UUID,
  title TEXT,
  course_id UUID,
  lesson_id UUID,
  score DOUBLE PRECISION
) AS $$
  SELECT 
    c.id AS chunk_id,
    c.content,
    c.metadata,
    c.source_id,
    s.title,
    s.course_id,
    s.lesson_id,
    1 - (c.embedding <=> p_embedding) AS score
  FROM public.ai_knowledge_chunks c
  JOIN public.ai_knowledge_sources s ON s.id = c.source_id
  WHERE (p_course_id IS NULL OR s.course_id = p_course_id)
    AND (p_lesson_id IS NULL OR s.lesson_id = p_lesson_id)
  ORDER BY c.embedding <=> p_embedding
  LIMIT GREATEST(COALESCE(p_match_count, 6), 1)
$$ LANGUAGE sql STABLE;