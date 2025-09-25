import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();

    if (!content || !title) {
      throw new Error('Conteúdo e título são obrigatórios para gerar o resumo');
    }

    console.log('🤖 [Generate Summary] Iniciando geração de resumo para:', title);

    if (!openAIApiKey) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    const prompt = `
    Como especialista em artigos científicos, gere um resumo/abstract profissional e conciso em português para o seguinte artigo:

    TÍTULO: ${title}

    CONTEÚDO: ${content}

    INSTRUÇÕES:
    - Crie um resumo científico de 100-200 palavras
    - Inclua objetivos, metodologia (se disponível), resultados principais e conclusões
    - Use linguagem técnica apropriada para artigos científicos
    - Mantenha o foco nos aspectos mais relevantes do estudo
    - Evite repetir o título no resumo
    - Use terceira pessoa e voz ativa quando possível
    
    IMPORTANTE: Responda APENAS com o resumo, sem explicações adicionais ou formatação especial.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em redação científica e resumos acadêmicos. Gere apenas o resumo solicitado, sem comentários adicionais.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [Generate Summary] Erro na API OpenAI:', errorData);
      throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    const generatedSummary = data.choices[0].message.content.trim();

    console.log('✅ [Generate Summary] Resumo gerado com sucesso');

    return new Response(
      JSON.stringify({ 
        summary: generatedSummary,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ [Generate Summary] Erro:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});