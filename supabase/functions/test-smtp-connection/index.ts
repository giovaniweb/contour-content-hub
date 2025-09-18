import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] SMTP connection test started`);

  try {
    // Get SMTP configuration from environment
    const smtpHost = Deno.env.get("NATIVE_SMTP_HOST");
    const smtpPortStr = Deno.env.get("NATIVE_SMTP_PORT");
    const smtpUser = Deno.env.get("NATIVE_SMTP_USER");
    const smtpPass = Deno.env.get("NATIVE_SMTP_PASS");
    const smtpSecureStr = Deno.env.get("NATIVE_SMTP_SECURE");

    console.log(`[${requestId}] SMTP config check:`, {
      host: smtpHost ? "✓" : "✗",
      port: smtpPortStr ? "✓" : "✗", 
      user: smtpUser ? "✓" : "✗",
      pass: smtpPass ? "✓" : "✗",
      secure: smtpSecureStr ? "✓" : "✗"
    });

    // Validate SMTP configuration
    if (!smtpHost || !smtpPortStr || !smtpUser || !smtpPass) {
      const missingVars = [];
      if (!smtpHost) missingVars.push("NATIVE_SMTP_HOST");
      if (!smtpPortStr) missingVars.push("NATIVE_SMTP_PORT");
      if (!smtpUser) missingVars.push("NATIVE_SMTP_USER");
      if (!smtpPass) missingVars.push("NATIVE_SMTP_PASS");

      return new Response(
        JSON.stringify({
          success: false,
          message: "Configuração SMTP incompleta",
          details: {
            missing_secrets: missingVars,
            instructions: "Configure as variáveis SMTP no painel de secrets do Supabase"
          },
          request_id: requestId
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate port
    const smtpPort = parseInt(smtpPortStr);
    if (isNaN(smtpPort) || smtpPort <= 0 || smtpPort > 65535) {
      console.error(`[${requestId}] Invalid SMTP port: ${smtpPortStr}`);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Porta SMTP inválida",
          details: {
            received_port: smtpPortStr,
            error: "Porta deve ser um número entre 1 and 65535",
            common_ports: {
              "465": "SSL/TLS",
              "587": "STARTTLS", 
              "25": "Não criptografado (não recomendado)"
            }
          },
          request_id: requestId
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const smtpSecure = smtpSecureStr === "true";

    console.log(`[${requestId}] Testing SMTP connection to ${smtpHost}:${smtpPort} (secure: ${smtpSecure})`);

    try {
      let conn;
      
      // Choose connection method based on port and security
      if (smtpPort === 465 || smtpSecure) {
        // SSL/TLS connection (port 465)
        conn = await Deno.connectTls({
          hostname: smtpHost,
          port: smtpPort,
        });
        console.log(`[${requestId}] TLS connection established`);
      } else {
        // Plain connection (will use STARTTLS for port 587)
        conn = await Deno.connect({
          hostname: smtpHost,
          port: smtpPort,
        });
        console.log(`[${requestId}] Plain connection established`);
      }

      // Read server greeting
      const decoder = new TextDecoder();
      const buffer = new Uint8Array(1024);
      const n = await conn.read(buffer);
      const greeting = decoder.decode(buffer.subarray(0, n || 0));
      
      console.log(`[${requestId}] Server greeting: ${greeting.trim()}`);

      // Close connection
      conn.close();

      const connectionType = smtpPort === 465 || smtpSecure ? "SSL/TLS" : "PLAIN";
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Conexão SMTP estabelecida com sucesso",
          details: {
            host: smtpHost,
            port: smtpPort,
            connection_type: connectionType,
            server_greeting: greeting.trim(),
            user: smtpUser,
            secure: smtpSecure,
            timestamp: new Date().toISOString()
          },
          request_id: requestId
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } catch (connectionError: any) {
      console.error(`[${requestId}] SMTP connection failed:`, connectionError);
      
      let errorMessage = "Falha na conexão SMTP";
      let suggestions = [];
      
      if (connectionError.message.includes("ECONNREFUSED")) {
        errorMessage = "Conexão recusada pelo servidor SMTP";
        suggestions = [
          "Verifique se o host SMTP está correto",
          "Confirme se a porta está correta (465 para SSL, 587 para STARTTLS)",
          "Verifique se não há firewall bloqueando a conexão"
        ];
      } else if (connectionError.message.includes("ENOTFOUND")) {
        errorMessage = "Host SMTP não encontrado";
        suggestions = [
          "Verifique se o hostname está correto",
          "Confirme se não há erro de digitação no host"
        ];
      } else if (connectionError.message.includes("timeout")) {
        errorMessage = "Timeout na conexão SMTP";
        suggestions = [
          "Verifique sua conexão com a internet",
          "O servidor SMTP pode estar indisponível"
        ];
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
          details: {
            error: connectionError.message,
            host: smtpHost,
            port: smtpPort,
            connection_type: smtpPort === 465 || smtpSecure ? "SSL/TLS" : "PLAIN",
            suggestions
          },
          request_id: requestId
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error(`[${requestId}] Critical error in test-smtp-connection:`, {
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: "Erro interno do servidor",
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