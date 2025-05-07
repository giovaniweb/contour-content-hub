
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
    
    // Check Vimeo API availability
    let vimeoApiAvailable = false;
    try {
      console.log("Testando conexão com a API do Vimeo...");
      const vimeoResponse = await fetch("https://api.vimeo.com", {
        method: "HEAD",
        headers: {
          "User-Agent": "VimeoStatusCheck/1.0"
        }
      });
      
      vimeoApiAvailable = vimeoResponse.status < 500; // Any response that is not a server error
      console.log(`Teste de conexão com a API do Vimeo: ${vimeoApiAvailable ? "Sucesso" : "Falha"}`);
      console.log(`Status da resposta: ${vimeoResponse.status}`);
    } catch (apiError) {
      console.error("Erro ao conectar com a API do Vimeo:", apiError.message);
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
    
    return new Response(
      JSON.stringify({
        api_available: vimeoApiAvailable,
        config_complete: configComplete,
        env_vars: {
          vimeo_client_id: Boolean(envVars.VIMEO_CLIENT_ID),
          vimeo_client_secret: Boolean(envVars.VIMEO_CLIENT_SECRET),
          vimeo_redirect_uri: Boolean(envVars.VIMEO_REDIRECT_URI),
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Erro na verificação do status do Vimeo:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro desconhecido durante a verificação de status",
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
