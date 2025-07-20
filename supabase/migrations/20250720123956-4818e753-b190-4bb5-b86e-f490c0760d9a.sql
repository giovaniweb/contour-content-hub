-- Adicionar suporte a carrossel de imagens
ALTER TABLE downloads_storage 
ADD COLUMN is_carousel BOOLEAN DEFAULT FALSE,
ADD COLUMN carousel_images TEXT[];

-- Atualizar materiais existentes
UPDATE downloads_storage 
SET is_carousel = FALSE 
WHERE is_carousel IS NULL;

-- Adicionar comentário para documentação
COMMENT ON COLUMN downloads_storage.is_carousel IS 'Indica se o material é um carrossel com múltiplas imagens';
COMMENT ON COLUMN downloads_storage.carousel_images IS 'Array de URLs das imagens do carrossel (quando is_carousel = true)';