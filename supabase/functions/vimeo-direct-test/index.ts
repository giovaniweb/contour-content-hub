
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
  
  console.log("Iniciando teste direto de conexão com o Vimeo");
  
  try {
    // Test main Vimeo API domain
    let mainApiResult;
    try {
      console.log("Testando conexão com api.vimeo.com");
      const mainResponse = await fetch("https://api.vimeo.com", {
        method: "HEAD",
        headers: { "User-Agent": "Supabase Edge Function Test" }
      });
      
      mainApiResult = {
        ok: mainResponse.ok,
        status: mainResponse.status,
        statusText: mainResponse.statusText
      };
      console.log(`Resultado para api.vimeo.com: ${JSON.stringify(mainApiResult)}`);
    } catch (mainError) {
      mainApiResult = {
        ok: false,
        error: mainError.message
      };
      console.error(`Erro ao conectar com api.vimeo.com: ${mainError.message}`);
    }
    
    // Test Vimeo main website
    let mainSiteResult;
    try {
      console.log("Testando conexão com vimeo.com");
      const siteResponse = await fetch("https://vimeo.com", {
        method: "HEAD",
        headers: { "User-Agent": "Mozilla/5.0 Supabase Test" }
      });
      
      mainSiteResult = {
        ok: siteResponse.ok,
        status: siteResponse.status,
        statusText: siteResponse.statusText
      };
      console.log(`Resultado para vimeo.com: ${JSON.stringify(mainSiteResult)}`);
    } catch (siteError) {
      mainSiteResult = {
        ok: false,
        error: siteError.message
      };
      console.error(`Erro ao conectar com vimeo.com: ${siteError.message}`);
    }
    
    // Test DNS resolution
    let dnsResult;
    try {
      console.log("Executando resolução DNS para api.vimeo.com");
      const dnsResponse = await Deno.resolveDns("api.vimeo.com", "A");
      dnsResult = {
        success: true,
        addresses: dnsResponse
      };
      console.log(`Resolução DNS para api.vimeo.com: ${JSON.stringify(dnsResult)}`);
    } catch (dnsError) {
      dnsResult = {
        success: false,
        error: dnsError.message
      };
      console.error(`Erro na resolução DNS: ${dnsError.message}`);
    }
    
    // Test external internet access
    let externalTest;
    try {
      console.log("Testando acesso externo (google.com)");
      const externalResponse = await fetch("https://www.google.com", { method: "HEAD" });
      externalTest = {
        ok: externalResponse.ok,
        status: externalResponse.status
      };
      console.log(`Teste externo: ${JSON.stringify(externalTest)}`);
    } catch (extError) {
      externalTest = {
        ok: false,
        error: extError.message
      };
      console.error(`Erro no teste externo: ${extError.message}`);
    }
    
    // Summarize results
    const isVimeoAccessible = mainApiResult.ok || mainSiteResult.ok;
    const hasInternetAccess = externalTest.ok;
    const hasDnsResolution = dnsResult.success;
    
    // Analyze potential issues
    let diagnosis = "unknown";
    let recommendation = "";
    
    if (!hasInternetAccess) {
      diagnosis = "no_internet";
      recommendation = "A função edge não tem acesso à internet. Verifique as configurações da sua conta Supabase.";
    } else if (!hasDnsResolution) {
      diagnosis = "dns_failure";
      recommendation = "A resolução DNS para o domínio Vimeo falhou. Pode ser um problema temporário ou uma restrição de rede.";
    } else if (!isVimeoAccessible && hasInternetAccess) {
      diagnosis = "vimeo_blocked";
      recommendation = "Supabase pode estar bloqueando acesso ao Vimeo. Verifique se há alguma política de segurança ou firewall ativa.";
    } else if (isVimeoAccessible) {
      diagnosis = "connection_ok";
      recommendation = "A conexão com o Vimeo está funcionando corretamente a partir desta função edge.";
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        is_vimeo_accessible: isVimeoAccessible,
        has_internet_access: hasInternetAccess,
        has_dns_resolution: hasDnsResolution,
        diagnosis,
        recommendation,
        tests: {
          api_vimeo_com: mainApiResult,
          vimeo_com: mainSiteResult,
          dns_resolution: dnsResult,
          external_access: externalTest
        },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Erro no teste direto:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
