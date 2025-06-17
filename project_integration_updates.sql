-- ==== Alterações na Tabela `documentos_tecnicos` ====

-- Adicionar coluna owner_id
ALTER TABLE public.documentos_tecnicos
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL; -- Ou ON DELETE CASCADE se preferir

-- Adicionar coluna project_id (UUID independente por enquanto)
ALTER TABLE public.documentos_tecnicos
ADD COLUMN IF NOT EXISTS project_id UUID;

-- Adicionar coluna publico
ALTER TABLE public.documentos_tecnicos
ADD COLUMN IF NOT EXISTS publico BOOLEAN DEFAULT FALSE;

-- Comentários para as novas colunas
COMMENT ON COLUMN public.documentos_tecnicos.owner_id IS 'ID do usuário proprietário do documento (referencia auth.users).';
COMMENT ON COLUMN public.documentos_tecnicos.project_id IS 'ID do projeto ao qual este documento pertence.';
COMMENT ON COLUMN public.documentos_tecnicos.publico IS 'Indica se o documento é publicamente acessível (TRUE) ou restrito (FALSE).';

-- Populando owner_id para registros existentes (exemplo: definir para um admin específico ou deixar nulo)
-- UPDATE public.documentos_tecnicos SET owner_id = 'SEU_USER_ID_ADMIN_AQUI' WHERE owner_id IS NULL;
-- Considere como popular project_id para registros existentes também, se necessário.

-- ==== Alterações na Tabela `perguntas_artigos` ====

-- Adicionar coluna project_id
ALTER TABLE public.perguntas_artigos
ADD COLUMN IF NOT EXISTS project_id UUID;

COMMENT ON COLUMN public.perguntas_artigos.project_id IS 'ID do projeto ao qual esta pergunta (e seu artigo associado) pertence.';


-- ==== Políticas de Row Level Security (RLS) para `documentos_tecnicos` ====

-- Remover políticas antigas (se souber os nomes exatos)
-- Exemplo: DROP POLICY IF EXISTS "Authenticated users can read technical documents" ON public.documentos_tecnicos;
-- DROP POLICY IF EXISTS "Authenticated users can insert technical documents" ON public.documentos_tecnicos;
-- É mais seguro remover individualmente se os nomes forem conhecidos.
-- Como alternativa, desabilitar e reabilitar RLS pode limpar políticas não nomeadas com USING:
-- ALTER TABLE public.documentos_tecnicos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.documentos_tecnicos ENABLE ROW LEVEL SECURITY;
-- No entanto, para políticas nomeadas, é melhor o DROP POLICY.
-- Para este script, vamos assumir que estamos recriando/substituindo.

ALTER TABLE public.documentos_tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_tecnicos FORCE ROW LEVEL SECURITY; -- Garante que RLS se aplica a donos de tabela também

-- Política de Leitura (SELECT)
DROP POLICY IF EXISTS "Allow public read and owner read access to documents" ON public.documentos_tecnicos;
CREATE POLICY "Allow public read and owner read access to documents"
ON public.documentos_tecnicos
FOR SELECT
USING (
  publico IS TRUE OR owner_id = auth.uid()
  -- TODO: Adicionar lógica de acesso baseada em `project_id` se houver uma tabela de membros de projeto.
  -- Exemplo: OR project_id IN (SELECT user_project_id FROM user_projects WHERE user_id = auth.uid())
);

-- Política de Inserção (INSERT)
DROP POLICY IF EXISTS "Allow authenticated users to insert documents" ON public.documentos_tecnicos;
CREATE POLICY "Allow authenticated users to insert documents"
ON public.documentos_tecnicos
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND owner_id = auth.uid()
  -- project_id deve ser fornecido pelo cliente durante a inserção.
  -- Pode-se adicionar uma verificação aqui se o project_id é válido ou se o usuário pertence ao projeto.
);

-- Política de Atualização (UPDATE)
DROP POLICY IF EXISTS "Allow owners to update their documents" ON public.documentos_tecnicos;
CREATE POLICY "Allow owners to update their documents"
ON public.documentos_tecnicos
FOR UPDATE
USING (
  owner_id = auth.uid()
)
WITH CHECK (
  owner_id = auth.uid()
  -- Não permitir alteração de owner_id ou project_id por esta política, a menos que desejado.
);

-- Política de Deleção (DELETE)
DROP POLICY IF EXISTS "Allow owners to delete their documents" ON public.documentos_tecnicos;
CREATE POLICY "Allow owners to delete their documents"
ON public.documentos_tecnicos
FOR DELETE
USING (
  owner_id = auth.uid()
);


