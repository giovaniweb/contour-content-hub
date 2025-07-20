-- Remover fotos mockadas/genéricas da tabela equipment_photos
-- Essas fotos são do Unsplash e não são reais do equipamento Unyque PRO

DELETE FROM equipment_photos 
WHERE equipment_id = '6f3da6e1-4745-4106-9425-b9e2d6d231c5'
AND image_url LIKE '%unsplash.com%';