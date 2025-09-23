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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !userData.user) {
      console.log(`Password recovery attempted for non-existent email: ${email}`);
      // Always return success for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          message: "Se o email existir em nossa base de dados, você receberá instruções para redefinir sua senha." 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate password reset link using Supabase Auth
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo
      }
    });

    if (error) {
      console.error("Error generating recovery link:", error);
      throw error;
    }

    const resetUrl = data.properties?.action_link;
    
    if (!resetUrl) {
      throw new Error("Failed to generate reset URL");
    }

    // Send email using native SMTP system
    const emailResponse = await supabase.functions.invoke('send-native-email', {
      body: {
        to_email: email,
        from_name: "Fluida Online",
        from_email: "noreply@fluida.online",
        subject: "Redefinir senha - Fluida Online",
        html_content: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Fluida Online</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Redefinição de Senha</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Olá!</h2>
              
              <p>Você solicitou a redefinição da sua senha na Fluida Online.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          font-weight: bold;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  Redefinir Minha Senha
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Se você não solicitou esta alteração, pode ignorar este email com segurança. 
                Sua senha atual permanecerá inalterada.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                Este link expira em 1 hora por motivos de segurança.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2024 Fluida Online. Todos os direitos reservados.<br>
                Se você não conseguir clicar no botão acima, copie e cole este link no seu navegador:<br>
                <span style="word-break: break-all;">${resetUrl}</span>
              </p>
            </div>
          </body>
          </html>
        `
      }
    });

    if (emailResponse.error) {
      console.error("Error sending password recovery email:", emailResponse.error);
      throw new Error("Failed to send recovery email");
    }

    console.log("Password recovery email sent successfully:", emailResponse);

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