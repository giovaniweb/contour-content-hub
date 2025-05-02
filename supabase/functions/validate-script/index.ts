
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
    
    // Determinar parâmetros específicos de avaliação com base no tipo de conteúdo - simplificados
    let avaliacaoEspecifica = "";
    if (type === 'videoScript') {
      avaliacaoEspecifica = `Para roteiros de vídeo, considere a introdução, ritmo e instruções visuais.`;
    } else if (type === 'bigIdea') {
      avaliacaoEspecifica = `Para ideias criativas, considere originalidade e potencial de engajamento.`;
    } else if (type === 'dailySales') {
      avaliacaoEspecifica = `Para conteúdo de vendas, considere urgência, benefícios e CTA.`;
    }

    // Criar prompt simplificado para análise mais rápida
    const systemPrompt = `
      Você é um avaliador especialista em marketing digital.
      Avalie o roteiro fornecido de forma concisa e objetiva, dividindo-o em blocos principais.
      IMPORTANTE: Responda APENAS em formato JSON válido conforme especificado abaixo.
      
      Para cada bloco, identifique:
      1. O texto do bloco
      2. Pontuação de 0 a 10
      3. Sugestão de melhoria se necessário
      4. Se deve ser substituído
      
      Formato JSON esperado simplificado:
      {
        "blocos": [
          {
            "tipo": "gancho/conflito/virada/cta",
            "nota": 7.5,
            "texto": "Trecho do roteiro",
            "sugestao": "Sugestão de melhoria",
            "substituir": true/false
          }
        ],
        "nota_geral": 7.3,
        "sugestoes_gerais": ["Sugestão 1", "Sugestão 2"],
        "gancho": 7.2,
        "clareza": 7.5,
        "cta": 6.0,
        "emocao": 8.0,
        "total": 7.3,
        "sugestoes": "Sugestões resumidas"
      }
      
      ${avaliacaoEspecifica}
      
      Seja breve e direto. Limite a no máximo 4 blocos e 3 sugestões gerais para melhor performance.
    `;

    const userPrompt = `
      ID: ${scriptId}
      Título: ${title}
      Tipo: ${type}
      
      Conteúdo:
      ${truncatedContent}
      
      Avalie este roteiro segundo os critérios estabelecidos.
    `;

    console.log("Enviando requisição para OpenAI");
    
    // Usar modelo mais leve e rápido quando possível
    const modelToUse = truncatedContent.length < 2000 ? "gpt-4o-mini" : "gpt-4o";
    
    // Call OpenAI API com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
    
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
          temperature: 0.2, // Temperatura mais baixa para respostas mais rápidas e consistentes
          response_format: { type: "json_object" }, // Forçar formato JSON na resposta
          max_tokens: 2000 // Limitar resposta para ser mais rápida
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
        
        // Parse diretamente sem extrair de blocos de código (formato já é JSON)
        const validationData = JSON.parse(content);
        
        // Verificação de segurança nos dados - simplificada
        const safeValidation = {
          blocos: Array.isArray(validationData.blocos) ? validationData.blocos.slice(0, 6) : [], // Limitar a 6 blocos
          nota_geral: parseFloat(validationData.nota_geral) || 0,
          sugestoes_gerais: Array.isArray(validationData.sugestoes_gerais) 
            ? validationData.sugestoes_gerais.slice(0, 3) // Limitar a 3 sugestões
            : ["Nenhuma sugestão fornecida."],
            
          // Campos antigos para compatibilidade
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
        
        // Resposta de fallback mais leve
        const fallbackData = {
          blocos: [
            {
              tipo: "gancho",
              nota: 5.0,
              texto: truncatedContent.substring(0, 100),
              sugestao: "Recomendamos revisar o gancho inicial.",
              substituir: false
            },
            {
              tipo: "cta",
              nota: 5.0,
              texto: truncatedContent.substring(truncatedContent.length - 100),
              sugestao: "Fortaleça o CTA.",
              substituir: false
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
          JSON.stringify({ error: "Timeout na validação. Tente novamente com um texto mais curto." }), 
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error("Erro na chamada à API OpenAI:", fetchError);
      return new Response(
        JSON.stringify({ error: `Erro ao conectar com API OpenAI: ${fetchError.message}` }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Erro na função validate-script:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