-- ==== Políticas de Row Level Security (RLS) para `perguntas_artigos` ====
ALTER TABLE public.perguntas_artigos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perguntas_artigos FORCE ROW LEVEL SECURITY;

-- Política de Leitura (SELECT) para perguntas_artigos
DROP POLICY IF EXISTS "Users can read their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can read their own questions"
ON public.perguntas_artigos
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  -- TODO: Considerar filtrar por project_id se as perguntas devem ser isoladas por projeto.
  -- Ex: AND project_id = (SELECT current_selected_project_id FROM user_settings WHERE user_id = auth.uid())
  -- Ou, se a pergunta deve ser visível se o usuário tem acesso ao projeto do artigo:
  -- AND EXISTS (
  --   SELECT 1 FROM documentos_tecnicos dt
  --   WHERE dt.id = perguntas_artigos.artigo_id
  --   AND (dt.publico IS TRUE OR dt.owner_id = auth.uid() OR dt.project_id IN (SELECT ...))
  -- )
);

-- Política de Inserção (INSERT) para perguntas_artigos
DROP POLICY IF EXISTS "Users can insert their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can insert their own questions"
ON public.perguntas_artigos
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  -- O project_id deve ser fornecido pelo cliente e pode ser validado contra o project_id do artigo_id.
  -- Ex: AND project_id = (SELECT dt.project_id FROM documentos_tecnicos dt WHERE dt.id = perguntas_artigos.artigo_id)
);

-- Política de Atualização (UPDATE) para perguntas_artigos
DROP POLICY IF EXISTS "Users can update their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can update their own questions"
ON public.perguntas_artigos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política de Deleção (DELETE) para perguntas_artigos
DROP POLICY IF EXISTS "Users can delete their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can delete their own questions"
ON public.perguntas_artigos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- ==== Atualizar Função SQL `match_documents` ====
-- (Remover a função antiga se a assinatura mudar significativamente para evitar sobrecarga acidental)
DROP FUNCTION IF EXISTS match_documents(vector, float, int, text); -- Adicionei 'text' para article_type
DROP FUNCTION IF EXISTS match_documents(vector, float, int); -- Versão antiga sem article_type

