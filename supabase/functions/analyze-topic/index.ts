
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error("OpenAI API Key is missing from environment variables");
    }

    const { topic } = await req.json();
    
    if (!topic) {
      throw new Error("Topic is required");
    }

    console.log("Analyzing topic:", topic);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI specialized in analyzing aesthetic medicine topics. Extract structured information that can be used to create a medical video script. Output must be valid JSON only."
          },
          {
            role: "user",
            content: `Analyze the following topic and extract key information useful for creating a medical video script: "${topic}". 
            Return a JSON object with these fields:
            - topic: the main subject (keep it close to original but improve if needed)
            - equipment: any equipment mentioned or most likely to be used (adella, enygma, focuskin, hipro, hive, crystal, multi, reverso, supreme, ultralift, unyque, xtonus)
            - bodyArea: primary body area affected (face, pescoco, abdomen, coxas, gluteos, bracos, corpotodo)
            - purpose: primary treatment purpose (rugas, emagrecimento, tonificacao, hidratacao, flacidez, gordura, lipedema, sarcopenia)
            - marketingObjective: the likely marketing objective (educate, engage, convert)
            - additionalInfo: any other relevant insights or angle to emphasize
            
            Output only valid JSON.`
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API returned error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse the JSON response from the AI
    let analysisData;
    try {
      analysisData = JSON.parse(analysisText);
      console.log("Successfully analyzed topic:", analysisData);
    } catch (parseError) {
      console.error("Failed to parse AI response:", analysisText);
      throw new Error("Failed to parse AI analysis result");
    }

    // Return the analysis result
    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-topic function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
