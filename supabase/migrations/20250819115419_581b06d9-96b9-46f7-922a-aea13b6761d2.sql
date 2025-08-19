-- Corrigir aulas com duração 0 - usar duração padrão baseada na ordem da aula
UPDATE academy_lessons 
SET duration_minutes = CASE 
  WHEN duration_minutes = 0 OR duration_minutes IS NULL THEN 30 
  ELSE duration_minutes 
END
WHERE duration_minutes = 0 OR duration_minutes IS NULL;