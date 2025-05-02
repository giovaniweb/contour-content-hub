
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
      `;
    } else if (type === 'bigIdea') {
      avaliacaoEspecifica = `
        Para ideias criativas, considere especialmente:
        - A ideia é verdadeiramente inovadora e diferenciada?
        - Há um ângulo único que a destaca?
        - A proposta é viável e bem desenvolvida?
      `;
    } else if (type === 'dailySales') {
      avaliacaoEspecifica = `
        Para conteúdo de vendas, considere especialmente:
        - O texto desperta urgência?
        - O problema e solução estão claramente articulados?
        - O CTA é forte e direto?
      `;
    }

    // Criar prompt para análise do roteiro
    const systemPrompt = `
      Você é um especialista em marketing digital com mais de 10 anos de experiência em copywriting para mídias sociais.
      Sua tarefa é avaliar o roteiro fornecido e atribuir pontuações de 0 a 10 para os seguintes critérios:
      
      1. Gancho: O roteiro possui um gancho de abertura atraente e cativante que captura atenção imediatamente?
      2. Clareza: A mensagem é clara, objetiva e fácil de entender pelo público-alvo?
      3. CTA (Call-to-Action): Existe um chamado à ação efetivo que direciona claramente o público para o próximo passo?
      4. Emoção/Conexão: O roteiro estabelece conexão emocional com o público e apela para suas necessidades/desejos?
      
      ${avaliacaoEspecifica}
      
      Além das pontuações, forneça sugestões específicas e acionáveis para melhorar o roteiro, detalhando até 3 pontos principais que poderiam ser otimizados, com exemplos práticos.
      
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
      
      Por favor, avalie este roteiro segundo os critérios estabelecidos.
    `;

    console.log("Enviando requisição para OpenAI");
    
    // Call OpenAI API
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          temperature: 0.5
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
      
      // Extrair JSON mesmo se estiver dentro de blocos de código markdown
      let jsonContent = content;
      
      // Remover blocos de código markdown se presentes
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1].trim();
      }
      
      // Tentar parsear o JSON da resposta
      const validationData = JSON.parse(jsonContent);
      
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
