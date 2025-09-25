import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMTPConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  tls?: boolean;
}

// Modern SMTP implementation using native TCP connections
async function sendEmailViaSMTP(config: SMTPConfig, emailData: any): Promise<any> {
  console.log("Starting SMTP email send process...");
  console.log("SMTP Config:", { 
    hostname: config.hostname, 
    port: config.port, 
    username: config.username,
    tls: config.tls 
  });
  
  let conn: Deno.TcpConn | Deno.TlsConn | undefined;
  
  try {
    // Connect to SMTP server
    if (config.tls && config.port === 465) {
      console.log("Connecting via TLS (port 465)...");
      conn = await Deno.connectTls({
        hostname: config.hostname,
        port: config.port,
      });
    } else {
      console.log("Connecting via TCP (will use STARTTLS if available)...");
      conn = await Deno.connect({
        hostname: config.hostname,
        port: config.port,
      });
    }

    console.log("Connected to SMTP server successfully");

    // Helper functions for SMTP communication
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function sendCommand(command: string): Promise<string> {
      if (!conn) throw new Error("Connection not established");
      console.log("SMTP CMD:", command.replace(/AUTH PLAIN.*/, "AUTH PLAIN [HIDDEN]"));
      await conn.write(encoder.encode(command + "\r\n"));
      
      const buffer = new Uint8Array(4096);
      const bytesRead = await conn.read(buffer);
      if (!bytesRead) throw new Error("Connection closed unexpectedly");
      
      const response = decoder.decode(buffer.subarray(0, bytesRead));
      console.log("SMTP RSP:", response.trim());
      return response;
    }

    // Read initial server greeting
    const buffer = new Uint8Array(4096);
    const bytesRead = await conn.read(buffer);
    if (!bytesRead) throw new Error("No server greeting received");
    
    const greeting = decoder.decode(buffer.subarray(0, bytesRead));
    console.log("Server greeting:", greeting.trim());
    
    if (!greeting.startsWith("220")) {
      throw new Error(`Server not ready: ${greeting}`);
    }

    // SMTP conversation
    let response = await sendCommand("EHLO " + config.hostname);
    if (!response.startsWith("250")) {
      throw new Error(`EHLO failed: ${response}`);
    }

    // Check if STARTTLS is available and needed
    if (!config.tls && config.port !== 465 && response.includes("STARTTLS")) {
      console.log("Starting TLS...");
      response = await sendCommand("STARTTLS");
      if (response.startsWith("220")) {
        // Upgrade connection to TLS
        conn.close();
        conn = await Deno.connectTls({
          hostname: config.hostname,
          port: config.port,
        });
        console.log("TLS upgrade successful");
        // Send EHLO again after TLS
        response = await sendCommand("EHLO " + config.hostname);
        if (!response.startsWith("250")) {
          throw new Error(`EHLO after TLS failed: ${response}`);
        }
      }
    }

    // Authenticate
    const authString = btoa(`\0${config.username}\0${config.password}`);
    response = await sendCommand(`AUTH PLAIN ${authString}`);
    if (!response.startsWith("235")) {
      throw new Error(`Authentication failed: ${response}`);
    }

    // Send email
    response = await sendCommand(`MAIL FROM:<${emailData.from_email}>`);
    if (!response.startsWith("250")) {
      throw new Error(`MAIL FROM failed: ${response}`);
    }

    response = await sendCommand(`RCPT TO:<${emailData.to_email}>`);
    if (!response.startsWith("250")) {
      throw new Error(`RCPT TO failed: ${response}`);
    }

    response = await sendCommand("DATA");
    if (!response.startsWith("354")) {
      throw new Error(`DATA command failed: ${response}`);
    }

    // Build email content
    const emailContent = [
      `From: ${emailData.from_name} <${emailData.from_email}>`,
      `To: ${emailData.to_email}`,
      `Subject: ${emailData.subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      `MIME-Version: 1.0`,
      ``,
      emailData.html_content,
      `.`
    ].join("\r\n");

    await conn.write(encoder.encode(emailContent + "\r\n"));
    
    const dataBuffer = new Uint8Array(4096);
    const dataBytes = await conn.read(dataBuffer);
    if (!dataBytes) throw new Error("Connection closed during DATA");
    
    response = decoder.decode(dataBuffer.subarray(0, dataBytes));
    console.log("DATA Response:", response.trim());
    
    if (!response.startsWith("250")) {
      throw new Error(`Email sending failed: ${response}`);
    }

    // Quit
    await sendCommand("QUIT");
    
    console.log("Email sent successfully via SMTP");
    return {
      success: true,
      message: "Email sent successfully",
      messageId: response.match(/Message-ID: (.+)/)?.[1] || "unknown"
    };

  } catch (error) {
    console.error("SMTP Error:", error);
    throw error;
  } finally {
    try {
      if (conn) {
        conn.close();
      }
    } catch (e) {
      console.log("Connection cleanup complete");
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Native email function called");
  const requestId = crypto.randomUUID();
  console.log("Request ID:", requestId);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log("Invalid method:", req.method);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Method not allowed',
      request_id: requestId
    }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const emailData = await req.json();
    console.log("Email data received:", { 
      to_email: emailData.to_email, 
      subject: emailData.subject,
      from_email: emailData.from_email,
      from_name: emailData.from_name 
    });

    // Validate required fields
    if (!emailData.to_email || !emailData.subject || !emailData.html_content) {
      console.log("Missing required fields");
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields: to_email, subject, html_content",
        request_id: requestId
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get SMTP configuration from environment (robusta com fallback)
    const smtpHost = Deno.env.get("NATIVE_SMTP_HOST");
    const smtpPortRaw = Deno.env.get("NATIVE_SMTP_PORT") || "";
    const smtpUser = Deno.env.get("NATIVE_SMTP_USER");
    const smtpPass = Deno.env.get("NATIVE_SMTP_PASS");
    const smtpSecureRaw = Deno.env.get("NATIVE_SMTP_SECURE") || "";

    console.log("Environment check:", {
      host: smtpHost ? "✓" : "✗",
      port: smtpPortRaw ? "✓" : "(fallback 587)", 
      user: smtpUser ? "✓" : "✗",
      pass: smtpPass ? "✓" : "✗",
      secure: smtpSecureRaw || "false"
    });

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("Missing SMTP configuration");
      return new Response(JSON.stringify({
        success: false,
        error: "SMTP configuration incomplete",
        details: "Missing required environment variables: NATIVE_SMTP_HOST, NATIVE_SMTP_USER, NATIVE_SMTP_PASS",
        request_id: requestId
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Porta resiliente: extrai números e aplica fallback 587 quando necessário
    let parsedPort = parseInt(smtpPortRaw, 10);
    let correctedPort = false;
    if (!Number.isFinite(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
      const match = smtpPortRaw.match(/\d{2,5}/);
      if (match) {
        parsedPort = parseInt(match[0], 10);
        correctedPort = true;
        console.warn(`Corrected SMTP port from '${smtpPortRaw}' to '${parsedPort}'`);
      } else {
        parsedPort = 587; // Fallback seguro
        correctedPort = true;
        console.warn(`Using fallback SMTP port 587 because provided value '${smtpPortRaw}' is invalid or missing`);
      }
    }

    // Interpretação flexível do "secure"
    const secureVal = smtpSecureRaw.toLowerCase().trim();
    const secureParsed = ["true", "1", "yes", "ssl", "tls"].includes(secureVal);

    // Ajuste do remetente padrão: usa o usuário SMTP quando não informado
    if (!emailData.from_email) {
      emailData.from_email = smtpUser;
    }

    // Use the modern SMTP implementation
    const smtpConfig: SMTPConfig = {
      hostname: smtpHost,
      port: parsedPort,
      username: smtpUser,
      password: smtpPass,
      tls: secureParsed || parsedPort === 465
    };

    const result = await sendEmailViaSMTP(smtpConfig, emailData);
    
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({
      success: true,
      message: "Email sent successfully",
      messageId: result.messageId,
      provider: "native_smtp",
      request_id: requestId
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("Send email error:", error);
    
    // Enhanced error handling with specific SMTP errors
    let errorMessage = "Email sending failed";
    let suggestions: string[] = [];
    
    if (error.message?.includes("Authentication failed")) {
      errorMessage = "SMTP Authentication failed";
      suggestions = [
        "Verify SMTP username and password",
        "Check if account requires app-specific password",
        "Ensure SMTP user matches from_email domain"
      ];
    } else if (error.message?.includes("Connection")) {
      errorMessage = "SMTP Connection failed";
      suggestions = [
        "Verify SMTP host and port configuration",
        "Check network connectivity",
        "Ensure firewall allows SMTP traffic"
      ];
    } else if (error.message?.includes("TLS") || error.message?.includes("SSL")) {
      errorMessage = "SMTP Security configuration error";
      suggestions = [
        "Try different port (587 for STARTTLS, 465 for SSL)",
        "Check NATIVE_SMTP_SECURE setting",
        "Verify server supports your chosen security method"
      ];
    }

    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details: error.message,
      suggestions,
      request_id: requestId
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

serve(handler);