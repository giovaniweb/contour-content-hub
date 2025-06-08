
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
    const prompt = createUltraPersonalizedPrompt(diagnosticData);
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
            content: 'Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e clínicas estéticas. SEMPRE inclua as 4 seções obrigatórias: Diagnóstico, Ideias de Conteúdo, Plano de Ação e OBRIGATORIAMENTE a Sátira do Mentor no final.' 
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

function createUltraPersonalizedPrompt(data: any): string {
  // Mapear os dados para o formato do prompt
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const especialidade = data.medicalSpecialty || 'Não especificado';
  const procedimentos = data.medicalProcedures || data.aestheticFocus || 'Não especificado';
  const equipamentos = data.aestheticEquipments || 'Não especificado';
  const objetivo = data.medicalObjective || data.aestheticObjective || 'Não especificado';
  const faturamento = data.currentRevenue || 'Não informado';
  const meta = data.revenueGoal || 'Não informado';
  const frequencia = data.contentFrequency || 'Não informado';
  const aparece = data.personalBrand || 'Não informado';
  const publico = data.targetAudience || 'Não definido';
  const posicionamento = data.clinicPosition || 'Não definido';
  const trafegoReq = data.paidTraffic || 'Não informado';

  // Gerar contexto único para personalização
  const contextoCriativo = generateCreativeContext(data);
  const mentorSugerido = inferBestMentor(data);

  const prompt = `🎯 CONSULTOR FLUIDA — DIAGNÓSTICO PERSONALIZADO

DADOS EXCLUSIVOS DESTA CLÍNICA:
- Tipo: ${tipoClinica}
- Especialidade: ${especialidade}
- Procedimentos: ${procedimentos}
- Equipamentos: ${equipamentos}
- Objetivo: ${objetivo}
- Faturamento atual: ${faturamento}
- Meta: ${meta}
- Frequência de conteúdo: ${frequencia}
- Aparece em vídeos: ${aparece}
- Público: ${publico}
- Posicionamento: ${posicionamento}
- Tráfego pago: ${trafegoReq}

CONTEXTO ÚNICO: ${contextoCriativo}
MENTOR IDENTIFICADO: ${mentorSugerido}

---

GERE UM DIAGNÓSTICO COMPLETO COM EXATAMENTE 4 SEÇÕES:

## 📊 DIAGNÓSTICO ESTRATÉGICO DA CLÍNICA
Analise OS DADOS ESPECÍFICOS desta clínica ${tipoClinica}. Identifique:
- Gargalos únicos baseado no faturamento ${faturamento} vs meta ${meta}
- Oportunidades específicas para ${especialidade || procedimentos}
- Análise do posicionamento ${posicionamento} no mercado
- Status da presença digital atual (${aparece} aparece, frequência ${frequencia})

## 💡 IDEIAS DE CONTEÚDO SUPER PERSONALIZADAS
OBRIGATÓRIO: Gere 4-5 ideias EXCLUSIVAS para esta clínica:

1. UMA ideia relacionada aos equipamentos: ${equipamentos}
2. UMA ideia para aumentar faturamento de ${faturamento} para ${meta}
3. UMA ideia específica para o público ${publico}
4. UMA ideia baseada no posicionamento ${posicionamento}
5. UMA ideia para melhorar ${objetivo}

Cada ideia deve incluir:
- Formato específico (Reel, Carrossel, Story, Live)
- Título exato do conteúdo
- Como executar na prática
- Por que vai funcionar para este perfil

## 📅 PLANO DE AÇÃO - 3 SEMANAS ESPECÍFICO
Baseado na frequência ${frequencia} e objetivo ${objetivo}:

**SEMANA 1:** Ações para ${posicionamento} + ${especialidade || procedimentos}
- 3 ações práticas específicas

**SEMANA 2:** Estratégias para público ${publico} + equipamentos ${equipamentos}
- 3 ações práticas específicas

**SEMANA 3:** Conversão para meta ${meta} + otimização
- 3 ações práticas específicas

## 🧩 SÁTIRA DO MENTOR - OBRIGATÓRIO
**Mentor escolhido:** ${mentorSugerido}
**Por que:** Baseado no perfil ${tipoClinica} + objetivo ${objetivo}

**ENIGMA SATÍRICO:**
Crie uma frase misteriosa com trocadilho usando APENAS O SOBRENOME do mentor (sem citar nome completo), relacionada aos desafios específicos desta clínica.

Exemplos do formato:
- "Quem tem visão estratégica sempre encontra uma 'CARVALHO' sólida para crescer..."
- "Marketing que converte vem de quem sabe navegar no 'PORTO' digital..."
- "Criatividade que funciona vem de quem domina a 'LADEIRA' do sucesso..."

⚠️ REGRAS CRÍTICAS:
- NUNCA cite o nome completo do mentor
- Use APENAS o sobrenome em trocadilho
- Gere ideias ESPECÍFICAS desta clínica, não genéricas
- TODAS as 4 seções são obrigatórias
- Foque em ações que realmente aumentem o faturamento`;

  return prompt;
}

