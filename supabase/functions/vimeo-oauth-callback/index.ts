
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Vimeo OAuth Configuration
const VIMEO_TOKEN_URL = "https://api.vimeo.com/oauth/access_token";
const VIMEO_CLIENT_ID = Deno.env.get("VIMEO_CLIENT_ID") || "";
const VIMEO_CLIENT_SECRET = Deno.env.get("VIMEO_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("VIMEO_REDIRECT_URI") || "https://fluida.online/auth/vimeo/callback";

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processando callback OAuth do Vimeo");
    
    // Parse the request data
    const requestData = await req.json().catch(() => ({}));
    const { code, state } = requestData;

    if (!code) {
      console.error("Código de autorização não fornecido");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Código de autorização não fornecido"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!VIMEO_CLIENT_ID || !VIMEO_CLIENT_SECRET) {
      console.error("Credenciais do Vimeo incompletas nas variáveis de ambiente");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuração do Vimeo incompleta. Credenciais não configuradas."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Trocando código por token: ${code.substring(0, 10)}...`);

    // Exchange the code for an access token
    const tokenResponse = await fetch(VIMEO_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.vimeo.*+json;version=3.4"
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: VIMEO_CLIENT_ID,
        client_secret: VIMEO_CLIENT_SECRET
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Erro ao trocar código por token:", tokenData);
      return new Response(
        JSON.stringify({
          success: false,
          error: tokenData.error_description || tokenData.error || "Erro ao obter token do Vimeo",
          details: tokenData
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Token obtido com sucesso:", tokenData.access_token.substring(0, 10) + "...");

    // Extract user ID from state if available
    let userId = null;
    if (state && state.includes("__")) {
      const stateParts = state.split("__");
      if (stateParts.length === 2) {
        userId = stateParts[1];
      }
    }

    // If we have userId, save the token information to the database
    if (userId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      console.log(`Salvando token para o usuário: ${userId}`);
      
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        // Get account information from Vimeo
        const userResponse = await fetch("https://api.vimeo.com/me", {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.vimeo.*+json;version=3.4"
          }
        });
        
        const userData = await userResponse.json();
        const accountName = userData.name || "Vimeo User";
        const accountUri = userData.uri || "";
        
        // Calculate token expiration
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
        
        // Check if user already has a token
        const { data: existingToken } = await supabase
          .from("user_vimeo_tokens")
          .select("id")
          .eq("user_id", userId)
          .single();
          
        if (existingToken) {
          // Update existing token
          await supabase
            .from("user_vimeo_tokens")
            .update({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              expires_at: expiresAt.toISOString(),
              account_name: accountName,
              account_uri: accountUri,
              scope: tokenData.scope
            })
            .eq("id", existingToken.id);
        } else {
          // Insert new token
          await supabase
            .from("user_vimeo_tokens")
            .insert({
              user_id: userId,
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              expires_at: expiresAt.toISOString(),
              account_name: accountName,
              account_uri: accountUri,
              scope: tokenData.scope
            });
        }
        
        console.log("Token salvo com sucesso no banco de dados");
      } catch (dbError) {
        console.error("Erro ao salvar token no banco de dados:", dbError);
        // Continue with the response even if DB save fails
      }
    } else {
      console.log("Não foi possível salvar o token: userId ou credenciais Supabase não fornecidos");
    }

    // Return the tokens
    return new Response(
      JSON.stringify({
        success: true,
        message: "Autenticação Vimeo concluída com sucesso",
        token_info: {
          access_token: tokenData.access_token,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
          expires_in: tokenData.expires_in
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Erro no processamento do callback:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro no processamento do callback OAuth do Vimeo"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
