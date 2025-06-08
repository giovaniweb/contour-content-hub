
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

    // Criar o prompt personalizado com os dados do diagnóstico
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
  // Mapear os dados para o formato específico do Consultor Fluida
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const equipamentos = formatEquipments(data);
  const problemasResolvidos = extractProblems(data);
  const publicoIdeal = data.targetAudience || 'Não definido claramente';
  const estilo = getStyleDescription(data.personalBrand);
  const faturamentoAtual = formatRevenue(data.currentRevenue);
  const meta = formatGoal(data.revenueGoal);

  const prompt = `Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e estéticas, com foco total em atrair, encantar e fidelizar o público final.

Com base no briefing abaixo, gere uma resposta dividida nas seções:

1. Diagnóstico Estratégico da Clínica  
2. Ideias de Conteúdo Humanizado  
3. Plano de Ação de 3 Semanas  
4. Avaliação de Marca e Atendimento  
5. Enigma Satírico do Mentor

---

📥 Dados do briefing:
- Tipo de clínica: ${tipoClinica}
- Equipamentos: ${equipamentos}
- Problemas resolvidos: ${problemasResolvidos}
- Público ideal: ${publicoIdeal}
- Estilo de linguagem desejado: ${estilo}
- Faturamento atual: ${faturamentoAtual}, Meta: ${meta}

---

📦 Regras de geração:

### 1. 📊 Diagnóstico Estratégico da Clínica
- Identifique os principais desafios e oportunidades baseado nos dados específicos
- Analise o gap entre faturamento atual (${faturamentoAtual}) e meta (${meta})
- Use linguagem acessível, direta e empática
- Foque nos pontos que impedem o crescimento e nas oportunidades não exploradas

### 2. 💡 Ideias de Conteúdo Humanizado (foco: TikTok, Instagram e YouTube Shorts)
- Crie 5 ideias ESPECÍFICAS para esta clínica ${tipoClinica}
- Formatos prioritários: Reels, vídeos curtos ou carrossel com rosto
- Conecte cada conteúdo aos equipamentos: ${equipamentos}
- Exemplos de formato:
  * "Você sabia que [problema específico] tem solução?" → Reel com before/after
  * "3 sinais de que você precisa de [tratamento]" → Carrossel educativo
  * "O que acontece durante [procedimento]" → Reel de bastidores
- Nada de blogs, lives longas, webinars ou estratégias B2B
- Conecte cada conteúdo a um sentimento (autoestima, superação, dor comum)
- Use a linguagem: ${estilo}

### 3. 📅 Plano de Ação de 3 Semanas
Baseado no perfil desta clínica, crie ações específicas e práticas:

**SEMANA 1:** Estruturação de conteúdo
- 3 ações práticas específicas para ${tipoClinica}
- Foco em ${equipamentos}

**SEMANA 2:** Engajamento e autoridade  
- 3 ações para conectar com ${publicoIdeal}
- Estratégias para ${estilo}

**SEMANA 3:** Conversão e crescimento
- 3 ações para alcançar meta de ${meta}
- Otimização baseada nos resultados

### 4. 🎨 Avaliação de Marca e Atendimento
Analise especificamente para esta clínica ${tipoClinica}:

**Identidade Visual:**
- Nome e logotipo: transparecem autoridade para tratar ${problemasResolvidos}?
- Cores combinam com ${publicoIdeal}?
- Coerência com ${estilo}?

**Experiência do Cliente:**
- Jornada tem acolhimento adequado para ${problemasResolvidos}?
- Follow-up pós tratamento com ${equipamentos}?
- Programa de indicação para ${publicoIdeal}?
- Coleta de feedbacks e avaliações públicas?

**Recomendações específicas** para tornar a jornada mais encantadora e coerente.

### 5. 🧩 Enigma Satírico do Mentor
Crie um enigma com trocadilho sutil relacionado aos desafios específicos desta clínica ${tipoClinica} que resolve ${problemasResolvidos}.

Formato sugerido: "Marketing que converte ${problemasResolvidos} vem de quem sabe [TROCADILHO CRIATIVO]..."

---

⚠️ Regras finais:
- Foco 100% no público final (pacientes da clínica)
- Linguagem emocional, acessível, com inspiração prática
- Resposta organizada com títulos, ícones e estrutura clara
- TODAS as 5 seções são obrigatórias
- Use dados específicos fornecidos, não seja genérico`;

  return prompt;
}

function formatEquipments(data: any): string {
  const equipments = [];
  
  if (data.aestheticEquipments) {
    equipments.push(data.aestheticEquipments);
  }
  if (data.medicalEquipments) {
    equipments.push(data.medicalEquipments);
  }
  
  return equipments.length > 0 ? equipments.join(', ') : 'Não especificado';
}

function extractProblems(data: any): string {
  const problems = [];
  
  if (data.clinicType === 'clinica_medica') {
    const medicalProblems = {
      'dermatologia': 'Manchas, rugas, acne, envelhecimento da pele',
      'nutrologia': 'Sobrepeso, deficiências nutricionais, metabolismo lento',
      'cirurgia_plastica': 'Insatisfação corporal, autoestima baixa, marcas do tempo',
      'ginecoestetica': 'Flacidez íntima, ressecamento, baixa autoestima sexual',
      'medicina_estetica': 'Sinais de envelhecimento, flacidez, volume facial',
      'outras': 'Problemas de saúde e estética'
    };
    problems.push(medicalProblems[data.medicalSpecialty] || 'Problemas de saúde e estética');
  } else {
    const aestheticProblems = {
      'corporal': 'Gordura localizada, flacidez corporal, celulite',
      'facial': 'Rugas, manchas, flacidez facial, perda de volume',
      'depilacao': 'Pelos indesejados, foliculite, irritação da pele',
      'ambos': 'Problemas estéticos corporais e faciais'
    };
    problems.push(aestheticProblems[data.aestheticFocus] || 'Problemas estéticos');
  }
  
  // Adicionar serviço principal se especificado
  if (data.mainService) {
    problems.push(`Foco especial em: ${data.mainService}`);
  }
  
  return problems.join(', ');
}

function getStyleDescription(personalBrand: string): string {
  const styleMap = {
    'sim_sempre': 'Comunicação humanizada com presença pessoal constante',
    'as_vezes': 'Comunicação mista, equilibrando presença pessoal e institucional',
    'raramente': 'Comunicação mais institucional, com aparições pontuais',
    'nunca': 'Comunicação institucional, sem exposição pessoal'
  };
  return styleMap[personalBrand] || 'Estilo de comunicação não definido';
}

function formatRevenue(revenue: string): string {
  const revenueMap = {
    'ate_15k': 'Até R$ 15.000',
    '15k_30k': 'R$ 15.000 - R$ 30.000', 
    '30k_60k': 'R$ 30.000 - R$ 60.000',
    'acima_60k': 'Acima de R$ 60.000'
  };
  return revenueMap[revenue] || 'Não informado';
}

function formatGoal(goal: string): string {
  const goalMap = {
    'dobrar': 'Dobrar o faturamento',
    'crescer_50': 'Crescer 50%',
    'crescer_30': 'Crescer 30%',
    'manter_estavel': 'Manter estabilidade'
  };
  return goalMap[goal] || 'Não informado';
}
