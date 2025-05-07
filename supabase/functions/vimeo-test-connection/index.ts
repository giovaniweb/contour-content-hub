
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
      
      // Retorna erro com status 200 para o cliente (para evitar erro de Edge Function)
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Token de acesso é necessário" 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Mudamos para 200 para que o cliente receba a resposta sem erro
      });
    }
    
    console.log("Chamando API do Vimeo com token válido");
    
    try {
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } else {
        // Token é inválido - retorna detalhes específicos do erro do Vimeo
        // mas usando código 200 para que o cliente receba a resposta
        return new Response(JSON.stringify({
          success: false,
          error: vimeoData.error || "Token de acesso inválido",
          details: vimeoData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Usar 200 mesmo quando há erro do Vimeo
        });
      }
    } catch (vimeoError) {
      // Erro ao se comunicar com a API do Vimeo
      console.error("Erro ao chamar API do Vimeo:", vimeoError);
      return new Response(JSON.stringify({
        success: false,
        error: "Falha na comunicação com a API do Vimeo",
        details: { message: vimeoError.message }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Usar 200 para que o cliente receba a resposta
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
      status: 200, // Sempre usar 200 para evitar o erro de Edge Function
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
