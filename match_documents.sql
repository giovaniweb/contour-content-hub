-- Certifique-se de que a extensão pgvector está habilitada:
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Função para buscar documentos semanticamente similares
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector, -- O vetor da consulta de busca
  match_threshold float,  -- Limiar de similaridade (ex: 0.7)
  match_count int,        -- Número máximo de resultados a retornar
  article_type text DEFAULT 'artigo_cientifico' -- Tipo de artigo a ser buscado
)
RETURNS TABLE (
  id uuid,
  titulo text,
  resumo text,
  -- descricao text, -- Adicionar se também for relevante para o snippet de resultado
  conteudo_extraido text, -- Pode ser muito longo, considere se realmente necessário aqui
  -- tipo text, -- Se precisar retornar o tipo
  -- keywords text[], -- Se precisar retornar palavras-chave
  -- researchers text[], -- Se precisar retornar pesquisadores
  -- pdfUrl text, -- Se precisar retornar a URL do PDF
  -- data_criacao timestamptz, -- Se precisar retornar data de criação
  similarity float
)
LANGUAGE sql STABLE -- STABLE porque não modifica o banco de dados e sempre retorna o mesmo resultado para os mesmos inputs
AS $$
  SELECT
    dt.id,
    dt.titulo,
    dt.resumo,
    -- dt.descricao,
    dt.conteudo_extraido, -- Retornando para possível uso no frontend, mas pode ser removido se for muito grande
    -- dt.tipo,
    -- dt.keywords,
    -- dt.researchers,
    -- dt.pdfUrl,
    -- dt.data_criacao,
    1 - (dt.vetor_embeddings <=> query_embedding) AS similarity
  FROM
    public.documentos_tecnicos AS dt
  WHERE
    (1 - (dt.vetor_embeddings <=> query_embedding)) > match_threshold AND
    dt.tipo = article_type -- Adiciona o filtro por tipo de artigo
  ORDER BY
    similarity DESC
  LIMIT match_count;
$$;

-- Exemplo de como chamar a função (para teste no Supabase SQL Editor):
/*
SELECT * FROM match_documents(
  '[...seu_vetor_de_embedding_aqui...]', -- Substitua pelo seu vetor de embedding de consulta
  0.5, -- Limiar de similaridade
  5,   -- Número de resultados
  'artigo_cientifico' -- Tipo de artigo
);
*/

-- Nota sobre o campo vetor_embeddings:
-- Certifique-se de que a coluna 'vetor_embeddings' na tabela 'documentos_tecnicos'
-- seja do tipo 'vector(dimensao)', onde 'dimensao' é a dimensão dos seus embeddings
-- (ex: 1536 para text-embedding-ada-002 ou text-embedding-3-small).
-- Ex: ALTER TABLE documentos_tecnicos ADD COLUMN vetor_embeddings vector(1536);

-- Considere criar um índice GIN ou HNSW na coluna vetor_embeddings para otimizar a busca:
-- CREATE INDEX IF NOT EXISTS idx_documentos_tecnicos_vetor_embeddings
-- ON documentos_tecnicos
-- USING hnsw (vetor_embeddings vector_cosine_ops); -- Para HNSW (geralmente mais rápido para grandes datasets)
-- ou
-- USING ivfflat (vetor_embeddings vector_cosine_ops) WITH (lists = 100); -- Para IVFFlat (ajuste 'lists')
-- A escolha do índice depende do tamanho do dataset e dos requisitos de performance. HNSW é uma boa escolha geral.
-- Verifique a documentação do pgvector para as melhores práticas de indexação.
-- Lembre-se que o nome do operador de classe pode variar (vector_l2_ops, vector_ip_ops) dependendo da métrica de distância usada na criação do índice.
-- Para similaridade de cosseno (1 - distancia_cosseno), use vector_cosine_ops.
