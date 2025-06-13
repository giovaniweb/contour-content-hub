
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
    
    // Process request with equipment integration and robust error handling
    console.log("🔧 Processando request com integração de equipamentos...");
    let systemPrompt: string;
    let userPrompt: string;
    let equipmentDetails: any[] = [];
    
    try {
      const result = await enhancedHandler.processFluidaRequest(request);
      systemPrompt = result.systemPrompt;
      userPrompt = result.userPrompt;
      equipmentDetails = result.equipmentDetails;
      
      console.log("📋 Equipamentos integrados:", equipmentDetails.length);
      equipmentDetails.forEach(eq => {
        console.log(`✅ ${eq.nome}: ${eq.tecnologia}`);
      });
    } catch (processError) {
      console.error("⚠️ Erro no processamento (usando fallback):", processError);
      // Fallback para continuar mesmo com erro no processamento
      systemPrompt = request.systemPrompt || `Você é um especialista em roteiros para ${request.topic}`;
      userPrompt = request.userPrompt || `Crie um roteiro sobre: ${request.topic}`;
      equipmentDetails = [];
    }
    
    // Call OpenAI API with enhanced prompts and equipment validation
    console.log("🤖 Chamando OpenAI API com validação de equipamentos...");
    const content = await enhancedHandler.callOpenAI(systemPrompt, userPrompt, equipmentDetails);
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
