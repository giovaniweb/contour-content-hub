
-- Adicionar categoria aos equipamentos para segmentação de clínicas
ALTER TABLE equipamentos 
ADD COLUMN IF NOT EXISTS categoria text DEFAULT 'estetico' CHECK (categoria IN ('medico', 'estetico'));

-- Atualizar equipamentos existentes com suas categorias corretas
UPDATE equipamentos SET categoria = 'medico' 
WHERE nome IN ('Unyque PRO', 'Reverso', 'Enygma X-Orbital', 'Ultralift - Endolaser');

UPDATE equipamentos SET categoria = 'estetico' 
WHERE nome IN ('Crystal 3D Plus', 'Multishape', 'Focuskin', 'Hive Pro', 'X-Tonus', 'Supreme Pro');

-- Melhorar tabela de roteiros com metadados do FLUIDAROTEIRISTA
ALTER TABLE roteiros 
ADD COLUMN IF NOT EXISTS formato text,
ADD COLUMN IF NOT EXISTS emocao_central text,
ADD COLUMN IF NOT EXISTS intencao text,
ADD COLUMN IF NOT EXISTS mentor_usado text,
ADD COLUMN IF NOT EXISTS clinic_type text,
ADD COLUMN IF NOT EXISTS equipamento_principal text,
ADD COLUMN IF NOT EXISTS objetivo_marketing text;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_roteiros_mentor ON roteiros(mentor_usado);
CREATE INDEX IF NOT EXISTS idx_roteiros_formato ON roteiros(formato);
CREATE INDEX IF NOT EXISTS idx_equipamentos_categoria ON equipamentos(categoria);
