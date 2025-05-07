
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
    // Log de entrada para depuração
    console.log("Iniciando teste de conexão Vimeo");
    
    // Parse do request body
    const requestData = await req.json().catch(e => {
      console.error("Erro ao parsear o request body:", e);
      throw new Error("Formato de request inválido");
    });
    
    const { token } = requestData;
    
    if (!token) {
      console.error("Token não fornecido no request");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Token de acesso é necessário" 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    console.log("Chamando API do Vimeo com token válido");
    
    // Fazer uma chamada para a API do Vimeo para verificar se o token é válido
    const vimeoResponse = await fetch('https://api.vimeo.com/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const vimeoData = await vimeoResponse.json();
    
    // Log da resposta da API do Vimeo para depuração
    console.log(`Resposta da API do Vimeo - Status: ${vimeoResponse.status}`);
    console.log("Dados da resposta:", JSON.stringify(vimeoData));
    
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
      // Token é inválido - retorna detalhes específicos do erro do Vimeo
      return new Response(JSON.stringify({
        success: false,
        error: vimeoData.error || "Token de acesso inválido",
        details: vimeoData,
        status: vimeoResponse.status
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }
  } catch (error) {
    // Capturar e logar qualquer erro não tratado
    console.error("Erro não tratado na função vimeo-test-connection:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao testar conexão com Vimeo',
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
