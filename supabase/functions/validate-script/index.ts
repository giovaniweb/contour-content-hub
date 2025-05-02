
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

    // Determinar parâmetros específicos de avaliação com base no tipo de conteúdo
    let avaliacaoEspecifica = "";
    if (type === 'videoScript') {
      avaliacaoEspecifica = `
        Para roteiros de vídeo, considere especialmente:
        - A introdução captura atenção nos primeiros 5 segundos?
        - O roteiro mantém um ritmo adequado para vídeo?
        - Há instruções claras para demonstrações visuais?
        - O script tem duração adequada para o público-alvo?
        - As transições entre ideias são fluidas e naturais?
      `;
    } else if (type === 'bigIdea') {
      avaliacaoEspecifica = `
        Para ideias criativas, considere especialmente:
        - A ideia é verdadeiramente inovadora e diferenciada?
        - Há um ângulo único que a destaca da concorrência?
        - A proposta é viável e bem desenvolvida?
        - O conceito tem potencial viral ou de engajamento?
        - A ideia resolve um problema real do público-alvo?
      `;
    } else if (type === 'dailySales') {
      avaliacaoEspecifica = `
        Para conteúdo de vendas, considere especialmente:
        - O texto desperta urgência e escassez?
        - O problema e solução estão claramente articulados?
        - O CTA é forte, direto e persuasivo?
        - Os benefícios são apresentados de forma convincente?
        - As objeções potenciais são antecipadas e respondidas?
      `;
    }

    // Criar prompt aprimorado para análise do roteiro
    const systemPrompt = `
      Você é um avaliador especialista em marketing digital com mais de 15 anos de experiência em copywriting para mídias sociais, com expertise específica em roteiros altamente persuasivos e engajantes.
      
      Sua tarefa é fazer uma análise crítica e detalhada do roteiro fornecido e atribuir pontuações precisas de 0 a 10 para os seguintes critérios:
      
      1. Gancho: O roteiro possui um gancho de abertura verdadeiramente cativante que captura atenção imediatamente e gera curiosidade para continuar assistindo/lendo? (0 = gancho fraco ou inexistente, 10 = gancho excepcionalmente poderoso que cria curiosidade irresistível)
      
      2. Clareza: A mensagem central é cristalina, bem articulada e facilmente compreensível pelo público-alvo? O fluxo de ideias é lógico e coerente? (0 = mensagem confusa ou desorganizada, 10 = mensagem extraordinariamente clara e estruturada)
      
      3. CTA (Call-to-Action): O chamado à ação é específico, motivador e estrategicamente posicionado? Ele direciona claramente o público para a ação desejada e cria senso de urgência? (0 = CTA ausente ou ineficaz, 10 = CTA extremamente persuasivo e impossível de ignorar)
      
      4. Emoção/Conexão: O roteiro estabelece uma conexão emocional autêntica com o público e apela para suas necessidades, desejos ou dores reais? Usa storytelling efetivo? (0 = conteúdo puramente informativo sem conexão emocional, 10 = conteúdo que gera resposta emocional profunda e memorável)
      
      ${avaliacaoEspecifica}
      
      Para cada critério, seja meticuloso e analítico em sua avaliação. Justifique brevemente cada pontuação atribuída.
      
      Além das pontuações, forneça 3 a 5 sugestões altamente específicas e acionáveis para melhorar o roteiro, detalhando exatamente o que poderia ser otimizado, com exemplos práticos de reescrita quando possível.
      
      Responda apenas em formato JSON válido com as seguintes propriedades, sem adição de markdown:
      {
        "gancho": número de 0 a 10 com uma casa decimal,
        "clareza": número de 0 a 10 com uma casa decimal,
        "cta": número de 0 a 10 com uma casa decimal,
        "emocao": número de 0 a 10 com uma casa decimal,
        "total": média ponderada das pontuações (número de 0 a 10 com uma casa decimal),
        "sugestoes": "Sugestões detalhadas para melhorar o roteiro"
      }
    `;

    const userPrompt = `
      ID do roteiro: ${scriptId}
      Título do roteiro: ${title}
      Tipo de roteiro: ${type}
      
      Conteúdo:
      ${content}
      
      Por favor, avalie este roteiro segundo os critérios estabelecidos com máxima precisão e rigor.
    `;

    console.log("Enviando requisição para OpenAI");
    
    // Call OpenAI API com modelo mais avançado
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o", // Modelo mais avançado para análise mais precisa
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.3, // Temperatura mais baixa para análises mais consistentes e precisas
          response_format: { type: "json_object" } // Forçar formato JSON na resposta
        })
      });
    } catch (fetchError) {
      console.error("Erro na chamada à API OpenAI:", fetchError);
      return new Response(
        JSON.stringify({ error: `Erro ao conectar com API OpenAI: ${fetchError.message}` }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get response from OpenAI
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na resposta OpenAI: Status ${response.status}, Resposta: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Erro na API OpenAI: Status ${response.status}`,
          details: errorText
        }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let data;
    try {
      data = await response.json();
      console.log("Resposta recebida com sucesso da OpenAI");
    } catch (parseError) {
      console.error("Erro ao processar resposta da OpenAI:", parseError);
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
      
      // Verificação de segurança nos dados
      const safeValidation = {
        gancho: parseFloat(validationData.gancho) || 0,
        clareza: parseFloat(validationData.clareza) || 0,
        cta: parseFloat(validationData.cta) || 0,
        emocao: parseFloat(validationData.emocao) || 0,
        total: parseFloat(validationData.total) || 0,
        sugestoes: String(validationData.sugestoes || "Nenhuma sugestão fornecida.")
      };
      
      // Garantir que os valores estejam entre 0 e 10
      for (const key of ['gancho', 'clareza', 'cta', 'emocao', 'total']) {
        if (safeValidation[key] < 0) safeValidation[key] = 0;
        if (safeValidation[key] > 10) safeValidation[key] = 10;
      }
      
      console.log("Validação concluída com sucesso:", safeValidation);
      
      return new Response(JSON.stringify(safeValidation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (jsonError) {
      console.error("Erro ao processar resposta:", jsonError);
      console.error("Conteúdo que causou o erro:", data.choices[0]?.message?.content);
      
      // Manipulação mais robusta de erro para tentar extrair informações úteis mesmo de respostas mal formatadas
      try {
        const content = data.choices[0].message.content;
        const fallbackData = {
          gancho: 5.0,
          clareza: 5.0,
          cta: 5.0,
          emocao: 5.0,
          total: 5.0,
          sugestoes: "Não foi possível extrair sugestões detalhadas devido a um erro de formato. " +
                     "Sugerimos revisar seu roteiro quanto à clareza, impacto do gancho inicial, " +
                     "força da chamada à ação e conexão emocional com o público."
        };
        
        // Tentar extrair números da resposta
        const ganchoMatch = content.match(/gancho["']?\s*:\s*(\d+\.?\d*)/i);
        const clarezaMatch = content.match(/clareza["']?\s*:\s*(\d+\.?\d*)/i);
        const ctaMatch = content.match(/cta["']?\s*:\s*(\d+\.?\d*)/i);
        const emocaoMatch = content.match(/emocao["']?\s*:\s*(\d+\.?\d*)/i);
        const totalMatch = content.match(/total["']?\s*:\s*(\d+\.?\d*)/i);
        
        if (ganchoMatch) fallbackData.gancho = parseFloat(ganchoMatch[1]);
        if (clarezaMatch) fallbackData.clareza = parseFloat(clarezaMatch[1]);
        if (ctaMatch) fallbackData.cta = parseFloat(ctaMatch[1]);
        if (emocaoMatch) fallbackData.emocao = parseFloat(emocaoMatch[1]);
        if (totalMatch) fallbackData.total = parseFloat(totalMatch[1]);
        
        // Tentar extrair sugestões
        const sugestoesMatch = content.match(/sugestoes["']?\s*:\s*["']([^"']+)["']/i);
        if (sugestoesMatch) {
          fallbackData.sugestoes = sugestoesMatch[1];
        } else {
          // Tentar extrair qualquer texto que pareça ser sugestões
          const textBlocks = content.split(/[.,\n]+/);
          const potentialSuggestions = textBlocks
            .filter(block => 
              block.toLowerCase().includes("sugest") || 
              block.toLowerCase().includes("melhor") ||
              block.toLowerCase().includes("ajust") ||
              block.toLowerCase().includes("consider")
            )
            .join(". ");
          
          if (potentialSuggestions.length > 20) {
            fallbackData.sugestoes = potentialSuggestions;
          }
        }
        
        console.log("Usando dados de fallback devido a erro de formato:", fallbackData);
        
        return new Response(JSON.stringify(fallbackData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (fallbackError) {
        console.error("Erro ao processar usando fallback:", fallbackError);
        return new Response(
          JSON.stringify({ 
            error: "Formato de resposta inválido da IA",
            rawResponse: data.choices[0]?.message?.content || "No content"
          }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error) {
    console.error('Erro na função validate-script:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
