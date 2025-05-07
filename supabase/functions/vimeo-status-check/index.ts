
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Iniciando verificação de status do Vimeo");
    
    // Check for environment variables
    const envVars = {
      VIMEO_CLIENT_ID: Deno.env.get("VIMEO_CLIENT_ID") || "",
      VIMEO_CLIENT_SECRET: Deno.env.get("VIMEO_CLIENT_SECRET") || "",
      VIMEO_REDIRECT_URI: Deno.env.get("VIMEO_REDIRECT_URI") || ""
    };
    
    // Check Vimeo API availability with multiple attempts and timeouts
    let vimeoApiAvailable = false;
    let statusCode = 0;
    let responseText = "";
    
    try {
      console.log("Testando conexão com a API do Vimeo...");
      
      // First attempt with a shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const vimeoResponse = await fetch("https://api.vimeo.com", {
          method: "HEAD",
          headers: {
            "User-Agent": "VimeoStatusCheck/1.0"
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        statusCode = vimeoResponse.status;
        vimeoApiAvailable = vimeoResponse.status < 500; // Any response that is not a server error
        
        console.log(`Teste de conexão com a API do Vimeo: ${vimeoApiAvailable ? "Sucesso" : "Falha"}`);
        console.log(`Status da resposta: ${vimeoResponse.status}`);
        
        // Try to get response text for additional debug info
        try {
          responseText = await vimeoResponse.text();
          console.log("Response text:", responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""));
        } catch (textError) {
          console.log("Couldn't get response text");
        }
        
      } catch (timeoutError) {
        clearTimeout(timeoutId);
        console.error("Timeout ao conectar com a API do Vimeo (primeira tentativa):", timeoutError.message);
        
        // Second attempt with different parameters
        console.log("Fazendo segunda tentativa com parâmetros diferentes...");
        try {
          const vimeoResponse2 = await fetch("https://api.vimeo.com/oauth/authorize", {
            method: "HEAD",
            headers: {
              "User-Agent": "Mozilla/5.0 VimeoCheck"
            }
          });
          
          statusCode = vimeoResponse2.status;
          vimeoApiAvailable = vimeoResponse2.status < 500;
          console.log(`Segunda tentativa: ${vimeoApiAvailable ? "Sucesso" : "Falha"}`);
          console.log(`Status da resposta (2ª tentativa): ${vimeoResponse2.status}`);
          
        } catch (secondError) {
          console.error("Erro na segunda tentativa:", secondError.message);
          // Third attempt with minimal parameters
          try {
            const vimeoResponse3 = await fetch("https://vimeo.com", { method: "HEAD" });
            
            statusCode = vimeoResponse3.status;
            vimeoApiAvailable = vimeoResponse3.status < 500;
            console.log(`Terceira tentativa (vimeo.com): ${vimeoApiAvailable ? "Sucesso" : "Falha"}`);
            
          } catch (thirdError) {
            console.error("Todas as tentativas falharam:", thirdError.message);
          }
        }
      }
    } catch (apiError) {
      console.error("Erro ao conectar com a API do Vimeo:", apiError.message);
      console.error("Stack trace:", apiError.stack);
      vimeoApiAvailable = false;
    }
    
    // Check if environment variables are configured
    const configComplete = Boolean(
      envVars.VIMEO_CLIENT_ID && 
      envVars.VIMEO_CLIENT_SECRET && 
      envVars.VIMEO_REDIRECT_URI
    );
    
    // Log environment variable status
    console.log("Status das variáveis de ambiente:");
    console.log(`VIMEO_CLIENT_ID: ${envVars.VIMEO_CLIENT_ID ? "Configurado" : "Não configurado"}`);
    console.log(`VIMEO_CLIENT_SECRET: ${envVars.VIMEO_CLIENT_SECRET ? "Configurado" : "Não configurado"}`);
    console.log(`VIMEO_REDIRECT_URI: ${envVars.VIMEO_REDIRECT_URI ? "Configurado" : "Não configurado"}`);
    
    // Detect network environment
    let networkInfo = {};
    try {
      const dnsResponse = await Deno.resolveDns("api.vimeo.com", "A");
      networkInfo.dns_resolution = {
        success: true,
        addresses: dnsResponse
      };
    } catch (dnsError) {
      networkInfo.dns_resolution = {
        success: false,
        error: dnsError.message
      };
    }
    
    return new Response(
      JSON.stringify({
        api_available: vimeoApiAvailable,
        config_complete: configComplete,
        env_vars: {
          vimeo_client_id: Boolean(envVars.VIMEO_CLIENT_ID),
          vimeo_client_secret: Boolean(envVars.VIMEO_CLIENT_SECRET),
          vimeo_redirect_uri: Boolean(envVars.VIMEO_REDIRECT_URI),
        },
        diagnostics: {
          status_code: statusCode,
          timestamp: new Date().toISOString(),
          network_info: networkInfo
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Erro na verificação do status do Vimeo:", error);
    console.error("Stack trace:", error.stack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro desconhecido durante a verificação de status",
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
