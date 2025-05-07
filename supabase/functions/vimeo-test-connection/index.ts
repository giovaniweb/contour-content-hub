
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
        status: 200
      });
    }
    
    // Validação básica do formato do token
    if (token.length < 20) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Formato de token inválido", 
        help: "O token fornecido parece estar incompleto. Tokens do Vimeo são geralmente longos (64+ caracteres).",
        instructions: "Certifique-se de copiar o token inteiro do painel do Vimeo."
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    console.log("Chamando API do Vimeo com token");
    console.log(`Token length: ${token.length}, primeiros/últimos caracteres: ${token.substring(0, 5)}...${token.substring(token.length - 5)}`);
    
    try {
      // Verificar quais escopos o token possui
      const vimeoResponse = await fetch('https://api.vimeo.com/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const vimeoData = await vimeoResponse.json();
      
      console.log(`Resposta da API do Vimeo - Status: ${vimeoResponse.status}`);
      console.log("Dados da resposta:", JSON.stringify(vimeoData));
      
      if (vimeoResponse.ok) {
        // Token é válido, verificar escopos
        if (vimeoData.scopes && Array.isArray(vimeoData.scopes)) {
          const requiredScopes = ['public', 'private', 'upload', 'edit', 'interact', 'video_files'];
          const missingScopes = requiredScopes.filter(scope => !vimeoData.scopes.includes(scope));
          
          if (missingScopes.length > 0) {
            // Token é válido, mas faltam escopos
            return new Response(JSON.stringify({
              success: false,
              error: "Seu token não possui todos os escopos necessários",
              help: `Faltam os seguintes escopos: ${missingScopes.join(', ')}. Por favor, gere um novo token com todos os escopos necessários.`,
              required_scopes: requiredScopes,
              current_scopes: vimeoData.scopes,
              missing_scopes: missingScopes,
              details: vimeoData
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            });
          }
          
          // Token é válido e possui todos os escopos necessários
          return new Response(JSON.stringify({
            success: true,
            message: `Conexão estabelecida como ${vimeoData.name || 'usuário do Vimeo'}`,
            user: vimeoData
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
        
        // Não foi possível verificar os escopos
        return new Response(JSON.stringify({
          success: true,
          warning: "Não foi possível verificar os escopos do token, mas a conexão foi estabelecida",
          message: `Conexão estabelecida como ${vimeoData.name || 'usuário do Vimeo'}`,
          user: vimeoData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } else {
        // Verificar se é um erro comum como token truncado
        if (token.length < 32 || (vimeoData.error && vimeoData.error.includes("invalid"))) {
          return new Response(JSON.stringify({
            success: false,
            error: "Token inválido ou incompleto",
            help: "O token fornecido parece estar truncado ou é inválido. Tokens do Vimeo são mais longos.",
            instructions: `
              1. Acesse o painel do Vimeo Developer
              2. Gere um novo token de acesso pessoal com todos os escopos
              3. Copie o token completo (não apenas uma parte dele)
              4. Cole o token completo no formulário
            `,
            details: vimeoData
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
        
        // Tratamento específico para o erro 8003
        if (vimeoData.error_code === 8003 || 
            (vimeoData.developer_message && vimeoData.developer_message.includes("app didn't receive the user's credentials"))) {
          
          return new Response(JSON.stringify({
            success: false,
            error: "Erro de autenticação com o Vimeo",
            help: "Seu token deve incluir os escopos: public, private, upload, edit, interact e video_files.",
            instructions: `
              1. Acesse https://developer.vimeo.com/apps
              2. Selecione seu aplicativo ou crie um novo
              3. Na seção 'Authentication', marque todos os escopos necessários
              4. Gere um novo token de acesso pessoal
              5. Copie e use o novo token aqui
            `,
            details: vimeoData
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
        
        // Token é inválido - outros casos
        return new Response(JSON.stringify({
          success: false,
          error: vimeoData.error || "Token de acesso inválido",
          details: vimeoData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
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
        status: 200
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
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
