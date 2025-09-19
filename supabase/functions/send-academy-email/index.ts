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

// Helper function to call the native SMTP email function
async function sendViaNativeSMTP(emailData: any, requestId: string): Promise<any> {
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

interface EmailRequest {
  template_type: 'welcome' | 'content_released' | 'invite' | 'certificate';
  to_email: string;
  variables: Record<string, any>;
  from_name?: string;
  from_email?: string;
}

// Função para renderizar template com variáveis
function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;
  
  // Substituir variáveis simples como {{ user.name }}
  const simpleVarRegex = /\{\{\s*([^}]+)\s*\}\}/g;
  rendered = rendered.replace(simpleVarRegex, (match, path) => {
    const keys = path.trim().split('.');
    let value = variables;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return match; // Retorna o placeholder se não encontrar
      }
    }
    
    return String(value || '');
  });
  
  // Processar loops simples como {% for name in content.names %}
  const loopRegex = /\{%\s*for\s+(\w+)\s+in\s+([^%]+)\s*%\}(.*?)\{%\s*endfor\s*%\}/gs;
  rendered = rendered.replace(loopRegex, (match, itemVar, arrayPath, content) => {
    const keys = arrayPath.trim().split('.');
    let array = variables;
    
    for (const key of keys) {
      if (array && typeof array === 'object' && key in array) {
        array = array[key];
      } else {
        return ''; // Retorna vazio se não encontrar o array
      }
    }
    
    if (Array.isArray(array)) {
      return array.map(item => {
        const itemContent = content.replace(new RegExp(`\\{\\{\\s*${itemVar}\\s*\\}\\}`, 'g'), String(item));
        return itemContent;
      }).join('');
    }
    
    return '';
  });
  
  return rendered;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Processing email request started`);

  try {
    const envFrom = Deno.env.get("NATIVE_SMTP_USER") || "noreply@fluida.online";
    const { template_type, to_email, variables, from_name = "Academia Fluida", from_email = envFrom }: EmailRequest = await req.json();

    console.log(`[${requestId}] Email request details:`, { 
      template_type, 
      to_email: to_email.substring(0, 3) + "***", // Masked for privacy
      variables_keys: Object.keys(variables),
      from_name,
      from_email 
    });

    // Validate input
    if (!template_type || !to_email || !variables) {
      console.error(`[${requestId}] Missing required parameters`);
      return new Response(
        JSON.stringify({ error: "Missing required parameters: template_type, to_email, variables" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to_email)) {
      console.error(`[${requestId}] Invalid email format:`, to_email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Buscar template do banco de dados
    console.log(`[${requestId}] Fetching template for type: ${template_type}`);
    const { data: template, error: templateError } = await supabase
      .from('academy_email_templates')
      .select('*')
      .eq('template_type', template_type)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error(`[${requestId}] Template not found:`, templateError);
      return new Response(
        JSON.stringify({ 
          error: "Template not found", 
          template_type,
          details: templateError?.message 
        }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[${requestId}] Template found:`, { 
      id: template.id, 
      subject: template.subject,
      has_html: !!template.html_content,
      has_text: !!template.text_content 
    });

    // Renderizar template com variáveis
    console.log(`[${requestId}] Rendering template with variables`);
    try {
      const renderedSubject = renderTemplate(template.subject, variables);
      const renderedHtmlContent = renderTemplate(template.html_content, variables);
      const renderedTextContent = template.text_content ? renderTemplate(template.text_content, variables) : undefined;

      console.log(`[${requestId}] Template rendered successfully:`, {
        subject_length: renderedSubject.length,
        html_length: renderedHtmlContent.length,
        has_text: !!renderedTextContent
      });

      // Try native SMTP
      let emailResponse;
      console.log(`[${requestId}] Trying native SMTP...`);
      
      try {
        // Native SMTP attempt
        const nativeSMTPData = {
          template_type,
          to_email,
          variables,
          from_name,
          from_email,
          subject: renderedSubject,
          html_content: renderedHtmlContent,
          text_content: renderedTextContent
        };

        const nativeResult = await sendViaNativeSMTP(nativeSMTPData, requestId);
        
        if (nativeResult.success) {
          console.log(`[${requestId}] Email sent successfully via native SMTP:`, {
            method: nativeResult.method,
            id: nativeResult.email_id,
            to: to_email.substring(0, 3) + "***"
          });
          
          emailResponse = nativeResult;
        } else {
          console.error('❌ Native SMTP failed:', nativeResult.error);
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `SMTP failed: ${nativeResult.error}`,
              details: 'Please check SMTP configuration and connection',
              suggestions: [
                "Verify GoDaddy SMTP credentials",
                "Check SMTP host and port configuration", 
                "Ensure from_email matches authenticated domain",
                "Test SMTP connection using the test function"
              ]
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

      } catch (smtpError: any) {
        console.error(`[${requestId}] SMTP Error:`, smtpError.message);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `SMTP failed: ${smtpError.message}`,
            details: 'Please check SMTP configuration and connection',
            suggestions: [
              "Verify GoDaddy SMTP credentials",
              "Check SMTP host and port configuration",
              "Ensure from_email matches authenticated domain",
              "Test SMTP connection using the test function"
            ]
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!emailResponse || emailResponse.error) {
        console.error(`[${requestId}] Email sending failed:`, emailResponse?.error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Email sending failed",
            details: emailResponse?.error || "Unknown error occurred"
          }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
    } catch (renderError: any) {
      console.error(`[${requestId}] Template rendering failed:`, renderError);
      return new Response(
        JSON.stringify({ 
          error: "Template rendering failed", 
          details: renderError.message 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[${requestId}] Email request completed successfully`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        email_id: emailResponse.email_id,
        method: emailResponse.method,
        request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-academy-email function:`, {
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