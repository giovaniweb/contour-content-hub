
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

    // Criar prompt aprimorado para análise do roteiro no formato solicitado
    const systemPrompt = `
      Você é um avaliador especialista em marketing digital com mais de 15 anos de experiência em copywriting para mídias sociais, com expertise específica em roteiros altamente persuasivos e engajantes.
      
      Sua tarefa é fazer uma análise detalhada do roteiro fornecido, dividi-lo em blocos (gancho, conflito, virada, CTA) e avaliar cada parte individualmente.
      
      IMPORTANTE: Você DEVE responder apenas em formato JSON válido conforme especificado abaixo, sem qualquer explicação adicional ou texto fora do objeto JSON.
      
      Para cada bloco, identifique:
      1. O texto exato do bloco no roteiro (pegue os parágrafos correspondentes)
      2. Pontuação de 0 a 10 (com uma casa decimal)
      3. Sugestão de melhoria se a nota for abaixo de 7
      4. Se o bloco deve ser substituído (true/false)
      
      Além disso, forneça:
      - Uma pontuação geral de 0 a 10 (com uma casa decimal)
      - 3 a 5 sugestões gerais para melhorar o roteiro
      
      Formato JSON esperado:
      {
        "blocos": [
          {
            "tipo": "gancho",
            "nota": 7.2,
            "texto": "Trecho exato do gancho no roteiro",
            "sugestao": "Texto sugerido para substituição se nota < 7",
            "substituir": true/false
          },
          {
            "tipo": "conflito",
            "nota": 7.5,
            "texto": "Trecho exato do conflito no roteiro",
            "sugestao": null,
            "substituir": false
          },
          {
            "tipo": "virada",
            "nota": 8.6,
            "texto": "Trecho exato da virada no roteiro",
            "sugestao": null,
            "substituir": false
          },
          {
            "tipo": "cta",
            "nota": 6.0,
            "texto": "Trecho exato do CTA no roteiro",
            "sugestao": "Texto sugerido para o CTA",
            "substituir": true
          }
        ],
        "nota_geral": 7.3,
        "sugestoes_gerais": [
          "Sugestão 1",
          "Sugestão 2",
          "Sugestão 3"
        ],
        "gancho": 7.2,
        "clareza": 7.5,
        "cta": 6.0,
        "emocao": 8.0,
        "total": 7.3,
        "sugestoes": "Sugestão 1\\nSugestão 2\\nSugestão 3"
      }
      
      ${avaliacaoEspecifica}
      
      Estou fornecendo os campos gancho, clareza, cta, emocao, total e sugestoes para manter compatibilidade com o formato anterior.
    `;

    const userPrompt = `
      ID do roteiro: ${scriptId}
      Título do roteiro: ${title}
      Tipo de roteiro: ${type}
      
      Conteúdo:
      ${content}
      
      Por favor, avalie este roteiro segundo os critérios estabelecidos com máxima precisão e rigor.
      Divida o roteiro em blocos (gancho, conflito, virada, CTA) e avalie cada parte individualmente.
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
        blocos: validationData.blocos || [],
        nota_geral: parseFloat(validationData.nota_geral) || 0,
        sugestoes_gerais: Array.isArray(validationData.sugestoes_gerais) 
          ? validationData.sugestoes_gerais 
          : ["Nenhuma sugestão fornecida."],
          
        // Campos antigos para compatibilidade
        gancho: parseFloat(validationData.gancho) || 0,
        clareza: parseFloat(validationData.clareza) || 0,
        cta: parseFloat(validationData.cta) || 0,
        emocao: parseFloat(validationData.emocao) || 0,
        total: parseFloat(validationData.total || validationData.nota_geral) || 0,
        sugestoes: validationData.sugestoes || validationData.sugestoes_gerais.join("\n")
      };
      
      // Garantir que os valores estejam entre 0 e 10
      const numericFields = ['gancho', 'clareza', 'cta', 'emocao', 'total', 'nota_geral'];
      for (const key of numericFields) {
        if (typeof safeValidation[key] === 'number') {
          if (safeValidation[key] < 0) safeValidation[key] = 0;
          if (safeValidation[key] > 10) safeValidation[key] = 10;
        }
      }
      
      // Verificar cada bloco
      if (Array.isArray(safeValidation.blocos)) {
        safeValidation.blocos.forEach(bloco => {
          if (typeof bloco.nota === 'number') {
            if (bloco.nota < 0) bloco.nota = 0;
            if (bloco.nota > 10) bloco.nota = 10;
          }
        });
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
          blocos: [
            {
              tipo: "gancho",
              nota: 5.0,
              texto: content.substring(0, 100),
              sugestao: "Recomendamos revisar o gancho inicial para torná-lo mais impactante.",
              substituir: false
            },
            {
              tipo: "cta",
              nota: 5.0,
              texto: content.substring(content.length - 100),
              sugestao: "Fortaleça o CTA tornando-o mais direto e persuasivo.",
              substituir: false
            }
          ],
          nota_geral: 5.0,
          sugestoes_gerais: [
            "Não foi possível extrair sugestões detalhadas devido a um erro de formato.",
            "Sugerimos revisar seu roteiro quanto à clareza, impacto do gancho inicial.",
            "Verifique a força da chamada à ação e a conexão emocional com o público."
          ],
          gancho: 5.0,
          clareza: 5.0,
          cta: 5.0,
          emocao: 5.0,
          total: 5.0,
          sugestoes: "Não foi possível extrair sugestões detalhadas devido a um erro de formato."
        };
        
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
