import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { RequestValidator } from "./request-validator.ts";
import { ErrorHandler } from "./error-handler.ts";
import { saveScriptToDatabase, getUserFromToken } from "./database-operations.ts";
import { EnhancedRequestHandler } from "./enhanced-request-handler.ts";

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
    console.log("🎬 FLUIDAROTEIRISTA Edge function iniciada");

    // VALIDAR AUTENTICAÇÃO
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Autenticação obrigatória (token não fornecido)" }), { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      console.error('❌ Não autenticado/usuário inválido:', userError);
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), { status: 401, headers: corsHeaders });
    }

    // Rate limiting por usuário
    const { data: rateData, error: rateError } = await supabaseAdmin.rpc('check_rate_limit', {
      p_identifier: user.id,
      p_endpoint: 'generate-script',
      p_max_requests: 20,
      p_window_minutes: 1
    });
    if (rateError) {
      console.error('Erro no rate limit:', rateError);
    } else if (rateData && rateData.allowed === false) {
      return new Response(JSON.stringify({ error: 'Limite de requisições excedido', ...rateData }), { status: 429, headers: corsHeaders });
    }

    // Validate OpenAI API key
    const openAIApiKey = RequestValidator.validateOpenAIKey();
    
    // Parse and validate request
    let requestData;
    try {
      requestData = await req.json();
      console.log("📥 Dados recebidos:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error("❌ Erro ao processar JSON da requisição:", parseError);
      throw new Error("Formato de requisição inválido: não foi possível processar JSON");
    }
    
    const request = RequestValidator.validateRequest(requestData);
    
    // Initialize enhanced request handler
    const enhancedHandler = new EnhancedRequestHandler(openAIApiKey);
    
    // Process request with equipment integration
    console.log("🔧 Processando request com integração de equipamentos...");
    const { systemPrompt, userPrompt, equipmentDetails } = await enhancedHandler.processFluidaRequest(request);
    
    console.log("📋 Equipamentos integrados:", equipmentDetails.length);
    equipmentDetails.forEach(eq => {
      console.log(`✅ ${eq.nome}: ${eq.tecnologia}`);
    });
    
    // Call OpenAI API with enhanced prompts and equipment validation
    console.log("🤖 Chamando OpenAI API com validação de equipamentos...");
    const content = await enhancedHandler.callOpenAI(systemPrompt, userPrompt, equipmentDetails, {
      format: request.format || request.type || 'reels',
      maxStories: 5,
      bannedPhrases: ['do jeito Ladeira', 'Ladeira CopyWarrior', 'CopyWarrior'],
      userId: user.id,
      modelTier: (request as any).modelTier || 'standard'
    });
    console.log("✅ Resposta recebida da OpenAI com equipamentos validados");
    
    // Format the response
    const { type, topic, equipment, bodyArea } = request;
    const scriptResponse = {
      content,
      title: `Roteiro FLUIDAROTEIRISTA - ${topic}`,
      topic,
      equipment: equipmentDetails.map(eq => eq.nome),
      equipmentDetails,
      bodyArea,
      type: type === 'custom' ? 'fluidaroteirista' : type,
      success: true
    };

    // Tentar salvar no banco (sem quebrar o fluxo se falhar)
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        
        const user = await getUserFromToken(supabaseAdmin, token);
        
        if (user) {
          console.log("💾 Tentando salvar no banco...");
          await saveScriptToDatabase(supabaseAdmin, {
            usuario_id: user.id,
            tipo: type === 'custom' ? 'fluidaroteirista' : type,
            titulo: scriptResponse.title || 'Roteiro FLUIDAROTEIRISTA',
            conteudo: content,
            status: 'gerado',
            objetivo_marketing: request.marketingObjective || null
          });
        }
      }
    } catch (dbError) {
      console.error('⚠️ Erro ao salvar no banco (continuando):', dbError);
      // Continuar mesmo se o save no banco falhar
    }

    console.log("📤 Enviando resposta FLUIDAROTEIRISTA para o cliente");
    
    return new Response(JSON.stringify(scriptResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("🔥 Erro crítico na função:", error);
    return ErrorHandler.handle(error, corsHeaders);
  }
});
