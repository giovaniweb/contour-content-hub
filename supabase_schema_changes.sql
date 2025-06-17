-- 1. Adicionar campo `resumo` à tabela `documentos_tecnicos`
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documentos_tecnicos') THEN
        ALTER TABLE public.documentos_tecnicos
        ADD COLUMN IF NOT EXISTS resumo TEXT NULL;
    ELSE
        RAISE NOTICE 'Tabela documentos_tecnicos não encontrada. A coluna resumo não foi adicionada.';
    END IF;
END $$;

-- 2. Criar tabela `perguntas_artigos`
CREATE TABLE IF NOT EXISTS public.perguntas_artigos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    artigo_id UUID NOT NULL REFERENCES public.documentos_tecnicos(id) ON DELETE CASCADE,
    pergunta TEXT NOT NULL,
    resposta TEXT NULL,
    idioma VARCHAR(10) NULL,
    criado_em TIMESTAMPTZ DEFAULT now()
);

-- Adicionar índices para `user_id` e `artigo_id`
CREATE INDEX IF NOT EXISTS idx_perguntas_artigos_user_id ON public.perguntas_artigos(user_id);
CREATE INDEX IF NOT EXISTS idx_perguntas_artigos_artigo_id ON public.perguntas_artigos(artigo_id);

COMMENT ON TABLE public.perguntas_artigos IS 'Armazena perguntas feitas por usuários sobre artigos técnicos e suas respectivas respostas.';
COMMENT ON COLUMN public.perguntas_artigos.id IS 'Identificador único da pergunta.';
COMMENT ON COLUMN public.perguntas_artigos.user_id IS 'ID do usuário que fez a pergunta (referencia auth.users).';
COMMENT ON COLUMN public.perguntas_artigos.artigo_id IS 'ID do documento técnico ao qual a pergunta se refere (referencia documentos_tecnicos).';
COMMENT ON COLUMN public.perguntas_artigos.pergunta IS 'O texto da pergunta feita pelo usuário.';
COMMENT ON COLUMN public.perguntas_artigos.resposta IS 'O texto da resposta gerada ou fornecida.';
COMMENT ON COLUMN public.perguntas_artigos.idioma IS 'Idioma da pergunta/resposta (ex: pt-BR, en-US).';
COMMENT ON COLUMN public.perguntas_artigos.criado_em IS 'Timestamp de quando a pergunta foi criada.';

-- 3. Definir Políticas de Row Level Security (RLS) para `documentos_tecnicos`

