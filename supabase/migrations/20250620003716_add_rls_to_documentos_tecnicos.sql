-- Habilitar RLS na tabela documentos_tecnicos
ALTER TABLE public.documentos_tecnicos ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode visualizar documentos com status 'ativo'
-- Importante: Se já existir uma política de SELECT, esta pode precisar ser ajustada ou substituir a existente.
-- Verifique as políticas existentes antes de aplicar.
CREATE POLICY "Anyone can view active documents"
  ON public.documentos_tecnicos
  FOR SELECT
  USING (status = 'ativo');

-- Política: Usuários autenticados podem criar documentos
-- Importante: Se já existir uma política de INSERT, esta pode precisar ser ajustada.
CREATE POLICY "Authenticated users can create documents"
  ON public.documentos_tecnicos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política (Exemplo): Proprietários de documentos podem atualizar seus próprios documentos
-- Esta política é um exemplo e pode precisar ser ajustada conforme a lógica de propriedade
-- Assumindo que 'criado_por' armazena o UUID do usuário que criou o documento.
CREATE POLICY "Owners can update their own documents"
  ON public.documentos_tecnicos
  FOR UPDATE
  USING (auth.uid() = criado_por)
  WITH CHECK (auth.uid() = criado_por);

-- Política (Exemplo): Proprietários de documentos podem deletar seus próprios documentos
CREATE POLICY "Owners can delete their own documents"
  ON public.documentos_tecnicos
  FOR DELETE
  USING (auth.uid() = criado_por);

-- Forçar RLS para proprietários de tabelas (Boa Prática de Segurança)
ALTER TABLE public.documentos_tecnicos FORCE ROW LEVEL SECURITY;
ALTER TABLE public.document_translations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_history FORCE ROW LEVEL SECURITY;
