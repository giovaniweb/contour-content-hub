-- Create default email template for academy invites if it doesn't exist
INSERT INTO public.academy_email_templates (
  template_type,
  subject,
  html_content,
  text_content,
  variables,
  is_active
) 
SELECT 
  'invite',
  'Bem-vindo à Academia Fluida - {{ invite.title }}',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convite Academia Fluida</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Academia Fluida</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Convite Especial</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Olá, {{ user.first_name }}!</h2>
        
        <p>Você foi convidado(a) para participar da <strong>{{ invite.title }}</strong>.</p>
        
        <p>Este é um convite exclusivo para acessar nossos cursos especializados e expandir seus conhecimentos na área.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Detalhes do Convite</h3>
            <p><strong>Cursos:</strong> {{ invite.courses }}</p>
            <p><strong>Válido até:</strong> {{ invite.expires_at }}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ quick_access_url }}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Aceitar Convite
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <h3>Como acessar:</h3>
        <ol>
            <li>Clique no botão "Aceitar Convite" acima</li>
            <li>Se você já tem uma conta, faça login normalmente</li>
            <li>Se você é novo, clique em "Esqueci minha senha" para criar uma nova senha</li>
            <li>Use seu e-mail: <strong>{{ user.email }}</strong></li>
        </ol>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2;"><strong>Dica:</strong> Salve este e-mail para referência futura!</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Se você não conseguir clicar no botão, copie e cole este link no seu navegador:<br>
            {{ quick_access_url }}
        </p>
        
        <p style="color: #666; font-size: 14px;">
            Precisa de ajuda? Entre em contato conosco ou visite nossa academia em: {{ academy_url }}
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2024 Academia Fluida. Todos os direitos reservados.</p>
        <p>Este convite expira em {{ invite.expires_at }}.</p>
    </div>
</body>
</html>',
  'Olá {{ user.first_name }}!

Você foi convidado(a) para participar da {{ invite.title }}.

Detalhes:
- Cursos: {{ invite.courses }}
- Válido até: {{ invite.expires_at }}

Para aceitar o convite, acesse: {{ quick_access_url }}

Como acessar:
1. Clique no link acima
2. Se você já tem conta, faça login normalmente
3. Se é novo usuário, clique em "Esqueci minha senha" para criar nova senha
4. Use seu e-mail: {{ user.email }}

Precisa de ajuda? Visite: {{ academy_url }}

---
Academia Fluida
Este convite expira em {{ invite.expires_at }}.',
  '{
    "user": {
      "first_name": "Nome do usuário",
      "email": "email@exemplo.com"
    },
    "invite": {
      "title": "Academia Fluida - Nome dos Cursos",
      "courses": "Lista de cursos separados por vírgula",
      "expires_at": "Data de expiração formatada",
      "token": "Token único do convite"
    },
    "quick_access_url": "URL para aceitar o convite",
    "reset_password_url": "URL para redefinição de senha",
    "academy_url": "URL da academia"
  }',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.academy_email_templates 
  WHERE template_type = 'invite' AND is_active = true
);

-- Add rate limiting table for email sending
CREATE TABLE IF NOT EXISTS public.email_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  template_type TEXT NOT NULL,
  sent_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(email, template_type, window_start)
);

-- Enable RLS on rate limits table
ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage rate limits
CREATE POLICY "Admins can manage email rate limits"
ON public.email_rate_limits
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role = 'admin'
  )
);

-- Add audit log for invite actions
CREATE TABLE IF NOT EXISTS public.academy_invite_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'created', 'sent', 'resent', 'cancelled', 'accepted', 'expired'
  performed_by UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.academy_invite_audit ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view audit logs
CREATE POLICY "Admins can view invite audit logs"
ON public.academy_invite_audit
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.perfis WHERE role = 'admin'
  )
);

-- Policy for system to insert audit logs
CREATE POLICY "System can insert invite audit logs"
ON public.academy_invite_audit
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Function to log invite actions
CREATE OR REPLACE FUNCTION public.log_invite_action(
  p_invite_id UUID,
  p_action_type TEXT,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.academy_invite_audit (
    invite_id,
    action_type,
    performed_by,
    details
  ) VALUES (
    p_invite_id,
    p_action_type,
    auth.uid(),
    p_details
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Trigger to auto-log invite changes
CREATE OR REPLACE FUNCTION public.trigger_log_invite_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_invite_action(
      NEW.id,
      'created',
      jsonb_build_object(
        'email', NEW.email,
        'first_name', NEW.first_name,
        'course_count', array_length(NEW.course_ids, 1),
        'expires_at', NEW.expires_at
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status != NEW.status THEN
      PERFORM public.log_invite_action(
        NEW.id,
        CASE NEW.status
          WHEN 'cancelled' THEN 'cancelled'
          WHEN 'accepted' THEN 'accepted'
          WHEN 'expired' THEN 'expired'
          ELSE 'status_changed'
        END,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
    
    -- Log if expires_at was updated (resend)
    IF OLD.expires_at != NEW.expires_at THEN
      PERFORM public.log_invite_action(
        NEW.id,
        'resent',
        jsonb_build_object(
          'old_expires_at', OLD.expires_at,
          'new_expires_at', NEW.expires_at
        )
      );
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for invite audit logging
DROP TRIGGER IF EXISTS trigger_academy_invite_audit ON public.academy_invites;
CREATE TRIGGER trigger_academy_invite_audit
  AFTER INSERT OR UPDATE ON public.academy_invites
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_log_invite_changes();