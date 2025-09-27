import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordRecoveryRequest {
  email: string;
  redirectTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo = "https://fluida.online/reset-password" }: PasswordRecoveryRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`[AUTH] Processing password recovery for: ${email}`);

    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists in auth.users
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('[AUTH] Error searching for user:', searchError);
      // Always return success for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          message: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.",
          success: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`[AUTH] User not found for email: ${email}`);
      // Always return success for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          message: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha.",
          success: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`[AUTH] User found, generating recovery token for: ${email}`);

    // Generate secure random token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');

    // Set expiration time (2 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    // Clean up expired tokens first
    await supabase
      .from('password_recovery_tokens')
      .delete()
      .or(`expires_at.lt.${new Date().toISOString()},used_at.is.not.null`);

    // Store token in database
    const { error: tokenError } = await supabase
      .from('password_recovery_tokens')
      .insert({
        user_id: user.id,
        token: token,
        email: email,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('[AUTH] Error storing recovery token:', tokenError);
      return new Response(
        JSON.stringify({ 
          error: "Erro interno do servidor. Tente novamente em alguns minutos." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user name from profile if available
    const { data: profile } = await supabase
      .from('perfis')
      .select('nome')
      .eq('id', user.id)
      .single();

    const userName = profile?.nome || email.split('@')[0];
    const recoveryLink = `${redirectTo}?token=${token}`;

    // Create email content with Fluida branding
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha - Fluida</title>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #2563eb; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .gradient-text { background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
          .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo gradient-text">FLUIDA</div>
            <h2>Redefinir Sua Senha</h2>
          </div>
          
          <p>Olá <strong>${userName}</strong>,</p>
          
          <p>Recebemos uma solicitação para redefinir a senha da sua conta na Fluida. Se você não fez esta solicitação, pode ignorar este email com segurança.</p>
          
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${recoveryLink}" class="button">Redefinir Minha Senha</a>
          </div>
          
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">${recoveryLink}</p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este link é válido por apenas <strong>2 horas</strong> e pode ser usado apenas uma vez. Após esse período, você precisará solicitar um novo link de recuperação.
          </div>
          
          <p>Se você tiver dificuldades para acessar o link, entre em contato conosco através do suporte.</p>
          
          <div class="footer">
            <p>Esta é uma mensagem automática da <strong>Fluida</strong>.</p>
            <p>© 2024 Fluida. Todos os direitos reservados.</p>
            <p>Não responda a este email - ele foi enviado por um sistema automatizado.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Olá ${userName},

Recebemos uma solicitação para redefinir a senha da sua conta na Fluida.

Para redefinir sua senha, acesse o seguinte link:
${recoveryLink}

IMPORTANTE: Este link é válido por apenas 2 horas e pode ser usado apenas uma vez.

Se você não solicitou esta redefinição de senha, ignore este email.

Atenciosamente,
Equipe Fluida

---
Esta é uma mensagem automática. Não responda a este email.
© 2024 Fluida. Todos os direitos reservados.
    `;

    // Send email using native email system
    console.log('[AUTH] Sending recovery email via native system');
    
    const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-native-email', {
      body: {
        to_email: email,
        subject: "🔒 Redefinir Senha - Fluida",
        html_content: htmlContent,
        text_content: textContent,
        from_name: "Fluida",
        reply_to: "noreply@fluida.online"
      }
    });

    if (emailError) {
      console.error('[AUTH] Error sending recovery email:', emailError);
      
      // Clean up the token if email failed
      await supabase
        .from('password_recovery_tokens')
        .delete()
        .eq('token', token);
        
      return new Response(
        JSON.stringify({ 
          error: "Erro ao enviar email de recuperação. Tente novamente em alguns minutos." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('[AUTH] Password recovery email sent successfully');

    return new Response(
      JSON.stringify({ 
        message: "Email de recuperação enviado com sucesso! Verifique sua caixa de entrada e pasta de spam.",
        success: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-password-recovery function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erro interno do servidor. Tente novamente em alguns minutos." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);