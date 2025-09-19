import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  to_email: string;
  subject?: string;
  html_content?: string;
  test_mode?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Test email request started`);

  try {
    const { to_email, subject, html_content, test_mode }: TestEmailRequest = await req.json();

    console.log(`[${requestId}] Test email parameters:`, { 
      to_email: to_email?.substring(0, 3) + "***", 
      has_subject: !!subject,
      has_content: !!html_content,
      test_mode 
    });

    // Validation
    if (!to_email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameter: to_email",
          received_params: Object.keys(await req.clone().json())
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to_email)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid email format",
          email: to_email
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Prepare test email data
    const testEmailData = {
      to_email,
      subject: subject || "Teste de Email - Fluida Online",
      html_content: html_content || `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
              <h1 style="margin: 0; font-size: 28px;">✅ Teste de Email</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Fluida Online - Sistema de Emails</p>
            </div>
            
            <div style="padding: 30px 20px; background: #f8f9fa; margin: 20px 0; border-radius: 10px;">
              <h2 style="color: #333; margin-top: 0;">Email enviado com sucesso!</h2>
              <p style="color: #666; line-height: 1.6;">
                Este é um email de teste do sistema de emails da Fluida Online. 
                Se você recebeu esta mensagem, significa que a configuração está funcionando corretamente.
              </p>
              
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Detalhes do teste:</strong>
                <ul style="margin: 10px 0; color: #555;">
                  <li>Destinatário: ${to_email}</li>
                  <li>Data/Hora: ${new Date().toLocaleString('pt-BR')}</li>
                  <li>ID da requisição: ${requestId}</li>
                  <li>Modo: ${test_mode ? 'Teste' : 'Produção'}</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>Fluida Online - Sistema de Gestão de Emails</p>
              <p>Este é um email automático, não responda esta mensagem.</p>
            </div>
          </body>
        </html>
      `,
      from_name: "Fluida Online",
      from_email: Deno.env.get("NATIVE_SMTP_USER") || "no-reply@fluida.online",
      priority: "normal" as const
    };

    console.log(`[${requestId}] Calling send-native-email function...`);

    // Call the main send-native-email function
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-native-email`, {
      method: "POST",
      headers: {
        "Authorization": req.headers.get("authorization") || "",
        "Content-Type": "application/json",
        "apikey": Deno.env.get("SUPABASE_ANON_KEY") || "",
      },
      body: JSON.stringify(testEmailData),
    });

    const emailResult = await emailResponse.json();

    console.log(`[${requestId}] Native email response:`, {
      status: emailResponse.status,
      success: emailResult.success,
      method: emailResult.method
    });

    if (!emailResponse.ok) {
      console.error(`[${requestId}] Email sending failed:`, emailResult);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email sending failed",
          details: emailResult,
          test_data: testEmailData,
          request_id: requestId
        }),
        { 
          status: emailResponse.status, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Test email sent successfully",
        details: {
          to_email: to_email.substring(0, 3) + "***",
          method: emailResult.method,
          email_id: emailResult.email_id,
          warning: emailResult.warning,
          attempts: emailResult.attempts,
          test_mode
        },
        request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-test-email:`, {
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        request_id: requestId,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);