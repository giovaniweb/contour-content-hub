-- FASE 6: Corrigir problemas finais de segurança

-- 1. Proteger tabela before_after_photos (dados médicos sensíveis)
ALTER TABLE public.before_after_photos ENABLE ROW LEVEL SECURITY;

-- Remover exposição pública
DROP POLICY IF EXISTS "Public can view before after photos" ON public.before_after_photos;
DROP POLICY IF EXISTS "Anyone can view photos" ON public.before_after_photos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.before_after_photos;

-- 2. Proteger tabela equipment_photo_likes
ALTER TABLE public.equipment_photo_likes ENABLE ROW LEVEL SECURITY;

-- Remover exposição pública
DROP POLICY IF EXISTS "Public can view likes" ON public.equipment_photo_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.equipment_photo_likes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.equipment_photo_likes;

-- Permitir apenas acesso autenticado aos likes
CREATE POLICY "Authenticated users can view photo likes" 
ON public.equipment_photo_likes 
FOR SELECT 
TO authenticated
USING (true);

-- Usuários podem criar seus próprios likes
CREATE POLICY "Users can create own likes" 
ON public.equipment_photo_likes 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Usuários podem remover seus próprios likes
CREATE POLICY "Users can delete own likes" 
ON public.equipment_photo_likes 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- 3. Proteger outras tabelas sensíveis que podem estar expostas
-- Verificar e proteger videomaker_avaliacoes se existir
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videomaker_avaliacoes') THEN
    ALTER TABLE public.videomaker_avaliacoes ENABLE ROW LEVEL SECURITY;
    
    -- Remover exposição pública se existir
    DROP POLICY IF EXISTS "Public can view videomaker reviews" ON public.videomaker_avaliacoes;
    
    -- Permitir apenas acesso autenticado
    EXECUTE 'CREATE POLICY "Authenticated users can view videomaker reviews" ON public.videomaker_avaliacoes FOR SELECT TO authenticated USING (true)';
  END IF;
END $$;

-- 4. Proteger downloads se não estiver protegido
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'video_downloads') THEN
    ALTER TABLE public.video_downloads ENABLE ROW LEVEL SECURITY;
    
    -- Remover exposição pública se existir
    DROP POLICY IF EXISTS "Public can view downloads" ON public.video_downloads;
    
    -- Permitir apenas acesso do próprio usuário e admins
    EXECUTE 'CREATE POLICY "Users can view own downloads" ON public.video_downloads FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin())';
    EXECUTE 'CREATE POLICY "Users can create own downloads" ON public.video_downloads FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())';
  END IF;
END $$;