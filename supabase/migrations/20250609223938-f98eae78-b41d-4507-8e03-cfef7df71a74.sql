
-- Limpar dados duplicados existentes, mantendo apenas o registro mais recente
WITH ranked_diagnostics AS (
  SELECT 
    id,
    session_id,
    user_id,
    clinic_type,
    specialty,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, clinic_type, specialty, is_completed 
      ORDER BY created_at DESC
    ) as rn
  FROM marketing_diagnostics
),
duplicates_to_delete AS (
  SELECT id 
  FROM ranked_diagnostics 
  WHERE rn > 1
)
DELETE FROM marketing_diagnostics 
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Adicionar índice composto para melhorar performance das consultas de duplicação
CREATE INDEX IF NOT EXISTS idx_marketing_diagnostics_dedup 
ON marketing_diagnostics (user_id, clinic_type, specialty, is_completed);
