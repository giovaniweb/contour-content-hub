
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from './constants.ts';
import { CustomGptRequest } from './types.ts';
import { buildPrompt } from './prompt-builder.ts';
import { callOpenAI } from './openai-service.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Custom GPT Edge Function started");
    
    // Parse request
    let requestData: CustomGptRequest;
    try {
      requestData = await req.json();
      console.log("Request data received:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Error processing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate request parameters
    const { tipo, equipamento, equipamentoData } = requestData;
    
    if (!tipo || !equipamento) {
      return new Response(
        JSON.stringify({ error: 'Type and equipment are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we have equipment data
    if (!equipamentoData) {
      return new Response(
        JSON.stringify({ error: 'Equipment data not provided' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Rate limiting usando função check_rate_limit
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || 'anonymous';
    const { data: rateData, error: rateError } = await supabaseAdmin.rpc('check_rate_limit', {
      p_identifier: ip,
      p_endpoint: 'custom-gpt',
      p_max_requests: 30,
      p_window_minutes: 1
    });
    if (rateError) {
      console.error('Rate limit check error:', rateError);
    } else if (rateData && rateData.allowed === false) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded', ...rateData }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build prompt for OpenAI
    const userPrompt = buildPrompt(requestData);
    console.log("Sending request to OpenAI with enhanced prompt");
    
    // Call OpenAI and get the response
    const content = await callOpenAI(userPrompt);
    console.log("Response generated successfully");
    
    // Return the generated content
    return new Response(JSON.stringify({ 
      content, 
      tipo, 
      equipamento,
      promptUtilizado: userPrompt // Including the prompt used for reference
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in custom-gpt function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
