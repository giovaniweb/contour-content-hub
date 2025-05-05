
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY não encontrado");
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não encontrado' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Edge function de validação iniciada");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify({
        title: requestData.title,
        type: requestData.type,
        scriptId: requestData.scriptId,
        contentLength: requestData.content?.length || 0
      }));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { content, type, title, scriptId } = requestData;
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Conteúdo é obrigatório' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limitar tamanho do conteúdo para processamento mais rápido
    const MAX_CONTENT_LENGTH = 4000;
    const truncatedContent = content.length > MAX_CONTENT_LENGTH 
      ? content.substring(0, MAX_CONTENT_LENGTH) + "\n[Conteúdo truncado para otimização]" 
      : content;
    
    // Determinar o modelo com base no tamanho do conteúdo - usar modelo mais leve para textos menores
    const contentLength = truncatedContent.length;
    let modelToUse = "gpt-4o-mini";
    
    if (contentLength > 2000) {
      console.log(`Conteúdo grande (${contentLength} caracteres), usando modelo completo`);
      modelToUse = "gpt-4o";
    } else {
      console.log(`Conteúdo pequeno (${contentLength} caracteres), usando modelo leve`);
    }
    
    // Para textos muito pequenos, retornar uma resposta mais rápida
    if (contentLength < 20) {
      console.log("Conteúdo muito curto para análise completa, retornando resposta simplificada");
      return new Response(JSON.stringify({
        blocos: [],
        nota_geral: 5.0,
        sugestoes_gerais: ["O texto é muito curto para uma análise detalhada. Recomendamos expandir o conteúdo."],
        gancho: 5.0,
        clareza: 5.0,
        cta: 5.0,
        emocao: 5.0,
        total: 5.0,
        sugestoes: "O texto é muito curto para uma análise completa. Por favor, desenvolva mais o seu roteiro para obter uma avaliação adequada."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Determinar parâmetros específicos de avaliação com base no tipo de conteúdo
    let avaliacaoEspecifica = "";
    if (type === 'videoScript') {
      avaliacaoEspecifica = `Para roteiros de vídeo, considere a introdução, ritmo e instruções visuais.`;
    } else if (type === 'bigIdea') {
      avaliacaoEspecifica = `Para ideias criativas, considere originalidade e potencial de engajamento.`;
    } else if (type === 'dailySales') {
      avaliacaoEspecifica = `Para conteúdo de vendas, considere urgência, benefícios e CTA.`;
    }

    // Criar prompt para análise rápida
    const systemPrompt = `
      Você é um avaliador especialista em marketing digital e copywriting.
      Avalie o roteiro fornecido de forma concisa e objetiva.
      IMPORTANTE: Responda APENAS em formato JSON válido conforme especificado abaixo.
      
      Formato JSON esperado:
      {
        "blocos": [
          {
            "tipo": "gancho/conflito/virada/cta",
            "nota": número de 0 a 10,
            "texto": "Trecho do roteiro",
            "sugestao": "Sugestão de melhoria"
          }
        ],
        "nota_geral": número de 0 a 10,
        "sugestoes_gerais": ["Sugestão 1", "Sugestão 2"],
        "gancho": número de 0 a 10,
        "clareza": número de 0 a 10,
        "cta": número de 0 a 10,
        "emocao": número de 0 a 10,
        "total": número de 0 a 10,
        "sugestoes": "Resumo das sugestões"
      }
      
      ${avaliacaoEspecifica}
      
      Seja breve e direto. Para melhor performance, limite a no máximo 3 blocos e 3 sugestões gerais.
    `;

    const userPrompt = `
      ID: ${scriptId || 'novo-roteiro'}
      Título: ${title || 'Sem título'}
      Tipo: ${type || 'roteiro'}
      
      Conteúdo:
      ${truncatedContent}
      
      Avalie este roteiro segundo os critérios estabelecidos. Seja rápido e conciso.
    `;

    console.log(`Enviando requisição para OpenAI usando modelo ${modelToUse}`);
    
    // Call OpenAI API com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 segundos de timeout
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.1, // Temperatura mais baixa para respostas mais rápidas e consistentes
          response_format: { type: "json_object" }, // Forçar formato JSON na resposta
          max_tokens: 1200 // Limitar resposta para ser mais rápida
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Get response from OpenAI
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta OpenAI: Status ${response.status}`);
        return new Response(
          JSON.stringify({ 
            error: `Erro na API OpenAI: Status ${response.status}`,
          }), 
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      let data;
      try {
        data = await response.json();
        console.log("Resposta recebida com sucesso da OpenAI");
      } catch (parseError) {
        console.error("Erro ao processar resposta da OpenAI");
        return new Response(
          JSON.stringify({ error: "Resposta inválida da API OpenAI" }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      try {
        const content = data.choices[0].message.content;
        console.log("Processando resposta e convertendo para JSON");
        
        // Parse diretamente (formato já é JSON)
        const validationData = JSON.parse(content);
        
        // Verificação de segurança nos dados
        const safeValidation = {
          blocos: Array.isArray(validationData.blocos) ? validationData.blocos.slice(0, 6) : [], // Limitar a 6 blocos
          nota_geral: parseFloat(validationData.nota_geral) || 0,
          sugestoes_gerais: Array.isArray(validationData.sugestoes_gerais) 
            ? validationData.sugestoes_gerais.slice(0, 3) // Limitar a 3 sugestões
            : ["Nenhuma sugestão fornecida."],
            
          // Campos para compatibilidade
          gancho: parseFloat(validationData.gancho) || 0,
          clareza: parseFloat(validationData.clareza) || 0,
          cta: parseFloat(validationData.cta) || 0,
          emocao: parseFloat(validationData.emocao) || 0,
          total: parseFloat(validationData.total || validationData.nota_geral) || 0,
          sugestoes: validationData.sugestoes || 
            (Array.isArray(validationData.sugestoes_gerais) ? validationData.sugestoes_gerais.join("\n") : "")
        };
        
        console.log("Validação concluída com sucesso");
        
        return new Response(JSON.stringify(safeValidation), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (jsonError) {
        console.error("Erro ao processar resposta:", jsonError);
        
        // Resposta de fallback
        const fallbackData = {
          blocos: [
            {
              tipo: "análise",
              nota: 5.0,
              texto: truncatedContent.substring(0, 100) + "...",
              sugestao: "Não foi possível analisar em detalhes. Recomendamos revisar o texto."
            }
          ],
          nota_geral: 5.0,
          sugestoes_gerais: ["Não foi possível analisar em detalhes. Recomendamos revisar o texto."],
          gancho: 5.0,
          clareza: 5.0,
          cta: 5.0,
          emocao: 5.0,
          total: 5.0,
          sugestoes: "Não foi possível analisar em detalhes. Recomendamos revisar o texto."
        };
        
        return new Response(JSON.stringify(fallbackData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Se for um erro de timeout, retornar uma resposta de erro específica
      if (fetchError.name === 'AbortError') {
        console.error("Timeout na chamada à API OpenAI");
        return new Response(
          JSON.stringify({ 
            error: "Timeout na validação. Tente novamente com um texto mais curto.",
            blocos: [],
            nota_geral: 5.0,
            sugestoes_gerais: ["A análise foi interrompida por exceder o tempo limite. Tente um texto mais curto."],
            gancho: 5.0,
            clareza: 5.0,
            cta: 5.0,
            emocao: 5.0,
            total: 5.0,
            sugestoes: "A análise foi interrompida por exceder o tempo limite. Tente um texto mais curto."
          }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error("Erro na chamada à API OpenAI:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: `Erro ao conectar com API OpenAI: ${fetchError.message}`,
          blocos: [],
          nota_geral: 5.0,
          sugestoes_gerais: ["Ocorreu um erro durante a análise. Tente novamente mais tarde."],
          gancho: 5.0,
          clareza: 5.0,
          cta: 5.0,
          emocao: 5.0,
          total: 5.0,
          sugestoes: "Ocorreu um erro durante a análise. Tente novamente mais tarde."
        }), 
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Erro na função validate-script:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      blocos: [],
      nota_geral: 5.0,
      sugestoes_gerais: ["Ocorreu um erro durante a análise. Tente novamente mais tarde."],
      gancho: 5.0,
      clareza: 5.0,
      cta: 5.0,
      emocao: 5.0,
      total: 5.0,
      sugestoes: "Ocorreu um erro durante a análise. Tente novamente mais tarde."
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
