-- Adicionar campo para relacionar materiais com equipamentos
ALTER TABLE downloads_storage ADD COLUMN equipment_ids UUID[] DEFAULT '{}';

-- Adicionar comentário para documentação
COMMENT ON COLUMN downloads_storage.equipment_ids IS 'Array de IDs dos equipamentos relacionados a este material de arte';