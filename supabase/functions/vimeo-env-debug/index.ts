
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
    console.log("Iniciando diagnóstico de variáveis de ambiente");
    
    // Verificar variáveis de ambiente disponíveis relacionadas ao Vimeo
    const vimeoEnvVars = {
      VIMEO_CLIENT_ID: Deno.env.get("VIMEO_CLIENT_ID") || null,
      VIMEO_CLIENT_SECRET: Deno.env.get("VIMEO_CLIENT_SECRET") || null,
      VIMEO_REDIRECT_URI: Deno.env.get("VIMEO_REDIRECT_URI") || null
    };
    
    // Verificar se as variáveis existem (sem mostrar valores completos)
    const diagnostico = {
      VIMEO_CLIENT_ID: {
        configurado: Boolean(vimeoEnvVars.VIMEO_CLIENT_ID),
        valor_parcial: vimeoEnvVars.VIMEO_CLIENT_ID 
          ? `${vimeoEnvVars.VIMEO_CLIENT_ID.substring(0, 3)}...${vimeoEnvVars.VIMEO_CLIENT_ID.substring(vimeoEnvVars.VIMEO_CLIENT_ID.length - 3)}` 
          : null,
        tamanho: vimeoEnvVars.VIMEO_CLIENT_ID ? vimeoEnvVars.VIMEO_CLIENT_ID.length : 0
      },
      VIMEO_CLIENT_SECRET: {
        configurado: Boolean(vimeoEnvVars.VIMEO_CLIENT_SECRET),
        valor_parcial: vimeoEnvVars.VIMEO_CLIENT_SECRET 
          ? `${vimeoEnvVars.VIMEO_CLIENT_SECRET.substring(0, 3)}...${vimeoEnvVars.VIMEO_CLIENT_SECRET.substring(vimeoEnvVars.VIMEO_CLIENT_SECRET.length - 3)}` 
          : null,
        tamanho: vimeoEnvVars.VIMEO_CLIENT_SECRET ? vimeoEnvVars.VIMEO_CLIENT_SECRET.length : 0
      },
      VIMEO_REDIRECT_URI: {
        configurado: Boolean(vimeoEnvVars.VIMEO_REDIRECT_URI),
        valor_completo: vimeoEnvVars.VIMEO_REDIRECT_URI, // URI pode ser mostrado completo
        tamanho: vimeoEnvVars.VIMEO_REDIRECT_URI ? vimeoEnvVars.VIMEO_REDIRECT_URI.length : 0
      }
    };
    
    // Verificar todas as variáveis de ambiente
    // (útil para detectar se há variáveis com nomes errados ou com case diferente)
    const todasVariaveis = {};
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
      if (!key.includes("SECRET") && !key.includes("KEY") && !key.includes("PASSWORD") && !key.includes("TOKEN")) {
        todasVariaveis[key] = value;
      } else {
        todasVariaveis[key] = "[VALOR SENSÍVEL OCULTADO]";
      }
    }
    
    // Verificar se tem variáveis similares (caso de erro de digitação)
    const variaveis_similares = Object.keys(todasVariaveis)
      .filter(key => 
        key.toLowerCase().includes('vimeo') || 
        key.toLowerCase().includes('client') || 
        key.toLowerCase().includes('redirect')
      )
      .filter(key => !['VIMEO_CLIENT_ID', 'VIMEO_CLIENT_SECRET', 'VIMEO_REDIRECT_URI'].includes(key));
    
    // Verificar se consegue acessar a API do Vimeo
    let vimeo_api_status = null;
    try {
      const vimeoResponse = await fetch("https://api.vimeo.com", {
        method: "HEAD",
        headers: { "User-Agent": "VimeoEnvDebug/1.0" }
      });
      
      vimeo_api_status = {
        acessivel: vimeoResponse.ok,
        status: vimeoResponse.status,
        status_text: vimeoResponse.statusText
      };
    } catch (apiError) {
      vimeo_api_status = {
        acessivel: false,
        erro: apiError.message
      };
    }
    
    console.log("Diagnóstico concluído, retornando resultados");
    
    // Formatar diagnóstico final
    const diagnósticoFinal = {
      status: diagnostico.VIMEO_CLIENT_ID.configurado && 
              diagnostico.VIMEO_CLIENT_SECRET.configurado && 
              diagnostico.VIMEO_REDIRECT_URI.configurado ? "completo" : "incompleto",
      variaveis_vimeo: diagnostico,
      variaveis_similares_encontradas: variaveis_similares,
      vimeo_api_alcancavel: vimeo_api_status,
      timestamp: new Date().toISOString(),
      funcao: "vimeo-env-debug",
      variavel_count: Object.keys(todasVariaveis).length,
      recomendacao: !diagnostico.VIMEO_CLIENT_ID.configurado || 
                   !diagnostico.VIMEO_CLIENT_SECRET.configurado || 
                   !diagnostico.VIMEO_REDIRECT_URI.configurado 
                   ? "Execute os comandos de configuração novamente. Se o problema persistir, verifique se está usando o mesmo ambiente de trabalho (project e branch) para o CLI e para a aplicação."
                   : "Todas as variáveis necessárias estão configuradas. Se ainda há problemas, verifique o redeploy das funções."
    };
    
    return new Response(
      JSON.stringify(diagnósticoFinal, null, 2),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Erro ao realizar diagnóstico:", error);
    
    return new Response(
      JSON.stringify({
        erro: error.message || "Erro desconhecido durante diagnóstico",
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
