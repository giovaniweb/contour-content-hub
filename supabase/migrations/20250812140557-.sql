-- Fix linter: set search_path on RPC function
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
$$ LANGUAGE sql STABLE
SET search_path TO public;