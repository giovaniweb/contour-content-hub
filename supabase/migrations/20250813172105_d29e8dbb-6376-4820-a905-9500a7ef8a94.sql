-- FASE 5: Corrigir problemas restantes de segurança

-- 1. Proteger tabela perfis - remover exposição pública
DROP POLICY IF EXISTS "Public can read perfis" ON public.perfis;
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.perfis;
DROP POLICY IF EXISTS "Enable read access" ON public.perfis;

-- Verificar se RLS está habilitado
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- 2. Proteger tabela equipment_photos
-- Remover exposição pública
DROP POLICY IF EXISTS "Public can view equipment photos" ON public.equipment_photos;
DROP POLICY IF EXISTS "Anyone can view photos" ON public.equipment_photos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.equipment_photos;

-- Habilitar RLS se não estiver habilitado
ALTER TABLE public.equipment_photos ENABLE ROW LEVEL SECURITY;

-- Permitir apenas fotos públicas ou do próprio usuário
CREATE POLICY "Users can view public photos or own photos" 
ON public.equipment_photos 
FOR SELECT 
TO authenticated
USING (is_public = true OR user_id = auth.uid());

-- 3. Proteger metadados de vídeos
-- Remover exposição pública ampla
DROP POLICY IF EXISTS "Public can view videos" ON public.videos;
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.videos;

-- Habilitar RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Permitir visualização apenas de vídeos públicos ou próprios
CREATE POLICY "Users can view public videos or own videos" 
ON public.videos 
FOR SELECT 
TO authenticated
USING (publico = true OR usuario_id = auth.uid());

-- Admin pode ver tudo
CREATE POLICY "Admins can view all videos" 
ON public.videos 
FOR ALL 
TO authenticated
USING (public.is_admin());

-- 4. Proteger informações de marcas
-- Remover exposição pública ampla
DROP POLICY IF EXISTS "Allow public access to brands" ON public.brands;
DROP POLICY IF EXISTS "Anyone can view brands" ON public.brands;

-- Habilitar RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Permitir apenas acesso autenticado
CREATE POLICY "Authenticated users can view brands" 
ON public.brands 
FOR SELECT 
TO authenticated
USING (true);

-- Admin pode gerenciar
CREATE POLICY "Admins can manage brands" 
ON public.brands 
FOR ALL 
TO authenticated
USING (public.is_admin());