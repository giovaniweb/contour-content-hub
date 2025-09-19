import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { Resend } from "npm:resend@2.0.0";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NativeEmailRequest {
  template_type?: 'welcome' | 'content_released' | 'invite' | 'certificate' | 'newsletter' | 'password_reset';
  to_email: string;
  variables?: Record<string, any>;
  from_name?: string;
  from_email?: string;
  subject?: string;
  html_content?: string;
  text_content?: string;
  priority?: 'low' | 'normal' | 'high';
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

// Rate limiting simples
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(email: string, maxEmails = 10, windowMinutes = 60): boolean {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const key = email;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  
  if (current.count >= maxEmails) {
    return false;
  }
  
  current.count++;
  return true;
}

// Configure SMTP client using the v0.7.0 smtp library
async function sendEmailViaSMTP(
  toEmail: string,
  subject: string,
  htmlContent: string,
  fromName: string = "Fluida Online"
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get SMTP configuration
    let smtpHost = (Deno.env.get("NATIVE_SMTP_HOST") || "").trim();
    let smtpPortRaw = (Deno.env.get("NATIVE_SMTP_PORT") || "").trim();
    const smtpUser = (Deno.env.get("NATIVE_SMTP_USER") || "").trim();
    const smtpPass = (Deno.env.get("NATIVE_SMTP_PASS") || "").trim();
    const smtpSecureRaw = (Deno.env.get("NATIVE_SMTP_SECURE") || "false").trim().toLowerCase();

    // Parse port with fallback - handle host:port format
    let parsedPort = 587; // Default fallback
    if (smtpPortRaw) {
      // Try to extract port from host:port format or use as-is
      let portValue = smtpPortRaw;
      if (smtpPortRaw.includes(':')) {
        portValue = smtpPortRaw.split(':')[1];
      }
      
      const parsed = parseInt(portValue, 10);
      if (Number.isFinite(parsed) && parsed > 0 && parsed <= 65535) {
        parsedPort = parsed;
      } else {
        console.warn(`[SMTP] Invalid NATIVE_SMTP_PORT ('${smtpPortRaw}'). Using fallback ${parsedPort}.`);
      }
    }

    // Validate required fields
    if (!smtpHost) throw new Error("NATIVE_SMTP_HOST is required");
    if (!smtpUser) throw new Error("NATIVE_SMTP_USER is required");
    if (!smtpPass) throw new Error("NATIVE_SMTP_PASS is required");

    console.log(`Connecting to SMTP server: ${smtpHost}:${parsedPort} (secure: ${smtpSecureRaw === "true" || parsedPort === 465})`);

    // Create client
    const client = new SmtpClient();

    if (smtpSecureRaw === "true" || parsedPort === 465) {
      console.log("Using SSL/TLS connection");
      await client.connectTLS({
        hostname: smtpHost,
        port: parsedPort,
        username: smtpUser,
        password: smtpPass,
      });
    } else {
      console.log("Using plain connection");
      await client.connect({
        hostname: smtpHost,
        port: parsedPort,
        username: smtpUser,
        password: smtpPass,
      });
    }
    // Authenticate
    await client.ehlo(smtpHost);
    
    // Use STARTTLS if not already secure
    if (smtpSecureRaw !== "true" && parsedPort !== 465 && parsedPort !== 25) {
      try {
        await client.startTLS();
        console.log("STARTTLS established successfully");
      } catch (tlsError) {
        console.warn("STARTTLS failed, continuing without:", tlsError);
      }
    }

    await client.authPlain(smtpUser, smtpPass);

    // Force the from address to be the authenticated SMTP user
    const fromAddress = `${fromName} <${smtpUser}>`;
    
    console.log(`Sending email from: ${fromAddress} to: ${toEmail}`);

    // Send email
    await client.send({
      from: fromAddress,
      to: toEmail,
      subject: subject,
      content: htmlContent, // This will be the plain text fallback
      html: htmlContent,
    });

    console.log("Closing SMTP connection...");
    await client.close();

    const messageId = `smtp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      success: true,
      messageId: messageId,
    };

  } catch (error: any) {
    console.error("SMTP Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Processing native email request started`);

  try {
    const { 
      template_type, 
      to_email, 
      variables = {}, 
      from_name = "Fluida Online", 
      from_email,
      subject,
      html_content,
      text_content,
      priority = 'normal'
    }: NativeEmailRequest = await req.json();

    console.log(`[${requestId}] Email request details:`, { 
      template_type, 
      to_email: to_email ? to_email.substring(0, 3) + "***" : "undefined", 
      has_custom_content: !!(subject && html_content),
      priority,
      from_name,
      from_email 
    });

    // Validate input
    if (!to_email) {
      console.error(`[${requestId}] Missing required parameter: to_email`);
      return new Response(
        JSON.stringify({ error: "Missing required parameter: to_email" }),
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

    // Check rate limit
    if (!checkRateLimit(to_email)) {
      console.warn(`[${requestId}] Rate limit exceeded for:`, to_email.substring(0, 3) + "***");
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let renderedSubject = subject || "Notificação Fluida Online";
    let renderedHtmlContent = html_content || "";
    let renderedTextContent = text_content;

    // Se foi fornecido template_type, buscar no banco
    if (template_type && !subject && !html_content) {
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

      console.log(`[${requestId}] Template found, rendering with variables`);
      renderedSubject = renderTemplate(template.subject, variables);
      renderedHtmlContent = renderTemplate(template.html_content, variables);
      renderedTextContent = template.text_content ? renderTemplate(template.text_content, variables) : undefined;
    }

    // Se ainda não tiver conteúdo HTML, criar básico
    if (!renderedHtmlContent) {
      renderedHtmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Fluida Online</h2>
              <p>Você recebeu uma nova notificação.</p>
              <p>Se você não solicitou este email, pode ignorá-lo com segurança.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                Este email foi enviado automaticamente. Por favor, não responda.
              </p>
            </div>
          </body>
        </html>
      `;
    }

    console.log(`[${requestId}] Content prepared, attempting SMTP send...`);

    // Attempt to send via SMTP with retry logic
    let lastError = null;
    let success = false;
    let messageId = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`[${requestId}] SMTP attempt ${attempt}/${maxRetries}`);
      
      const result = await sendEmailViaSMTP(
        to_email,
        renderedSubject,
        renderedHtmlContent,
        from_name
      );

      if (result.success) {
        success = true;
        messageId = result.messageId;
        console.log(`[${requestId}] Email sent successfully on attempt ${attempt}`);
        break;
      } else {
        lastError = result.error;
        console.warn(`[${requestId}] SMTP attempt ${attempt} failed:`, result.error);
        
        if (attempt < maxRetries) {
          const delay = 1000 * attempt;
          console.log(`[${requestId}] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (success) {
      console.log(`[${requestId}] Email sent successfully via SMTP`);
      return new Response(
        JSON.stringify({
          success: true,
          provider: 'native_smtp',
          messageId: messageId,
          message: 'Email sent successfully via native SMTP',
          method: 'smtp'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      console.error(`[${requestId}] SMTP failed after all retries:`, lastError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SMTP failed: SMTP failed after ${maxRetries} attempts: ${lastError}`,
          details: 'All SMTP retry attempts failed. Please check SMTP configuration.',
          suggestions: [
            "Verify GoDaddy SMTP credentials (NATIVE_SMTP_USER, NATIVE_SMTP_PASS)",
            "Check SMTP host and port configuration for GoDaddy",
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

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-native-email function:`, {
      message: error.message,
      stack: error.stack,
      name: error.name
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