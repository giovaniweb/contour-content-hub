-- Migration script from 'documentos_tecnicos' to 'unified_documents'

-- Step 1: Insert scientific articles from 'documentos_tecnicos' into 'unified_documents'
-- This script assumes that 'id' from 'documentos_tecnicos' will NOT be reused as primary key in 'unified_documents'.
-- New UUIDs will be generated for 'unified_documents.id'.
-- We will store the old ID in a temporary column or handle mapping if needed for triggering processing later,
-- or simply rely on selecting all newly added 'artigo_cientifico' type documents with 'pendente' status.

-- Add a temporary column to unified_documents to store the old ID, if needed for later reference.
-- This is optional and can be removed after migration and processing.
-- ALTER TABLE public.unified_documents ADD COLUMN IF NOT EXISTS old_documentos_tecnicos_id UUID;

INSERT INTO public.unified_documents (
    -- id, -- Let it use default gen_random_uuid()
    tipo_documento,
    titulo_extraido,
    palavras_chave,
    autores,
    raw_text,          -- Using 'conteudo_extraido' as 'raw_text' for AI to process
    texto_completo,    -- Will be filled by AI processing
    data_upload,       -- Using 'data_criacao' as 'data_upload'
    equipamento_id,
    user_id,           -- Assuming 'criado_por' stores a valid auth.users UUID
    file_path,         -- This is the tricky part, needs careful handling (see notes below)
    status_processamento,
    detalhes_erro,
    created_at,        -- Using 'data_criacao'
    updated_at
    -- old_documentos_tecnicos_id -- if using the temporary column
)
SELECT
    -- gen_random_uuid(), -- New ID for unified_documents
    'artigo_cientifico' AS tipo_documento,
    dt.titulo AS titulo_extraido,
    dt.keywords AS palavras_chave,
    dt.researchers AS autores,
    dt.conteudo_extraido AS raw_text,
    NULL AS texto_completo, -- To be populated by the 'process-document' function
    COALESCE(dt.data_criacao, NOW()) AS data_upload,
    dt.equipamento_id,
    CASE
        WHEN dt.criado_por IS NOT NULL THEN dt.criado_por -- Assuming dt.criado_por is a UUID referencing auth.users
        ELSE NULL
    END AS user_id,
    -- Handling file_path:
    -- If dt.arquivo_url is a Supabase storage URL like 'https://<project_ref>.supabase.co/storage/v1/object/public/documents/path/to/file.pdf'
    -- then file_path should be 'path/to/file.pdf'.
    -- This extraction logic is complex for pure SQL. It's better to set it to NULL here
    -- and handle it during a separate update step or assume processing will fail if path is needed and missing.
    -- For a direct Supabase URL, the path is typically after '/documents/'.
    -- Example (very basic, might need adjustment based on actual URL structure):
    -- CASE
    --    WHEN dt.arquivo_url LIKE '%/storage/v1/object/public/documents/%'
    --    THEN substring(dt.arquivo_url from '%/documents/(.*)')
    --    ELSE NULL -- Or keep dt.arquivo_url if it's just the path already, or handle dropbox links differently
    -- END AS file_path,
    NULL AS file_path, -- Set to NULL initially. Post-migration script/manual update might be needed for file_path.
                       -- If files need re-uploading, this will be essential.
                       -- If 'process-document' can work with public URLs directly (not recommended for new flow), this could be dt.arquivo_url.

    'pendente' AS status_processamento, -- Mark as 'pendente' for reprocessing by the new function
    NULL AS detalhes_erro,
    COALESCE(dt.data_criacao, NOW()) AS created_at,
    NOW() AS updated_at
    -- dt.id AS old_documentos_tecnicos_id -- if using the temporary column
FROM public.documentos_tecnicos dt
WHERE dt.tipo = 'artigo_cientifico' -- Ensure we only migrate scientific articles
AND NOT EXISTS ( -- Avoid duplicate migration if script is run multiple times, based on old ID if we had a mapping column
    SELECT 1 FROM public.unified_documents ud WHERE ud.titulo_extraido = dt.titulo AND ud.tipo_documento = 'artigo_cientifico'
    -- This is a weak check for duplicates. A proper check would use a unique identifier from the old table if possible.
    -- If `old_documentos_tecnicos_id` was added, the check would be: ud.old_documentos_tecnicos_id = dt.id
);

-- Note on file_path:
-- The `file_path` column in `unified_documents` is intended to store the path within your Supabase 'documents' bucket.
-- If your old `documentos_tecnicos.arquivo_url` fields contain full public URLs, or links to external services like Dropbox,
-- these files ideally need to be:
-- 1. Downloaded.
-- 2. Re-uploaded to the 'documents' bucket in Supabase Storage.
-- 3. The `file_path` in `unified_documents` updated with the new storage path.
-- This SQL migration script sets `file_path` to NULL. A separate script (e.g., Python, TypeScript using Supabase client libraries)
-- would be more suitable for handling the file download/re-upload and updating these `file_path` fields.
-- Without a valid `file_path`, the 'process-document' function will likely fail for these migrated documents
-- as it expects to download the PDF from Supabase Storage using this path.

-- After running this migration, you would typically run a script to:
-- 1. For each migrated document where `file_path` is NULL:
--    a. If `documentos_tecnicos.arquivo_url` was a direct Supabase public URL: extract the path and update `unified_documents.file_path`.
--    b. If `documentos_tecnicos.arquivo_url` was an external URL (e.g., Dropbox):
--       i.   Download the file from the external URL.
--       ii.  Upload it to your Supabase 'documents' bucket (e.g., under `unified_documents/{user_id_of_uploader}/{new_file_name}`).
--       iii. Update `unified_documents.file_path` with the new path in storage.
-- 2. Once `file_path` is correctly populated, trigger the 'process-document' Supabase function for all these
--    migrated documents (e.g., by selecting their IDs from `unified_documents` where `status_processamento = 'pendente'`
--    and `tipo_documento = 'artigo_cientifico'`).

-- Example of how you might select IDs to trigger processing (conceptual):
-- SELECT id FROM public.unified_documents WHERE status_processamento = 'pendente' AND tipo_documento = 'artigo_cientifico';
-- Then, for each ID, invoke the 'process-document' function.

-- If you added the temporary `old_documentos_tecnicos_id` column and want to remove it after processing:
-- ALTER TABLE public.unified_documents DROP COLUMN IF EXISTS old_documentos_tecnicos_id;

COMMENT ON COLUMN public.unified_documents.raw_text IS 'Contains migrated "conteudo_extraido" from old table for articles, awaiting AI processing for "texto_completo".';

-- End of migration script
