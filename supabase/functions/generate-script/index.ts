import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { RequestHandler } from "./request-handler.ts";
import { ErrorHandler } from "./error-handler.ts";
import { RequestValidator } from "./request-validator.ts";
import { saveScriptToDatabase, getUserFromToken } from "./database-operations.ts";

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
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      throw new Error("Formato de requisição inválido: não foi possível processar JSON");
    }
    
    const request = RequestValidator.validateRequest(requestData);
    const { type, topic, equipment, bodyArea, purpose, additionalInfo, tone, language, marketingObjective } = request;
    
    // Initialize request handler
    const requestHandler = new RequestHandler(openAIApiKey);
    
    // Process request and get prompts
    const { finalSystemPrompt, finalUserPrompt } = await requestHandler.processRequest(request);
    
    // Call OpenAI API
    const content = await requestHandler.callOpenAI(finalSystemPrompt, finalUserPrompt, type);
    
    // Format the response
    const scriptResponse = requestHandler.formatResponse(content, type, topic, equipment, bodyArea);

    // Save to database with enhanced metadata for FLUIDAROTEIRISTA
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
          // Extract metadata if JSON response
          let metadata = {};
          if (type === 'custom') {
            try {
              const parsed = JSON.parse(content);
              metadata = {
                formato: parsed.formato,
                emocao_central: parsed.emocao_central,
                intencao: parsed.intencao,
                mentor_usado: parsed.mentor,
                equipamento_principal: equipment
              };
            } catch {
              // Keep empty metadata if not JSON
            }
          }

          await saveScriptToDatabase(supabaseAdmin, {
            usuario_id: user.id,
            tipo: type === 'custom' ? 'fluidaroteirista' : type,
            titulo: scriptResponse.title,
            conteudo: content,
            status: 'gerado',
            objetivo_marketing: marketingObjective || null,
            ...metadata
          });
        }
      }
    } catch (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      // Continue even if db save fails
    }

    console.log("📤 Enviando resposta FLUIDAROTEIRISTA para o cliente");
    
    return new Response(JSON.stringify(scriptResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return ErrorHandler.handle(error, corsHeaders);
  }
});
