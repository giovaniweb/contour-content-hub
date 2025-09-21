-- Adicionar campo equipamentos na tabela fotos
ALTER TABLE public.fotos 
ADD COLUMN equipamentos text[] DEFAULT '{}';

-- Adicionar comentário para documentação
COMMENT ON COLUMN public.fotos.equipamentos IS 'Array de nomes/IDs dos equipamentos relacionados à foto';