-- Habilitar RLS para a tabela `documentos_tecnicos` (apenas se a tabela existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documentos_tecnicos') THEN
        ALTER TABLE public.documentos_tecnicos ENABLE ROW LEVEL SECURITY;

        -- Política: Usuários autenticados podem ler todos os documentos.
        -- (Ajustar se houver campos como publico BOOLEAN ou owner_id UUID)
        DROP POLICY IF EXISTS "Authenticated users can read technical documents" ON public.documentos_tecnicos;
        CREATE POLICY "Authenticated users can read technical documents"
        ON public.documentos_tecnicos
        FOR SELECT
        TO authenticated
        USING (true);

        -- Política: Usuários autenticados podem inserir novos documentos.
        -- (Esta política é genérica. Se um campo user_id/criado_por_id for adicionado,
        -- ele deve ser populado automaticamente, possivelmente via trigger ou default auth.uid())
        DROP POLICY IF EXISTS "Authenticated users can insert technical documents" ON public.documentos_tecnicos;
        CREATE POLICY "Authenticated users can insert technical documents"
        ON public.documentos_tecnicos
        FOR INSERT
        TO authenticated
        WITH CHECK (true);

        -- Políticas de UPDATE e DELETE para documentos_tecnicos:
        -- Conforme a nota, se não houver um campo de proprietário (ex: user_id) na tabela
        -- documentos_tecnicos, políticas específicas do proprietário não podem ser criadas.
        -- Para segurança, não adicionaremos políticas permissivas de UPDATE/DELETE sem um
        -- critério de propriedade. Elas precisariam ser mais restritivas (ex: para um role específico)
        -- ou a tabela precisaria ser modificada para incluir um owner_id.

        -- Exemplo (COMENTADO) de como seria se existisse um campo `user_id` em `documentos_tecnicos`:
        /*
        -- DROP POLICY IF EXISTS "Users can update their own technical documents" ON public.documentos_tecnicos;
        -- CREATE POLICY "Users can update their own technical documents"
        -- ON public.documentos_tecnicos
        -- FOR UPDATE
        -- TO authenticated
        -- USING (auth.uid() = user_id) -- Supondo que 'user_id' é a coluna do proprietário
        -- WITH CHECK (auth.uid() = user_id);

        -- DROP POLICY IF EXISTS "Users can delete their own technical documents" ON public.documentos_tecnicos;
        -- CREATE POLICY "Users can delete their own technical documents"
        -- ON public.documentos_tecnicos
        -- FOR DELETE
        -- TO authenticated
        -- USING (auth.uid() = user_id); -- Supondo que 'user_id' é a coluna do proprietário
        */
        RAISE NOTICE 'RLS habilitada e políticas básicas de leitura/inserção criadas para documentos_tecnicos.';
    ELSE
        RAISE NOTICE 'Tabela documentos_tecnicos não encontrada. RLS e políticas não aplicadas.';
    END IF;
END $$;


-- 4. Definir Políticas de Row Level Security (RLS) para `perguntas_artigos`

-- Habilitar RLS para a tabela `perguntas_artigos`
ALTER TABLE public.perguntas_artigos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler apenas suas próprias perguntas.
DROP POLICY IF EXISTS "Users can read their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can read their own questions"
ON public.perguntas_artigos
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Usuários podem inserir novas perguntas para si mesmos.
DROP POLICY IF EXISTS "Users can insert their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can insert their own questions"
ON public.perguntas_artigos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias perguntas.
DROP POLICY IF EXISTS "Users can update their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can update their own questions"
ON public.perguntas_artigos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias perguntas.
DROP POLICY IF EXISTS "Users can delete their own questions" ON public.perguntas_artigos;
CREATE POLICY "Users can delete their own questions"
ON public.perguntas_artigos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

RAISE NOTICE 'RLS habilitada e políticas CRUD criadas para perguntas_artigos.';

-- Adicionar comentários sobre as políticas para facilitar o entendimento futuro
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documentos_tecnicos') THEN
        COMMENT ON POLICY "Authenticated users can read technical documents" ON public.documentos_tecnicos IS 'Permite que qualquer usuário autenticado leia qualquer documento técnico. Ajustar se houver requisitos de privacidade mais granulares.';
        COMMENT ON POLICY "Authenticated users can insert technical documents" ON public.documentos_tecnicos IS 'Permite que qualquer usuário autenticado insira novos documentos. Considerar adicionar um campo owner_id e definir seu valor para auth.uid() na inserção.';
    END IF;

    COMMENT ON POLICY "Users can read their own questions" ON public.perguntas_artigos IS 'Permite que usuários autenticados visualizem apenas as perguntas que eles mesmos criaram.';
    COMMENT ON POLICY "Users can insert their own questions" ON public.perguntas_artigos IS 'Permite que usuários autenticados criem novas perguntas, garantindo que o user_id seja o deles.';
    COMMENT ON POLICY "Users can update their own questions" ON public.perguntas_artigos IS 'Permite que usuários autenticados atualizem apenas as perguntas que eles mesmos criaram.';
    COMMENT ON POLICY "Users can delete their own questions" ON public.perguntas_artigos IS 'Permite que usuários autenticados deletem apenas as perguntas que eles mesmos criaram.';
END $$;
