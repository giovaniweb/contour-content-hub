-- Create privacy_terms table for admin-editable privacy policy
CREATE TABLE public.privacy_terms (
  id text PRIMARY KEY DEFAULT 'privacy_policy',
  title text NOT NULL DEFAULT 'Política de Privacidade',
  content text NOT NULL DEFAULT 'Esta é a política de privacidade padrão. Por favor, atualize este conteúdo através do painel administrativo.',
  version integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.perfis(id)
);

-- Enable RLS
ALTER TABLE public.privacy_terms ENABLE ROW LEVEL SECURITY;

-- Policy for public reading
CREATE POLICY "Anyone can read active privacy terms"
ON public.privacy_terms
FOR SELECT
USING (is_active = true);

-- Policy for admin management
CREATE POLICY "Only admins can manage privacy terms"
ON public.privacy_terms
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.perfis 
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Insert default privacy policy
INSERT INTO public.privacy_terms (id, title, content) VALUES (
  'privacy_policy',
  'Política de Privacidade',
  '# Política de Privacidade

## 1. Informações que Coletamos
Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, preenche formulários ou entra em contato conosco.

## 2. Como Usamos Suas Informações
Usamos as informações coletadas para:
- Fornecer e melhorar nossos serviços
- Comunicar com você sobre sua conta
- Garantir a segurança de nossa plataforma

## 3. Compartilhamento de Informações
Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.

## 4. Segurança
Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.

## 5. Seus Direitos
Você tem o direito de:
- Acessar suas informações pessoais
- Corrigir informações incorretas
- Solicitar a exclusão de suas informações
- Retirar seu consentimento

## 6. Contato
Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco através dos canais disponíveis em nosso site.

---

*Esta política foi atualizada pela última vez em: ' || to_char(now(), 'DD/MM/YYYY') || '*'
);

-- Create trigger for updating timestamp
CREATE OR REPLACE FUNCTION public.update_privacy_terms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_privacy_terms_updated_at
  BEFORE UPDATE ON public.privacy_terms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_privacy_terms_updated_at();