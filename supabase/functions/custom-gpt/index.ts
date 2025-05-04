import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompt base personalizado do usuário com regras de segurança aprimoradas
const basePrompt = `Você é um roteirista criativo e estrategista digital especializado em vídeos curtos para redes sociais (Reels e Stories), com foco em estética, saúde e tecnologia.

Sua missão é criar conteúdos com base nas seguintes metodologias:

🎯 1. Estratégia de Conteúdo (Venda Todo Santo Dia com nomes intuitivos):

- 🟡 Atrair Atenção – chamar novos olhares com curiosidade e impacto
- 🟢 Criar Conexão – gerar identificação e empatia
- 🔴 Fazer Comprar – incentivar ações e conversões
- 🔁 Reativar Interesse – trazer de volta quem já viu algo
- ✅ Fechar Agora – dar o empurrão final para quem está pronto

🎞️ 2. Estrutura de Roteiro (modelo Disney):

- (Identificação) – Um ponto em comum com o público
- (Conflito) – Algo que incomoda, trava ou preocupa
- (Virada) – A solução revelada com emoção
- (Final marcante) – Uma frase forte ou reflexiva que fecha com impacto

📦 TIPOS DE SAÍDA PERMITIDOS:

1. BIG IDEA
🧠 Big Idea: "Frase provocativa ou emocional que ativa desejo ou verdade incômoda"
📊 Tipo de Conteúdo: 🟡 / 🔴 / etc.
📝 Por que ela funciona: Explicação curta e estratégica
🎯 Gancho sugerido: Frase curta que pode abrir um Reels ou Story

2. ROTEIRO
Formato de saída:
Roteiro [número]
Tipo de Conteúdo: 🟡/🟢/🔴/🔁/✅
🎯 Objetivo: …
🧠 Título/Gancho: "..."
🎬 Roteiro com estrutura Disney:
(Identificação)
(Conflito)
(Virada)
(Final marcante)
📱 Ideal para: Reels / Stories / Ambos
🗣 Tom de linguagem: respeite o estilo indicado no cadastro do equipamento

3. STORIES 10x
Formato de saída:
1. Ideia de Story: "Frase curta que prende atenção"
📹 Como gravar: Explicação prática (ex: selfie direto, mostrar print, bastidor etc.)

⚙️ INSTRUÇÕES INTERNAS PARA GARANTIR PRECISÃO:
- SEMPRE consulte APENAS os dados do equipamento fornecidos no prompt
- NUNCA invente tecnologias, recursos, funcionalidades, indicações ou benefícios que não estejam explicitamente listados nos dados do equipamento
- MANTENHA clara separação entre: a tecnologia (o que o equipamento é), as indicações (para que problemas serve) e os benefícios (que resultados proporciona)
- Certifique-se que seu roteiro é 100% compatível com as informações do equipamento
- Use EXATAMENTE o tom de linguagem indicado no cadastro do equipamento
- Os roteiros devem soar como falas naturais e humanas
- Roteiros: até 40 segundos
- Big Ideas: impactantes e estratégicas
- Stories 10x: com instruções práticas

🚫 RESTRIÇÕES IMPORTANTES:
- Nunca use a palavra "criofrequência" em nenhum roteiro, título, Big Idea ou Story, independentemente do equipamento.
- Nunca atribua benefícios ou resultados a um equipamento quando estes não estiverem explicitamente listados em seus dados.
- Nunca sugira resultados ou promessas que não estejam claramente descritos nos benefícios do equipamento.
- Nunca sugira que um equipamento trata condições que não estejam explicitamente listadas nas indicações.

LEMBRE-SE: Sua credibilidade depende da precisão técnica. Foque apenas nas informações fornecidas, sem extrapolação ou invenção.`;

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

    console.log("Edge function de GPT personalizado iniciada");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extrair parâmetros da requisição
    const { 
      tipo, // 'bigIdea', 'roteiro', 'stories'
      equipamento, // Nome do equipamento
      quantidade = 1, // Quantidade de roteiros (default: 1)
      tom, // Tom desejado
      estrategiaConteudo, // 🟡 Atrair Atenção, 🟢 Criar Conexão, etc.
      equipamentoData, // Dados do equipamento selecionado
      // Parâmetros adicionais do modo avançado
      topic,
      bodyArea,
      purposes,
      additionalInfo,
      marketingObjective
    } = requestData;
    
    if (!tipo || !equipamento) {
      return new Response(
        JSON.stringify({ error: 'Tipo e equipamento são obrigatórios' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se temos os dados do equipamento
    if (!equipamentoData) {
      return new Response(
        JSON.stringify({ error: 'Dados do equipamento não fornecidos' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construir prompt específico baseado nos parâmetros com instruções de segurança
    let userPrompt = '';
    
    userPrompt += `[DADOS DO EQUIPAMENTO - USE APENAS ESTAS INFORMAÇÕES]:\n`;
    userPrompt += `Nome: ${equipamentoData.nome}\n`;
    userPrompt += `Tecnologia: ${equipamentoData.tecnologia}\n`;
    userPrompt += `Indicações: ${equipamentoData.indicacoes}\n`;
    userPrompt += `Benefícios: ${equipamentoData.beneficios}\n`;
    userPrompt += `Diferenciais: ${equipamentoData.diferenciais}\n`;
    userPrompt += `Linguagem recomendada: ${equipamentoData.linguagem}\n\n`;
    
    userPrompt += `[INSTRUÇÕES DE SEGURANÇA]:\n`;
    userPrompt += `- Use APENAS as informações acima. NÃO adicione, invente ou extrapole dados.\n`;
    userPrompt += `- NÃO misture tecnologia com indicações ou benefícios.\n`;
    userPrompt += `- Mantenha-se fiel aos dados do equipamento, sem "alucinações" ou confabulações.\n\n`;
    
    userPrompt += `Tipo de conteúdo solicitado: ${tipo}\n`;
    
    // Adicionar parâmetros básicos do modo simples
    if (tipo === 'roteiro') {
      userPrompt += `Quantidade de roteiros: ${quantidade}\n`;
      userPrompt += `Tom desejado: ${tom || 'Use o tom indicado no cadastro do equipamento'}\n`;
      
      if (estrategiaConteudo) {
        userPrompt += `Estratégia de conteúdo: ${estrategiaConteudo}\n`;
        
        // Adicionar contextos específicos para cada objetivo
        if (estrategiaConteudo === '🟡 Atrair Atenção') {
          userPrompt += `Contexto do objetivo: Criar curiosidade, interromper o scroll, gerar clique\n`;
        } else if (estrategiaConteudo === '🟢 Criar Conexão') {
          userPrompt += `Contexto do objetivo: Gerar empatia, identificação, mostrar "por que você"\n`;
        } else if (estrategiaConteudo === '🔴 Fazer Comprar') {
          userPrompt += `Contexto do objetivo: Destacar valor, diferencial, benefício, quebrar objeções\n`;
        } else if (estrategiaConteudo === '🔁 Reativar Interesse') {
          userPrompt += `Contexto do objetivo: Resgatar contatos frios, leads antigos, pacientes inativos\n`;
        } else if (estrategiaConteudo === '✅ Fechar Agora') {
          userPrompt += `Contexto do objetivo: Ação imediata, urgência, chamada para conversão direta\n`;
        }
      }
    } else if (tipo === 'bigIdea') {
      if (estrategiaConteudo) {
        userPrompt += `Estratégia de conteúdo: ${estrategiaConteudo}\n`;
        
        // Adicionar contextos específicos para cada objetivo
        if (estrategiaConteudo === '🟡 Atrair Atenção') {
          userPrompt += `Contexto do objetivo: Criar curiosidade, interromper o scroll, gerar clique\n`;
        } else if (estrategiaConteudo === '🟢 Criar Conexão') {
          userPrompt += `Contexto do objetivo: Gerar empatia, identificação, mostrar "por que você"\n`;
        } else if (estrategiaConteudo === '🔴 Fazer Comprar') {
          userPrompt += `Contexto do objetivo: Destacar valor, diferencial, benefício, quebrar objeções\n`;
        } else if (estrategiaConteudo === '🔁 Reativar Interesse') {
          userPrompt += `Contexto do objetivo: Resgatar contatos frios, leads antigos, pacientes inativos\n`;
        } else if (estrategiaConteudo === '✅ Fechar Agora') {
          userPrompt += `Contexto do objetivo: Ação imediata, urgência, chamada para conversão direta\n`;
        }
      }
    } else if (tipo === 'stories') {
      userPrompt += `Tom desejado: ${tom || 'Use o tom indicado no cadastro do equipamento'}\n`;
      userPrompt += `Gere ${quantidade || 10} ideias para stories\n`;
    }
    
    // Adicionar parâmetros avançados
    if (topic) {
      userPrompt += `Tema/Assunto principal: ${topic}\n`;
    }
    
    if (bodyArea) {
      userPrompt += `Área do corpo a focar: ${bodyArea}\n`;
    }
    
    if (purposes && purposes.length > 0) {
      userPrompt += `Finalidades do tratamento: ${purposes.join(', ')}\n`;
    }
    
    if (additionalInfo) {
      userPrompt += `Informações adicionais: ${additionalInfo}\n`;
    }
    
    if (marketingObjective) {
      userPrompt += `Objetivo de marketing: ${marketingObjective}\n`;
      
      // Adicionar contextos específicos para cada objetivo
      if (marketingObjective === '🟡 Atrair Atenção') {
        userPrompt += `Contexto do objetivo: Criar curiosidade, interromper o scroll, gerar clique\n`;
      } else if (marketingObjective === '🟢 Criar Conexão') {
        userPrompt += `Contexto do objetivo: Gerar empatia, identificação, mostrar "por que você"\n`;
      } else if (marketingObjective === '🔴 Fazer Comprar') {
        userPrompt += `Contexto do objetivo: Destacar valor, diferencial, benefício, quebrar objeções\n`;
      } else if (marketingObjective === '🔁 Reativar Interesse') {
        userPrompt += `Contexto do objetivo: Resgatar contatos frios, leads antigos, pacientes inativos\n`;
      } else if (marketingObjective === '✅ Fechar Agora') {
        userPrompt += `Contexto do objetivo: Ação imediata, urgência, chamada para conversão direta\n`;
      }
    }
    
    // Aqui definimos qual tipo específico de saída queremos
    userPrompt += `\nPor favor, crie ${tipo === 'roteiro' ? quantidade : tipo === 'stories' ? (quantidade || 10) : 1} ${tipo}(s) para o equipamento ${equipamento} seguindo rigorosamente o formato especificado.`;
    
    userPrompt += `\n\n[IMPORTANTE]: Verifique se todo o conteúdo que você gerou está baseado EXCLUSIVAMENTE nos dados do equipamento fornecidos. Não mencione benefícios, tecnologias ou indicações não listados explicitamente.`;

    console.log("Enviando requisição para OpenAI com prompt aprimorado");
    
    // Chamar OpenAI API com temperatura reduzida para maior precisão factual
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o", // Modelo mais avançado para melhor qualidade
        messages: [
          { role: "system", content: basePrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5 // Temperatura reduzida para maior precisão factual
      })
    });

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
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Resposta gerada com sucesso");
    
    return new Response(JSON.stringify({ 
      content, 
      tipo, 
      equipamento,
      promptUtilizado: userPrompt // Incluindo o prompt utilizado para referência
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função custom-gpt:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
