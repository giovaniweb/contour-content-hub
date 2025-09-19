import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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

// Função para renderizar template com variáveis (mesma lógica da função original)
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

// Configurar cliente SMTP com suporte aprimorado para GoDaddy e parsing robusto de secrets
async function createSMTPClient(): Promise<SmtpClient> {
  let smtpHost = (Deno.env.get("NATIVE_SMTP_HOST") || "").trim();
  let smtpPortRaw = (Deno.env.get("NATIVE_SMTP_PORT") || "").trim();
  const smtpUser = (Deno.env.get("NATIVE_SMTP_USER") || "").trim();
  const smtpPass = (Deno.env.get("NATIVE_SMTP_PASS") || "").trim();
  const smtpSecureRaw = (Deno.env.get("NATIVE_SMTP_SECURE") || "").trim().toLowerCase();

  // Corrigir possíveis trocas acidentais entre HOST e PORT
  // Se a "porta" vier com um hostname, forçamos fallback para 587
  // e registramos um aviso para facilitar o diagnóstico.
  let parsedPort = parseInt(smtpPortRaw, 10);
  if (!Number.isFinite(parsedPort)) {
    // tentar extrair dígitos, ex.: "587 (STARTTLS)"
    const m = smtpPortRaw.match(/\d{2,5}/);
    if (m) {
      parsedPort = parseInt(m[0], 10);
      console.warn(`[SMTP] NATIVE_SMTP_PORT não numérico ('${smtpPortRaw}'). Extraído número '${parsedPort}'.`);
    } else {
      console.warn(`[SMTP] NATIVE_SMTP_PORT inválido ('${smtpPortRaw}'). Aplicando fallback 587.`);
      parsedPort = 587;
    }
  }

  // Validações essenciais
  if (!smtpHost) throw new Error("NATIVE_SMTP_HOST is required and cannot be empty");
  if (!smtpUser) throw new Error("NATIVE_SMTP_USER is required and cannot be empty");
  if (!smtpPass) throw new Error("NATIVE_SMTP_PASS is required and cannot be empty");

  // secure: true para SSL (465). Para 587 usamos STARTTLS (não é connectTLS direto)
  const isSecure = smtpSecureRaw === "true" || parsedPort === 465;

  console.log(`Connecting to SMTP server: ${smtpHost}:${parsedPort} (secure: ${isSecure})`);

  const client = new SmtpClient();

  try {
    const connectionConfig = {
      hostname: smtpHost,
      port: parsedPort,
      username: smtpUser,
      password: smtpPass,
    } as const;

    if (isSecure) {
      console.log(`Using SSL connection on port ${parsedPort}`);
      await client.connectTLS(connectionConfig);
    } else {
      console.log(`Using STARTTLS/plain connection on port ${parsedPort}`);
      await client.connect(connectionConfig);
    }

    console.log("SMTP connection established successfully");
    return client;
  } catch (error: any) {
    console.error("SMTP connection failed:", {
      host: smtpHost,
      port: parsedPort,
      user: smtpUser.substring(0, 3) + "***",
      error: error.message,
      type: error.name,
    });

    if (error.message.includes("connection refused") || error.message.includes("timeout")) {
      throw new Error(`SMTP connection failed to ${smtpHost}:${parsedPort}. Verify SMTP settings and connectivity.`);
    }
    if (error.message.includes("authentication") || error.message.includes("login")) {
      throw new Error(`SMTP authentication failed. Verify email credentials.`);
    }

    throw new Error(`SMTP configuration error: ${error.message}`);
  }
}

// Rate limiting simples (em produção, usar Redis ou banco)
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

// Robust SMTP retry function with intelligent fallback
async function retrySmtpWithBackoff(
  sendFunction: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<{ success: boolean; result?: any; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 SMTP attempt ${attempt}/${maxRetries}...`);
      const result = await sendFunction();
      console.log(`✅ SMTP success on attempt ${attempt}`);
      return { success: true, result };
    } catch (error) {
      console.error(`❌ SMTP attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        return { 
          success: false, 
          error: `SMTP failed after ${maxRetries} attempts: ${error.message}` 
        };
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏱️ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
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
      from_email = "no-reply@fluida.online",
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

    let emailResponse;
    let smtpClient: SmtpClient | null = null;
    
    // Função auxiliar para tentar SMTP com retry
    async function attemptSMTPSend(maxRetries = 2): Promise<any> {
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`[${requestId}] SMTP attempt ${attempt}/${maxRetries}`);
        
        try {
          smtpClient = await createSMTPClient();
          console.log(`[${requestId}] SMTP connection established, sending email...`);
          
          const smtpUserEnv = (Deno.env.get("NATIVE_SMTP_USER") || "").trim();
          let effectiveFromEmail = smtpUserEnv || from_email;
          if (from_email && smtpUserEnv && from_email !== smtpUserEnv) {
            console.warn(`[${requestId}] Overriding from_email '${from_email}' with authenticated user '${smtpUserEnv}'`);
            effectiveFromEmail = smtpUserEnv;
          }

          const fromAddress = `${from_name} <${effectiveFromEmail}>`;
          
          await smtpClient.send({
            from: fromAddress,
            to: to_email,
            subject: renderedSubject,
            content: renderedHtmlContent,
            html: renderedHtmlContent,
          });

          await smtpClient.close();
          smtpClient = null;

          console.log(`[${requestId}] Email sent successfully via SMTP to:`, to_email.substring(0, 3) + "***");
          
          return {
            success: true,
            method: 'smtp',
            id: requestId,
            to: to_email.substring(0, 3) + "***",
            attempts: attempt
          };

        } catch (error: any) {
          lastError = error;
          console.warn(`[${requestId}] SMTP attempt ${attempt} failed:`, error.message);
          
          // Fechar conexão SMTP se ainda estiver aberta
          if (smtpClient) {
            try {
              await smtpClient.close();
            } catch (closeError) {
              console.warn(`[${requestId}] Error closing SMTP connection:`, closeError);
            }
            smtpClient = null;
          }
          
          // Para certos tipos de erro, não vale a pena fazer retry
          if (error.message.includes("authentication") || 
              error.message.includes("credentials") ||
              error.message.includes("invalid") ||
              error.message.includes("553") || // Mailbox name not allowed
              error.message.includes("550")) { // Requested action not taken
            console.log(`[${requestId}] Non-retryable SMTP error, skipping remaining attempts`);
            break;
          }
          
          // Aguardar antes do próximo retry (backoff exponencial)
          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`[${requestId}] Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError || new Error("SMTP sending failed after all attempts");
    }
    
    try {
      console.log('🚀 Attempting to send email via native SMTP...');
      
      const result = await retrySmtpWithBackoff(
        () => attemptSMTPSend(2), // max retries
        1, // wrapper retry
        1000 // base delay in ms
      );

      if (result.success) {
        console.log('✅ Email sent successfully via SMTP');
        return new Response(
          JSON.stringify({
            success: true,
            provider: 'native_smtp',
            messageId: result.result?.id,
            message: 'Email sent successfully via native SMTP',
            attempts: result.result?.attempts
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        console.error('❌ SMTP failed after all retries:', result.error);
        return new Response(
          JSON.stringify({
            success: false,
            error: `SMTP failed: ${result.error}`,
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
    } catch (error) {
      console.error('❌ Unexpected error in email sending process:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unexpected error occurred while sending email',
          details: error.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[${requestId}] Email request completed successfully`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        method: emailResponse.method,
        email_id: emailResponse.id,
        warning: emailResponse.warning,
        attempts: emailResponse.attempts,
        request_id: requestId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in send-native-email function:`, {
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