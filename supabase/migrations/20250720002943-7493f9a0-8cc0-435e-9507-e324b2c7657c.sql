-- Ajustar política RLS para permitir visualização de fotos públicas de equipamentos
-- sem necessidade de autenticação para fotos marcadas como públicas

-- Primeiro, remover a política restritiva atual
DROP POLICY IF EXISTS "Usuários podem ver fotos públicas e suas próprias" ON equipment_photos;

-- Criar nova política que permite visualizar fotos públicas sem autenticação
CREATE POLICY "Fotos públicas podem ser vistas por todos" 
ON equipment_photos 
FOR SELECT 
USING (is_public = true);

-- Política para usuários autenticados verem suas próprias fotos (públicas ou privadas)
CREATE POLICY "Usuários podem ver suas próprias fotos" 
ON equipment_photos 
FOR SELECT 
USING (auth.uid() = user_id);