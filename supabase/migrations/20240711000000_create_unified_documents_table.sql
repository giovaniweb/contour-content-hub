-- Create ENUM types
CREATE TYPE public.document_type_enum AS ENUM (
    'artigo_cientifico',
    'ficha_tecnica',
    'protocolo',
    'folder_publicitario',
    'outro'
);

CREATE TYPE public.processing_status_enum AS ENUM (
    'pendente',
    'processando',
    'concluido',
    'falhou'
);

-- Create unified_documents table
CREATE TABLE public.unified_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_documento document_type_enum NOT NULL,
    titulo_extraido TEXT NULL,
    palavras_chave TEXT[] NULL,
    autores TEXT[] NULL,
    texto_completo TEXT NULL,
    raw_text TEXT NULL,
    data_upload TIMESTAMPTZ DEFAULT now() NOT NULL,
    equipamento_id UUID NULL REFERENCES public.equipamentos(id) ON DELETE SET NULL,
    user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    file_path TEXT NULL, -- Path to the file in Supabase Storage
    status_processamento processing_status_enum DEFAULT 'pendente' NOT NULL,
    detalhes_erro TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_unified_documents_tipo_documento ON public.unified_documents(tipo_documento);
CREATE INDEX idx_unified_documents_equipamento_id ON public.unified_documents(equipamento_id);
CREATE INDEX idx_unified_documents_user_id ON public.unified_documents(user_id);
CREATE INDEX idx_unified_documents_status_processamento ON public.unified_documents(status_processamento);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
CREATE TRIGGER trigger_unified_documents_updated_at
BEFORE UPDATE ON public.unified_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for unified_documents

-- Enable RLS
ALTER TABLE public.unified_documents ENABLE ROW LEVEL SECURITY;

-- Allow users to insert documents
CREATE POLICY "Allow authenticated users to insert documents"
ON public.unified_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own documents
CREATE POLICY "Allow users to select their own documents"
ON public.unified_documents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own documents (specific fields, e.g., reprocess request, or link equipment)
-- This might need refinement based on exact update scenarios allowed for users.
-- For now, let's assume users can update certain non-critical fields or trigger actions.
CREATE POLICY "Allow users to update their own documents"
ON public.unified_documents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- Allow users to delete their own documents
CREATE POLICY "Allow users to delete their own documents"
ON public.unified_documents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- Admin access (assuming an admin role or specific user IDs for admin)
-- This is a placeholder. Actual admin RLS depends on how admins are identified (e.g., a custom claim, a separate table of admins).
-- If you have an 'admin' role in custom claims:
-- CREATE POLICY "Allow admin full access"
-- ON public.unified_documents
-- FOR ALL
-- TO authenticated
-- USING (get_my_claim('user_role')::text = 'admin')
-- WITH CHECK (get_my_claim('user_role')::text = 'admin');

-- For simplicity, if there isn't a clear admin role defined via custom claims,
-- service_role key used by backend functions will bypass RLS.
-- For direct admin access from a client, a proper admin role check is needed.
-- Let's add a basic one that allows users with a 'admin' custom role to do anything.
-- This assumes you have a way to assign 'admin' roles.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE POLICY "Admins can manage all documents"
    ON public.unified_documents
    FOR ALL
    USING (get_my_claim('user_role')::text = 'admin')
    WITH CHECK (get_my_claim('user_role')::text = 'admin');
  ELSE
    -- Fallback or no admin policy if the role doesn't exist or custom claims aren't set up this way.
    -- Service role will bypass RLS anyway.
  END IF;
END $$;

-- Grant usage on enum types to authenticated and anon roles
GRANT USAGE ON TYPE public.document_type_enum TO authenticated, anon;
GRANT USAGE ON TYPE public.processing_status_enum TO authenticated, anon;

-- Grant usage on the table to roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.unified_documents TO authenticated;
GRANT ALL ON public.unified_documents TO service_role; -- Critical for backend functions

-- Grant usage on sequence if any (id has default, so not strictly needed for basic ops by user)
-- GRANT USAGE, SELECT ON SEQUENCE unified_documents_id_seq TO authenticated; -- Only if using SERIAL, not UUID

COMMENT ON TABLE public.unified_documents IS 'Stores all uploaded documents and their extracted metadata.';
COMMENT ON COLUMN public.unified_documents.file_path IS 'Full path to the document file in Supabase Storage.';
COMMENT ON COLUMN public.unified_documents.raw_text IS 'Raw text extracted from the PDF before OpenAI processing.';
COMMENT ON COLUMN public.unified_documents.texto_completo IS 'Processed text, potentially summarized or structured by AI.';
COMMENT ON COLUMN public.unified_documents.status_processamento IS 'Current processing status of the document.';
COMMENT ON COLUMN public.unified_documents.detalhes_erro IS 'Stores error messages if processing fails.';

-- Make sure the `equipamentos` table exists and has an `id` column if you are referencing it.
-- If `equipamentos` table is created in a later migration, this foreign key might need to be added later
-- or the migrations reordered. Assuming `equipamentos` exists.
-- Also, ensure `auth.users` table is available for `user_id` FK.
