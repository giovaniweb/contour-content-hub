
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Edge function generate-marketing-diagnostic iniciada');
  console.log('📝 Method:', req.method);
  console.log('🔑 OpenAI API Key configurada:', openAIApiKey ? 'SIM' : 'NÃO');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Recebendo dados do diagnóstico...');
    const diagnosticData = await req.json();
    console.log('📊 Dados recebidos:', JSON.stringify(diagnosticData, null, 2));

    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY não configurada',
        success: false,
        details: 'Configure a chave da OpenAI nas configurações do projeto'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = createConsultorFluidaPrompt(diagnosticData);
    console.log('📝 Prompt criado, tamanho:', prompt.length);

    console.log('🤖 Chamando OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e estéticas, com foco total em atrair, encantar e fidelizar o público final. Use linguagem emocional, acessível e inspiração prática.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 4000
      }),
    });

    console.log('📡 Resposta OpenAI status:', response.status);
    
    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ OpenAI error body:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Resposta OpenAI recebida');
    console.log('📊 Usage:', data.usage);
    
    const diagnosticResult = data.choices[0].message.content;
    console.log('📝 Diagnóstico gerado, tamanho:', diagnosticResult?.length || 0);

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💥 Error generating diagnostic:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao gerar diagnóstico com IA',
      success: false,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function createConsultorFluidaPrompt(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  
  // Identificar equipamentos mencionados
  let equipamentos = '';
  if (data.clinicType === 'clinica_medica') {
    equipamentos = data.medicalEquipments || 'Não informado';
  } else {
    equipamentos = data.aestheticEquipments || 'Não informado';
  }
  
  // Identificar problemas/protocolos
  let problemasProtocolos = '';
  if (data.clinicType === 'clinica_medica') {
    problemasProtocolos = `${data.medicalProblems || ''} - Protocolo mais procurado: ${data.medicalMostSought || ''}`;
  } else {
    problemasProtocolos = `${data.aestheticProblems || ''} - Protocolo mais vendido: ${data.aestheticBestSeller || ''}`;
  }
  
  const publicoIdeal = data.targetAudience || 'Não definido claramente';
  const estilo = data.communicationStyle || 'Não definido';
  const faturamentoAtual = formatRevenue(data.currentRevenue);
  const meta = formatGoal(data.revenueGoal);
  
  // Dados específicos do tipo de clínica
  let dadosEspecificos = '';
  if (data.clinicType === 'clinica_medica') {
    dadosEspecificos = `
- Especialidade: ${data.medicalSpecialty || 'Não informado'}
- Procedimentos: ${data.medicalProcedures || 'Não informado'}
- Ticket médio: ${data.medicalTicket || 'Não informado'}
- Modelo de vendas: ${data.medicalSalesModel || 'Não informado'}
- Objetivo principal: ${data.medicalObjective || 'Não informado'}
- Aparece em vídeos: ${data.medicalVideoFrequency || 'Não informado'}
- Estilo da clínica: ${data.medicalClinicStyle || 'Não informado'}`;
  } else {
    dadosEspecificos = `
- Foco de atuação: ${data.aestheticFocus || 'Não informado'}
- Ticket médio: ${data.aestheticTicket || 'Não informado'}
- Modelo de vendas: ${data.aestheticSalesModel || 'Não informado'}
- Objetivo principal: ${data.aestheticObjective || 'Não informado'}
- Aparece em vídeos: ${data.aestheticVideoFrequency || 'Não informado'}
- Estilo da clínica: ${data.aestheticClinicStyle || 'Não informado'}`;
  }

  const prompt = `CONSULTOR FLUIDA – Diagnóstico de Marketing com Segmentação Inteligente

Você é o CONSULTOR FLUIDA — um estrategista de marketing para clínicas estéticas e clínicas médicas.

Com base no briefing abaixo, gere uma resposta completa dividida nas seções:

1. 📊 Diagnóstico Estratégico da Clínica  
2. 💡 Sugestões de Conteúdo Humanizado (foco: TikTok, Instagram e YouTube Shorts)
3. 📅 Plano de Ação de 3 Semanas  
4. 🎨 Avaliação de Marca e Atendimento  
5. 🧩 Enigma Satírico do Mentor

---

📥 DADOS DO BRIEFING:
- **Tipo de clínica:** ${tipoClinica}
- **Equipamentos utilizados:** ${equipamentos}
- **Problemas/Protocolos:** ${problemasProtocolos}
- **Público ideal:** ${publicoIdeal}
- **Estilo de comunicação:** ${estilo}
- **Faturamento atual:** ${faturamentoAtual}
- **Meta de faturamento:** ${meta}
- **Frequência de postagem:** ${data.contentFrequency || 'Não informado'}

**Dados específicos:**
${dadosEspecificos}

---

📦 REGRAS DE GERAÇÃO:

### 1. 📊 Diagnóstico Estratégico da Clínica
- Identifique os principais desafios e oportunidades baseado nos dados específicos desta clínica ${tipoClinica}
- Analise o gap entre faturamento atual (${faturamentoAtual}) e meta (${meta})
- Use linguagem acessível, direta e empática
- Foque nos pontos que impedem o crescimento e nas oportunidades não exploradas
- Se equipamentos foram mencionados, analise como estão sendo comunicados

### 2. 💡 Sugestões de Conteúdo Humanizado
Crie 5 ideias ESPECÍFICAS para esta clínica ${tipoClinica} baseadas nos dados fornecidos:
- **Formatos prioritários:** Reels, vídeos curtos ou carrossel com rosto
- **Conecte cada conteúdo aos equipamentos:** ${equipamentos}
- **Inclua os problemas/protocolos mencionados:** ${problemasProtocolos}
- **Use o estilo de comunicação:** ${estilo}
- **Foque no público:** ${publicoIdeal}

**Exemplos de formato:**
- "Você sabia que [problema específico mencionado] tem solução?" → Reel com before/after
- "3 sinais de que você precisa de [tratamento específico]" → Carrossel educativo  
- "O que acontece durante [procedimento mencionado]" → Reel de bastidores
- "Por que [equipamento específico] é diferente?" → Vídeo explicativo

**PROIBIDO:** blogs, lives longas, webinars ou estratégias B2B
**OBRIGATÓRIO:** Conectar cada conteúdo a um sentimento (autoestima, superação, dor comum)

### 3. 📅 Plano de Ação de 3 Semanas
Baseado no perfil desta clínica ${tipoClinica}, crie ações específicas e práticas:

**SEMANA 1:** Estruturação de conteúdo
- 3 ações práticas específicas para clínica ${tipoClinica}
- Foco em ${equipamentos}
- Objetivo: ${data.clinicType === 'clinica_medica' ? data.medicalObjective : data.aestheticObjective}

**SEMANA 2:** Engajamento e autoridade  
- 3 ações para conectar com ${publicoIdeal}
- Estratégias para estilo ${estilo}
- Frequência atual: ${data.contentFrequency}

**SEMANA 3:** Conversão e crescimento
- 3 ações para alcançar meta de ${meta}
- Otimização baseada no ticket médio atual
- Foco no modelo de vendas mencionado

### 4. 🎨 Avaliação de Marca e Atendimento
Analise especificamente para esta clínica ${tipoClinica}:

**Identidade Visual:**
- Nome e logotipo: transparecem autoridade para tratar os problemas mencionados?
- Cores e estética: combinam com o estilo ${data.clinicType === 'clinica_medica' ? data.medicalClinicStyle : data.aestheticClinicStyle}?
- Presença digital: está alinhada com frequência ${data.contentFrequency}?

**Experiência do Cliente:**
- Jornada de atendimento: desde o primeiro contato até pós-${data.clinicType === 'clinica_medica' ? 'procedimento' : 'tratamento'}
- Programa de indicação: como transformar clientes satisfeitos em embaixadores
- Recorrência: estratégias para ${data.clinicType === 'clinica_medica' ? 'fidelizar pacientes' : 'manter clientes'}

### 5. 🧩 Enigma Satírico do Mentor
Crie uma frase enigmática que brinque com características do mentor sem revelá-lo:
- Use trocadilhos ou jogos de palavras
- Referência sutil a estratégias de marketing
- Tom bem-humorado e inteligente
- NÃO cite o nome do mentor

**Exemplo:** "Esse plano foi guiado por alguém que faz da estratégia uma 'ladainha' irresistível..."

---

⚠️ REGRAS FINAIS:
- Linguagem prática, clara e emocional
- Foco 100% no cliente final da clínica
- Todo conteúdo deve caber em Instagram, TikTok ou YouTube Shorts
- Se equipamentos específicos foram mencionados, inclua sugestões baseadas neles
- Use os dados específicos fornecidos para personalizar cada seção
- Mantenha tom inspirador e executável`;

  return prompt;
}

function formatRevenue(revenue: string): string {
  const revenueMap: { [key: string]: string } = {
    'ate_15k': 'Até R$ 15.000',
    '15k_30k': 'R$ 15.000 - R$ 30.000',
    '30k_60k': 'R$ 30.000 - R$ 60.000',
    'acima_60k': 'Acima de R$ 60.000'
  };
  return revenueMap[revenue] || revenue || 'Não informado';
}

function formatGoal(goal: string): string {
  const goalMap: { [key: string]: string } = {
    'crescer_30': 'Crescer 30%',
    'crescer_50': 'Crescer 50%',
    'dobrar': 'Dobrar o faturamento',
    'triplicar': 'Triplicar o faturamento',
    'manter_estavel': 'Manter estabilidade'
  };
  return goalMap[goal] || goal || 'Não informado';
}
