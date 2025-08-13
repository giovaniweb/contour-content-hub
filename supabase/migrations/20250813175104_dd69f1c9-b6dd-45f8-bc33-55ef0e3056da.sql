-- FASE 1: Sistema de Convites de Usuário para Academia

-- 1. Tabela para gerenciar convites de usuários
CREATE TABLE public.academy_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  course_ids UUID[] NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invite_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de convites
ALTER TABLE public.academy_invites ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de acesso para convites
CREATE POLICY "Admins can manage all invites"
ON public.academy_invites
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM perfis WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM perfis WHERE role = 'admin'
  )
);

-- 3. Tabela para templates de e-mail
CREATE TABLE public.academy_email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL CHECK (template_type IN ('welcome', 'content_released', 'invite', 'certificate')),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_type)
);

-- Habilitar RLS na tabela de templates
ALTER TABLE public.academy_email_templates ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para templates de e-mail
CREATE POLICY "Admins can manage email templates"
ON public.academy_email_templates
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM perfis WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM perfis WHERE role = 'admin'
  )
);

-- 5. Inserir templates padrão de e-mail
INSERT INTO public.academy_email_templates (template_type, subject, html_content, text_content, variables) VALUES 
(
  'welcome',
  'Bem-vindo(a) à {{ academy.name }}!',
  '<h1>Olá {{ user.first_name }},</h1>
   <p>Parabéns pela decisão e bem-vindo(a) a bordo!</p>
   <p>Agora você pode acessar o curso da {{ academy.name }} e devorar todo o conteúdo já disponível! Abaixo está seu login e senha de acesso:</p>
   <p><strong>E-mail:</strong> {{ user.email }}<br>
   <strong>Senha:</strong> {{ user.password }}</p>
   <p>Assim que você entrar na plataforma, aproveite para alterar sua senha e subir sua foto. :)</p>
   <p><a href="{{ login_url }}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Clique aqui para entrar na área de membros agora</a></p>
   <p>Um grande abraço e sucesso,<br>{{ academy.name }}</p>',
  'Olá {{ user.first_name }}, Parabéns pela decisão e bem-vindo(a) a bordo! Agora você pode acessar o curso da {{ academy.name }} e devorar todo o conteúdo já disponível! E-mail: {{ user.email }} Senha: {{ user.password }} Para entrar: {{ login_url }}',
  '{"academy": {"name": "Academia Fluida"}, "user": {"first_name": "", "email": "", "password": ""}, "login_url": ""}'
),
(
  'content_released',
  'Novos conteúdos liberados!',
  '<h1>Olá {{ user.first_name }},</h1>
   <p>Acabaram de ser liberados novos conteúdos na área de membros:</p>
   <ul>{% for name in content.names %}<li>{{ name }}</li>{% endfor %}</ul>
   <p><a href="{{ login_url }}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Clique aqui para acessar agora</a></p>',
  'Olá {{ user.first_name }}, Novos conteúdos liberados: {% for name in content.names %}{{ name }}{% endfor %} Acesse: {{ login_url }}',
  '{"user": {"first_name": ""}, "content": {"names": []}, "login_url": ""}'
),
(
  'invite',
  'Seu convite foi liberado!',
  '<h1>Olá {{ user.first_name }},</h1>
   <p>Seu convite de {{ invite.title }} foi liberado.</p>
   <p>Caso tenha esquecido sua senha cadastrada, <a href="{{ reset_password_url }}">clique aqui</a>.</p>
   <p>Para entrar imediatamente na área de membros, <a href="{{ quick_access_url }}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">clique aqui</a>.</p>
   <p><strong>Lembrando que o link de autenticação rápida é válido somente por 24 horas.</strong></p>',
  'Olá {{ user.first_name }}, Seu convite de {{ invite.title }} foi liberado. Link rápido (24h): {{ quick_access_url }}',
  '{"user": {"first_name": ""}, "invite": {"title": ""}, "quick_access_url": "", "reset_password_url": ""}'
),
(
  'certificate',
  'Seu certificado está pronto!',
  '<h1>Olá {{ user.first_name }},</h1>
   <p>Segue abaixo o link para gerar seu certificado referente ao curso {{ course.name }}.</p>
   <p><a href="{{ certificate_url }}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Baixar certificado</a></p>
   <p>Parabéns pela conclusão!</p>',
  'Olá {{ user.first_name }}, Seu certificado do curso {{ course.name }} está pronto! Baixe em: {{ certificate_url }}',
  '{"user": {"first_name": ""}, "course": {"name": ""}, "certificate_url": ""}'
);

-- 6. Função para limpar convites expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_invites()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.academy_invites
  SET status = 'expired'
  WHERE status = 'pending' 
    AND expires_at < now();
END;
$$;

-- 7. Trigger para atualizar timestamp
CREATE TRIGGER update_academy_invites_updated_at
BEFORE UPDATE ON public.academy_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_email_templates_updated_at
BEFORE UPDATE ON public.academy_email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();