function generateCreativeContext(data: any): string {
  const contexts = [];
  
  if (data.clinicType === 'clinica_medica') {
    if (data.medicalSpecialty === 'dermatologia') {
      contexts.push('Clínica dermatológica com potencial para autoridade em rejuvenescimento e saúde da pele');
    } else if (data.medicalSpecialty === 'nutrologia') {
      contexts.push('Nicho premium em nutrologia com foco em longevidade e qualidade de vida');
    } else if (data.medicalSpecialty === 'cirurgia_plastica') {
      contexts.push('Cirurgia plástica de alto valor agregado, público exigente, resultados definitivos');
    } else if (data.medicalSpecialty === 'ginecoestetica') {
      contexts.push('Ginecoestética especializada, mercado específico com alta demanda');
    } else {
      contexts.push('Clínica médica especializada com potencial de diferenciação técnica');
    }
  } else {
    if (data.aestheticFocus === 'corporal') {
      contexts.push('Estética corporal com mercado sazonal, picos no verão, foco em transformação');
    } else if (data.aestheticFocus === 'facial') {
      contexts.push('Estética facial com demanda constante, relacionamento duradouro, autoestima');
    } else if (data.aestheticFocus === 'depilacao') {
      contexts.push('Depilação com base recorrente sólida, fidelização natural');
    } else {
      contexts.push('Estética completa com múltiplas oportunidades de cross-selling');
    }
  }
  
  if (data.currentRevenue === 'ate_15k') {
    contexts.push('Fase inicial de crescimento, precisa estruturar marketing e processos');
  } else if (data.currentRevenue === '15k_30k') {
    contexts.push('Crescimento consistente, momento de profissionalizar e escalar');
  } else if (data.currentRevenue === '30k_60k') {
    contexts.push('Faturamento sólido, foco em eficiência e diferenciação');
  } else if (data.currentRevenue === 'acima_60k') {
    contexts.push('Alto faturamento, oportunidade de liderança e expansão');
  }
  
  if (data.personalBrand === 'nunca') {
    contexts.push('Grande oportunidade inexplorada de marca pessoal para autoridade');
  } else if (data.personalBrand === 'sim_sempre') {
    contexts.push('Marca pessoal ativa, otimizar alcance e conversão');
  }

  if (data.paidTraffic === 'nunca_usei') {
    contexts.push('Oportunidade de crescimento acelerado com tráfego pago estruturado');
  } else if (data.paidTraffic === 'sim_regular') {
    contexts.push('Tráfego pago ativo, focar em otimização de ROI e escalabilidade');
  }
  
  return contexts.join('. ') || 'Clínica com perfil único e potencial de crescimento diferenciado';
}

function inferBestMentor(data: any): string {
  // Lógica mais robusta para inferir o mentor
  if (data.clinicType === 'clinica_medica') {
    if (data.medicalObjective === 'autoridade') {
      return 'Ícaro de Carvalho (Storytelling e Autoridade Médica)';
    } else if (data.medicalObjective === 'escala') {
      return 'Pedro Sobral (Performance e Estruturação Médica)';
    } else if (data.medicalObjective === 'diferenciacao') {
      return 'Washington Olivetto (Big Ideas Médicas)';
    } else {
      return 'Dr. Ícaro de Carvalho (Comunicação Médica)';
    }
  } else {
    if (data.aestheticObjective === 'mais_leads') {
      return 'Leandro Ladeira (Conversão e Tráfego)';
    } else if (data.aestheticObjective === 'autoridade') {
      return 'Ícaro de Carvalho (Storytelling e Posicionamento)';
    } else if (data.aestheticObjective === 'ticket_medio') {
      return 'Paulo Cuenca (Criatividade e Valor)';
    } else if (data.clinicPosition === 'premium') {
      return 'Washington Olivetto (Branding Premium)';
    } else {
      return 'Camila Porto (Marketing Estético Estruturado)';
    }
  }
}