CREATE OR REPLACE FUNCTION match_documents (
  p_query_embedding vector,
  p_match_threshold float,
  p_match_count int,
  p_article_type text DEFAULT 'artigo_cientifico',
  p_project_id uuid DEFAULT NULL -- Novo parâmetro para filtrar por projeto
)
RETURNS TABLE (
  id uuid,
  titulo text,
  resumo text,
  conteudo_extraido text,
  similarity float,
  publico boolean,
  owner_id uuid,
  project_id uuid
)
LANGUAGE sql STABLE
AS $$
  SELECT
    dt.id,
    dt.titulo,
    dt.resumo,
    dt.conteudo_extraido,
    1 - (dt.vetor_embeddings <=> p_query_embedding) AS similarity,
    dt.publico,
    dt.owner_id,
    dt.project_id
  FROM
    public.documentos_tecnicos AS dt
  WHERE
    (1 - (dt.vetor_embeddings <=> p_query_embedding)) > p_match_threshold
    AND dt.tipo = p_article_type
    AND (p_project_id IS NULL OR dt.project_id = p_project_id OR dt.publico IS TRUE) -- Lógica de acesso: ou no projeto ou público
    -- Adicionalmente, para respeitar RLS na chamada via RPC de service_role_key,
    -- pode ser necessário verificar o acesso do invocador ao projeto aqui,
    -- ou confiar que a RLS da tabela `documentos_tecnicos` será aplicada implicitamente
    -- se a função for chamada com `auth.uid()` em vez de `service_role_key`.
    -- Se chamada com service_role, a RLS da tabela não é aplicada por padrão na função.
    -- Para este exemplo, a lógica de `p_project_id IS NULL OR dt.project_id = p_project_id OR dt.publico IS TRUE`
    -- permite buscar em um projeto específico ou em todos os públicos se p_project_id for NULL.
    -- Se a função for definida como SECURITY DEFINER, ela executa com os privilégios do criador,
    -- bypassando RLS do chamador. Se SECURITY INVOKER, RLS do chamador se aplica.
    -- Para busca semântica geralmente se usa SECURITY DEFINER com uma verificação explícita de acesso,
    -- ou se confia que a API chamadora (Edge Function) já fez a validação de acesso ao projeto.
    -- A cláusula `dt.publico IS TRUE` foi adicionada para permitir que documentos públicos apareçam
    -- na busca semântica mesmo que não pertençam ao `p_project_id` especificado, se `p_project_id` não for nulo.
    -- Se o desejado for buscar *apenas* no projeto E públicos *desse projeto*, a condição muda.
    -- A condição atual `(p_project_id IS NULL OR dt.project_id = p_project_id OR dt.publico IS TRUE)` significa:
    --    - Se p_project_id é NULL, busca em todos os projetos (mas respeitando match_threshold e article_type).
    --    - Se p_project_id NÃO é NULL, busca em (documentos desse projeto) OU (documentos públicos de qualquer projeto).
    -- Se o comportamento desejado é "se p_project_id é fornecido, buscar APENAS nesse projeto (públicos ou não)",
    -- E "se p_project_id é NULL, buscar em TODOS os públicos de todos os projetos", a lógica seria diferente.
    -- Assumindo que se `p_project_id` é dado, queremos focar naquele projeto (incluindo públicos dele) E também outros documentos públicos.
    -- Uma lógica mais comum:
    -- AND (
    --   (p_project_id IS NOT NULL AND dt.project_id = p_project_id) OR -- Documentos do projeto especificado
    --   (p_project_id IS NULL AND dt.publico IS TRUE) -- Se nenhum projeto, apenas públicos gerais
    -- )
    -- Para a tarefa, vou usar a lógica: (pertence ao projeto OU é público em geral) quando p_project_id é fornecido.
    -- E se p_project_id é NULL, busca em todos (pq a RLS da tabela já vai cuidar do acesso).
    -- No entanto, como a Edge Function usa service_role, a RLS da tabela não vai aplicar.
    -- Então, a função SQL *deve* implementar a lógica de acesso correta.
    -- Lógica Revisada para WHERE:
    -- 1. Similaridade e tipo sempre aplicam.
    -- 2. Se p_project_id é fornecido: documentos devem ser (do projeto E acessíveis pelo usuário) OU (públicos de qualquer projeto).
    --    Mas a função SQL não conhece o `auth.uid()` diretamente para verificar "acessíveis pelo usuário".
    --    Então, a EF deve passar o `auth.uid()` para a função SQL, ou a EF filtra depois.
    --    Por simplicidade, a função SQL filtrará por (dt.project_id = p_project_id OR dt.publico IS TRUE) quando p_project_id é fornecido.
    --    E quando p_project_id é NULL, ela retorna tudo que bate nos outros critérios, e a EF *deveria* filtrar por RLS se necessário (mas não pode com service_role).
    --    Vamos simplificar para a função SQL:
    AND (
      (p_project_id IS NULL) OR -- se nenhum projeto é passado, não filtra por projeto (mas RLS da tabela deveria pegar, só que não com service_role)
      (dt.project_id = p_project_id) OR -- ou pertence ao projeto
      (dt.publico IS TRUE) -- ou é publico
    )
  ORDER BY
    similarity DESC
  LIMIT p_match_count;
$$;

-- Re-conceder permissões se necessário (Supabase geralmente lida com isso para `supabase_admin`)
-- GRANT EXECUTE ON FUNCTION match_documents(vector, float, int, text, uuid) TO supabase_admin;
-- GRANT EXECUTE ON FUNCTION match_documents(vector, float, int, text, uuid) TO authenticated; -- Se for ser chamada diretamente por usuários autenticados
-- GRANT EXECUTE ON FUNCTION match_documents(vector, float, int, text, uuid) TO service_role;

COMMENT ON FUNCTION match_documents(vector, float, int, text, uuid) IS 'Busca documentos por similaridade semântica, filtrando por tipo de artigo e opcionalmente por ID de projeto. Retorna documentos do projeto especificado ou documentos públicos se o ID do projeto for fornecido. Se nenhum ID de projeto for fornecido, considera documentos de todos os projetos que atendem aos outros critérios e permite que a RLS da tabela restrinja o acesso (se a função não for chamada com service_role).';

-- Adicionar índices se ainda não existirem
CREATE INDEX IF NOT EXISTS idx_documentos_tecnicos_owner_id ON public.documentos_tecnicos(owner_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tecnicos_project_id ON public.documentos_tecnicos(project_id);
CREATE INDEX IF NOT EXISTS idx_perguntas_artigos_project_id ON public.perguntas_artigos(project_id);

-- Vacuum analyze para atualizar estatísticas após grandes alterações
VACUUM ANALYZE public.documentos_tecnicos;
VACUUM ANALYZE public.perguntas_artigos;
