
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
      throw new Error("OPENAI_API_KEY não está configurada");
    }

    const { issue } = await req.json();
    
    if (!issue || !issue.component || !issue.description || !issue.severity) {
      return new Response(
        JSON.stringify({ error: "Dados do problema incompletos" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analisando problema:", issue.component, "- Severidade:", issue.severity);

    // Construir o prompt para a OpenAI
    const systemPrompt = `Você é um especialista em diagnóstico e reparo de sistemas de software.
Sua tarefa é analisar problemas técnicos e fornecer:
1. Um diagnóstico preciso
2. Uma solução técnica específica
3. Passos de implementação detalhados
4. Uma estimativa de complexidade (baixa, média, alta)
5. Se o problema pode ser resolvido automaticamente ou requer intervenção manual`;

    const userPrompt = `Analisar o seguinte problema técnico:
Componente: ${issue.component}
Descrição: ${issue.description}
Severidade: ${issue.severity}
Categoria: ${issue.category || "Não especificada"}

Forneça uma análise detalhada seguindo o formato abaixo:
--- DIAGNÓSTICO ---
[Sua análise técnica do problema]

--- SOLUÇÃO ---
[Solução técnica detalhada]

--- PASSOS DE IMPLEMENTAÇÃO ---
[Lista numerada de ações técnicas necessárias]

--- COMPLEXIDADE ---
[baixa/média/alta]

--- AUTO-REPARO POSSÍVEL ---
[sim/não]
[Se sim, explique como poderia ser automatizado]

Responda de maneira técnica e direta, como se estivesse escrevendo para um desenvolvedor experiente.`;

    // Chamar a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Extrair informações estruturadas
    const sections = {
      diagnóstico: "",
      solução: "",
      passos: "",
      complexidade: "média",
      autoReparo: false
    };
    
    const diagMatch = analysis.match(/---\s*DIAGNÓSTICO\s*---(.*?)(?=---\s*\w)/s);
    const solMatch = analysis.match(/---\s*SOLUÇÃO\s*---(.*?)(?=---\s*\w)/s);
    const passosMatch = analysis.match(/---\s*PASSOS DE IMPLEMENTAÇÃO\s*---(.*?)(?=---\s*\w)/s);
    const complexMatch = analysis.match(/---\s*COMPLEXIDADE\s*---(.*?)(?=---\s*\w|$)/s);
    const autoMatch = analysis.match(/---\s*AUTO-REPARO POSSÍVEL\s*---(.*?)(?=$)/s);
    
    if (diagMatch) sections.diagnóstico = diagMatch[1].trim();
    if (solMatch) sections.solução = solMatch[1].trim();
    if (passosMatch) sections.passos = passosMatch[1].trim();
    if (complexMatch) {
      const complexText = complexMatch[1].toLowerCase();
      if (complexText.includes("baixa")) sections.complexidade = "baixa";
      if (complexText.includes("alta")) sections.complexidade = "alta";
    }
    if (autoMatch) {
      sections.autoReparo = autoMatch[1].toLowerCase().includes("sim");
    }

    // Log de uso para monitoramento
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    try {
      await supabaseAdmin.from('logs_uso').insert({
        acao: 'system_auto_repair',
        detalhe: `Análise de problema: ${issue.component} - ${issue.description}`,
        usuario_id: null // Idealmente seria o ID do usuário da requisição
      });
    } catch (logError) {
      console.error("Erro ao registrar uso:", logError);
      // Continuar mesmo que o log falhe
    }

    // Retornar a análise
    return new Response(
      JSON.stringify({ 
        analysis: sections,
        rawAnalysis: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
