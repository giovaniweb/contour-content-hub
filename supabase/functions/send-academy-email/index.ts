import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

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
    const { template_type, to_email, variables, from_name = "Academia Fluida", from_email = "noreply@academifluida.com" }: EmailRequest = await req.json();

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

      // Retry logic for email sending
      let emailResponse;
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`[${requestId}] Email sending attempt ${attempt}/${maxRetries}`);
        
        try {
          emailResponse = await resend.emails.send({
            from: `${from_name} <${from_email}>`,
            to: [to_email],
            subject: renderedSubject,
            html: renderedHtmlContent,
            text: renderedTextContent,
          });

          if (!emailResponse.error) {
            console.log(`[${requestId}] Email sent successfully on attempt ${attempt}:`, {
              id: emailResponse.data?.id,
              to: to_email.substring(0, 3) + "***"
            });
            break;
          } else {
            lastError = emailResponse.error;
            console.warn(`[${requestId}] Email sending failed on attempt ${attempt}:`, emailResponse.error);
          }
        } catch (sendError: any) {
          lastError = sendError;
          console.warn(`[${requestId}] Email sending exception on attempt ${attempt}:`, sendError.message);
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`[${requestId}] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!emailResponse || emailResponse.error) {
        console.error(`[${requestId}] Email sending failed after ${maxRetries} attempts:`, lastError);
        return new Response(
          JSON.stringify({ 
            error: "Email sending failed after retries",
            details: lastError,
            attempts: maxRetries 
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
        email_id: emailResponse.data?.id,
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