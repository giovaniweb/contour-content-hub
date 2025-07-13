-- Corrigir file_path dos documentos existentes para que apontem para URLs válidas
UPDATE unified_documents 
SET file_path = CASE 
  WHEN file_path IS NULL OR file_path = '' THEN 
    'https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/documents/' || user_id || '/' || titulo_extraido || '.pdf'
  WHEN file_path NOT LIKE 'http%' THEN 
    'https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/documents/' || file_path
  ELSE file_path
END
WHERE status_processamento = 'concluido';