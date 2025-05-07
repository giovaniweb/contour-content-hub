
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
    const { token } = await req.json();
    
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Token de acesso é necessário" 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Fazer uma chamada para a API do Vimeo para verificar se o token é válido
    const vimeoResponse = await fetch('https://api.vimeo.com/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const vimeoData = await vimeoResponse.json();
    
    if (vimeoResponse.ok) {
      // Token é válido
      return new Response(JSON.stringify({
        success: true,
        message: `Conexão estabelecida como ${vimeoData.name || 'usuário do Vimeo'}`,
        user: vimeoData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      // Token é inválido
      return new Response(JSON.stringify({
        success: false,
        error: vimeoData.error || "Token de acesso inválido",
        details: vimeoData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }
  } catch (error) {
    console.error("Error in vimeo-test-connection function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao testar conexão com Vimeo'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
