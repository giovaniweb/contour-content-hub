import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

// SMTP sending functionality
async function sendEmailSMTP(
  to: string, 
  subject: string, 
  htmlContent: string,
  fromName: string = "Fluida Online",
  fromEmail: string = "noreply@fluida.online"
): Promise<boolean> {
  try {
    const host = Deno.env.get('NATIVE_SMTP_HOST');
    const port = parseInt(Deno.env.get('NATIVE_SMTP_PORT') || '587');
    const user = Deno.env.get('NATIVE_SMTP_USER');
    const pass = Deno.env.get('NATIVE_SMTP_PASS');
    const secure = Deno.env.get('NATIVE_SMTP_SECURE') === 'true';

    if (!host || !user || !pass) {
      console.error('SMTP configuration missing:', { host: !!host, user: !!user, pass: !!pass });
      return false;
    }

    console.log(`[SMTP] Connecting to ${host}:${port}, secure: ${secure}`);

    // Create TLS or TCP connection based on configuration
    let conn = secure 
      ? await Deno.connectTls({ hostname: host, port: port })
      : await Deno.connect({ hostname: host, port: port });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Helper function to send command and get response
    let sendCommand = async (command: string): Promise<string> => {
      if (command !== '') {
        console.log(`[SMTP] > ${command}`);
        await conn.write(encoder.encode(command + '\r\n'));
      }
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      const response = decoder.decode(buffer.subarray(0, n || 0));
      console.log(`[SMTP] < ${response.trim()}`);
      return response;
    };

    // Read initial greeting
    let response = await sendCommand('');

    // EHLO command
    response = await sendCommand(`EHLO ${host}`);

    // STARTTLS if not already secure
    if (!secure && response.includes('STARTTLS')) {
      console.log('[SMTP] Upgrading to TLS...');
      response = await sendCommand('STARTTLS');
      
      if (response.startsWith('220')) {
        // Close old connection and upgrade to TLS
        conn.close();
        conn = await Deno.connectTls({ hostname: host, port: port });
        
        // Update sendCommand to use new connection
        sendCommand = async (command: string): Promise<string> => {
          if (command !== '') {
            console.log(`[SMTP-TLS] > ${command}`);
            await conn.write(encoder.encode(command + '\r\n'));
          }
          const buffer = new Uint8Array(1024);
          const n = await conn.read(buffer);
          const response = decoder.decode(buffer.subarray(0, n || 0));
          console.log(`[SMTP-TLS] < ${response.trim()}`);
          return response;
        };
        
        // Re-establish EHLO after TLS
        response = await sendCommand(`EHLO ${host}`);
        console.log('[SMTP] TLS upgrade successful');
      } else {
        console.warn('[SMTP] STARTTLS failed, continuing without TLS');
      }
    }

    // Authentication - try AUTH PLAIN first, fallback to AUTH LOGIN
    console.log('[SMTP] Attempting authentication...');
    let authSuccess = false;
    
    // Try AUTH PLAIN
    try {
      const authString = btoa(`\0${user}\0${pass}`);
      response = await sendCommand(`AUTH PLAIN ${authString}`);
      
      if (response.startsWith('235')) {
        console.log('[SMTP] AUTH PLAIN successful');
        authSuccess = true;
      }
    } catch (error) {
      console.log('[SMTP] AUTH PLAIN failed, trying AUTH LOGIN');
    }
    
    // Fallback to AUTH LOGIN if PLAIN failed
    if (!authSuccess) {
      try {
        response = await sendCommand('AUTH LOGIN');
        
        if (response.startsWith('334')) {
          // Send username
          response = await sendCommand(btoa(user));
          
          if (response.startsWith('334')) {
            // Send password
            response = await sendCommand(btoa(pass));
            
            if (response.startsWith('235')) {
              console.log('[SMTP] AUTH LOGIN successful');
              authSuccess = true;
            }
          }
        }
      } catch (error) {
        console.error('[SMTP] AUTH LOGIN failed:', error);
      }
    }

    if (!authSuccess) {
      throw new Error(`Authentication failed: ${response}`);
    }

    // Mail transaction
    console.log('[SMTP] Starting mail transaction...');
    response = await sendCommand(`MAIL FROM:<${fromEmail}>`);
    if (!response.startsWith('250')) {
      throw new Error(`MAIL FROM failed: ${response}`);
    }

    response = await sendCommand(`RCPT TO:<${to}>`);
    if (!response.startsWith('250')) {
      throw new Error(`RCPT TO failed: ${response}`);
    }

    response = await sendCommand('DATA');
    if (!response.startsWith('354')) {
      throw new Error(`DATA command failed: ${response}`);
    }

    // Email headers and content
    console.log('[SMTP] Sending email content...');
    const emailContent = [
      `From: ${fromName} <${fromEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlContent,
      '.'
    ].join('\r\n');

    await conn.write(encoder.encode(emailContent + '\r\n'));
    
    const dataBuffer = new Uint8Array(1024);
    const dataRead = await conn.read(dataBuffer);
    const dataResponse = decoder.decode(dataBuffer.subarray(0, dataRead || 0));
    console.log(`[SMTP] Data response: ${dataResponse.trim()}`);

    if (!dataResponse.startsWith('250')) {
      throw new Error(`Email sending failed: ${dataResponse}`);
    }

    // Quit
    await sendCommand('QUIT');
    conn.close();

    console.log('[SMTP] Email sent successfully');
    return true;

  } catch (error) {
    console.error('[SMTP] Error:', error);
    return false;
  }
}

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

    console.log(`[AUTH] Processing password recovery for: ${email}`);

    // Generate password reset link using Supabase Auth
    // This will automatically check if user exists and handle appropriately
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo
      }
    });

    if (error) {
      console.error("[AUTH] Error generating recovery link:", error);
      
      // Check if error is because user doesn't exist
      if (error.message?.includes('User not found') || error.message?.includes('Unable to get user')) {
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
      
      // Other errors should be thrown
      throw error;
    }

    const resetUrl = data.properties?.action_link;
    
    if (!resetUrl) {
      throw new Error("Failed to generate reset URL");
    }

    // Prepare email content
    const emailSubject = "Redefinir senha - Fluida Online";
    const emailHtml = `
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
    `;

// Send email using direct SMTP
console.log(`Sending password recovery email to: ${email}`);
let emailSent = await sendEmailSMTP(email, emailSubject, emailHtml);

if (!emailSent) {
  console.error("Failed to send password recovery email via SMTP");
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (resendKey) {
    try {
      console.log("Attempting Resend fallback...");
      const resend = new Resend(resendKey);
      const resendResp = await resend.emails.send({
        from: "Fluida <noreply@fluida.online>",
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      });
      console.log("Resend response:", resendResp);
      emailSent = true;
    } catch (resendErr) {
      console.error("Resend fallback failed:", resendErr);
    }
  }
}

if (!emailSent) {
  throw new Error("Failed to send recovery email via all providers");
}

console.log("Password recovery email sent successfully");

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