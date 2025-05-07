
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Vimeo OAuth Configuration
const VIMEO_AUTH_URL = "https://api.vimeo.com/oauth/authorize";
const VIMEO_CLIENT_ID = Deno.env.get("VIMEO_CLIENT_ID") || "";
const REDIRECT_URI = Deno.env.get("VIMEO_REDIRECT_URI") || "https://fluida.online/auth/vimeo/callback";

// Required scopes for the application
const REQUIRED_SCOPES = ["public", "private", "video_files", "upload", "edit", "interact"];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Iniciando fluxo OAuth do Vimeo");

    // Get request body
    const requestData = await req.json().catch(() => ({}));
    const userId = requestData.user_id || "";
    
    // Get URL parameters if needed
    const url = new URL(req.url);
    const stateParam = url.searchParams.get("state") || "";

    // Verificar as variáveis de ambiente disponíveis
    console.log("Verificando variáveis de ambiente...");
    console.log(`VIMEO_CLIENT_ID presente: ${Boolean(VIMEO_CLIENT_ID)}`);
    console.log(`REDIRECT_URI configurado: ${REDIRECT_URI}`);

    if (!VIMEO_CLIENT_ID) {
      console.error("VIMEO_CLIENT_ID não encontrado nas variáveis de ambiente");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuração do Vimeo incompleta. VIMEO_CLIENT_ID não configurado."
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    // Generate the OAuth authorization URL
    const scopes = REQUIRED_SCOPES.join(" ");
    const state = stateParam || generateRandomString(16);
    
    // Add userId to state if provided
    const finalState = userId ? `${state}__${userId}` : state;

    try {
      const authUrl = `${VIMEO_AUTH_URL}?` +
        `response_type=code&` +
        `client_id=${encodeURIComponent(VIMEO_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `state=${encodeURIComponent(finalState)}&` +
        `scope=${encodeURIComponent(scopes)}`;

      console.log(`URL de autorização gerada: ${authUrl}`);

      return new Response(
        JSON.stringify({
          success: true,
          auth_url: authUrl,
          state: finalState,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (urlError) {
      console.error("Erro ao gerar URL de autorização:", urlError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Erro ao construir URL de autorização",
          details: urlError.message
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao gerar URL de autorização:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro ao gerar URL de autorização do Vimeo"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// Helper function to generate a random string for the state parameter
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}
