import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface SignupConfirmationRequest {
  user_email: string;
  user_name?: string;
  confirmation_url?: string;
  template_type?: 'welcome' | 'email_confirmation';
}

// Helper function to call the native SMTP email function
async function sendViaNativeSMTP(emailData: any): Promise<any> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase configuration missing for native SMTP call");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/send-native-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Native SMTP call failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Default email templates if none exist in database
const defaultTemplates = {
  welcome: {
    subject: "Bem-vindo à Academia Fluida, {{ user.name }}!",
    html_content: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🎉 Bem-vindo à Academia Fluida!</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-top: 0;">Olá, {{ user.name }}!</h2>
            <p>É com grande alegria que te damos as boas-vindas à <strong>Academia Fluida</strong>!</p>
            <p>Você agora faz parte de uma comunidade dedicada ao aprendizado e crescimento na área de estética.</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #1e40af;">O que você pode fazer agora:</h3>
            <ul style="padding-left: 20px;">
              <li>✅ Explore nossos vídeos educativos</li>
              <li>✅ Acesse nossa biblioteca de fotos</li>
              <li>✅ Confira nossos artigos científicos</li>
              <li>✅ Descubra nossos materiais de arte</li>
            </ul>
          </div>

          {% if confirmation_url %}
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ confirmation_url }}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Confirmar Email
            </a>
          </div>
          {% endif %}

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>💡 Dica:</strong> Para aproveitar ao máximo a plataforma, complete seu perfil e explore todas as funcionalidades disponíveis.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Este email foi enviado automaticamente pela Academia Fluida.<br>
              Se você não se cadastrou, pode ignorar este email com segurança.
            </p>
          </div>
        </body>
      </html>
    `,
    text_content: `
Bem-vindo à Academia Fluida, {{ user.name }}!

É com grande alegria que te damos as boas-vindas à Academia Fluida!

Você agora faz parte de uma comunidade dedicada ao aprendizado e crescimento na área de estética.

O que você pode fazer agora:
- Explore nossos vídeos educativos
- Acesse nossa biblioteca de fotos  
- Confira nossos artigos científicos
- Descubra nossos materiais de arte

{% if confirmation_url %}
Confirme seu email acessando: {{ confirmation_url }}
{% endif %}

Dica: Para aproveitar ao máximo a plataforma, complete seu perfil e explore todas as funcionalidades disponíveis.

Este email foi enviado automaticamente pela Academia Fluida.
Se você não se cadastrou, pode ignorar este email com segurança.
    `
  },
  email_confirmation: {
    subject: "Confirme seu email - Academia Fluida",
    html_content: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">📧 Confirme seu Email</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-top: 0;">Olá, {{ user.name }}!</h2>
            <p>Para garantir a segurança da sua conta na <strong>Academia Fluida</strong>, precisamos confirmar seu endereço de email.</p>
          </div>

          {% if confirmation_url %}
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ confirmation_url }}" 
               style="background-color: #16a34a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
              Confirmar Email Agora
            </a>
          </div>
          {% endif %}

          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; color: #991b1b;">
              <strong>⚠️ Importante:</strong> Este link expira em 24 horas. Se não conseguir clicar no botão, copie e cole o link abaixo no seu navegador:
            </p>
            {% if confirmation_url %}
            <p style="word-break: break-all; margin: 10px 0 0 0; font-family: monospace; font-size: 12px; color: #991b1b;">
              {{ confirmation_url }}
            </p>
            {% endif %}
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Se você não solicitou este email, pode ignorá-lo com segurança.<br>
              Sua conta não será ativada sem a confirmação.
            </p>
          </div>
        </body>
      </html>
    `,
    text_content: `
Confirme seu email - Academia Fluida

Olá, {{ user.name }}!

Para garantir a segurança da sua conta na Academia Fluida, precisamos confirmar seu endereço de email.

{% if confirmation_url %}
Clique no link abaixo para confirmar:
{{ confirmation_url }}
{% endif %}

IMPORTANTE: Este link expira em 24 horas.

Se você não solicitou este email, pode ignorá-lo com segurança.
Sua conta não será ativada sem a confirmação.
    `
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Processing signup confirmation request started`);

  try {
    const { 
      user_email,
      user_name,
      confirmation_url,
      template_type = 'welcome'
    }: SignupConfirmationRequest = await req.json();

    console.log(`[${requestId}] Signup confirmation details:`, { 
      user_email: user_email?.substring(0, 3) + "***",
      user_name,
      has_confirmation_url: !!confirmation_url,
      template_type
    });

    // Validate input
    if (!user_email) {
      console.error(`[${requestId}] Missing required parameter: user_email`);
      return new Response(
        JSON.stringify({ error: "Missing required parameter: user_email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      console.error(`[${requestId}] Invalid email format:`, user_email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user name from database if not provided
    let finalUserName = user_name;
    if (!finalUserName) {
      console.log(`[${requestId}] Fetching user name from database...`);
      const { data: userData } = await supabase
        .from('perfis')
        .select('nome')
        .eq('email', user_email)
        .single();
      
      finalUserName = userData?.nome || user_email.split('@')[0];
    }

    // Prepare variables for template
    const variables = {
      user: {
        name: finalUserName,
        email: user_email
      },
      confirmation_url: confirmation_url || ''
    };

    console.log(`[${requestId}] Trying to fetch template from database...`);
    
    // Try to get template from database first
    const { data: template, error: templateError } = await supabase
      .from('academy_email_templates')
      .select('*')
      .eq('template_type', template_type)
      .eq('is_active', true)
      .single();

    let emailData;

    if (template && !templateError) {
      console.log(`[${requestId}] Using database template`);
      // Use database template
      emailData = {
        template_type,
        to_email: user_email,
        variables,
        from_name: "Academia Fluida",
        from_email: "noreply@academifluida.com"
      };
    } else {
      console.log(`[${requestId}] Using default template (database template not found)`);
      // Use default template
      const defaultTemplate = defaultTemplates[template_type as keyof typeof defaultTemplates];
      if (!defaultTemplate) {
        return new Response(
          JSON.stringify({ error: `Unknown template type: ${template_type}` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      emailData = {
        to_email: user_email,
        variables,
        from_name: "Academia Fluida",
        from_email: "noreply@academifluida.com",
        subject: defaultTemplate.subject,
        html_content: defaultTemplate.html_content,
        text_content: defaultTemplate.text_content
      };
    }

    // Send email via native SMTP
    console.log(`[${requestId}] Sending signup confirmation email...`);
    const emailResponse = await sendViaNativeSMTP(emailData);

    console.log(`[${requestId}] Signup confirmation email sent successfully:`, {
      method: emailResponse.method,
      email_id: emailResponse.email_id,
      to: user_email.substring(0, 3) + "***"
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Signup confirmation email sent successfully",
        method: emailResponse.method,
        email_id: emailResponse.email_id,
        warning: emailResponse.warning,
        request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-signup-confirmation function:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
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