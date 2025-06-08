
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
    const prompt = createEnhancedDiagnosticPrompt(diagnosticData);
    console.log('📝 Prompt criado, tamanho:', prompt.length);

    console.log('🤖 Chamando OpenAI API...');
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
            content: 'Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e clínicas estéticas. Sempre inclua sátiras criativas dos mentores e ideias super personalizadas baseadas no perfil específico da clínica.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
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

function createEnhancedDiagnosticPrompt(data: any): string {
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

  const prompt = `Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e clínicas estéticas.

IMPORTANTE: Gere ideias TOTALMENTE PERSONALIZADAS baseadas nos dados específicos desta clínica. NÃO use sugestões genéricas!

Com base no briefing abaixo, gere uma resposta completa dividida em seções claras:

1. Diagnóstico Estratégico da Clínica
2. Sugestões de Conteúdo Inteligente (PERSONALIZADAS)
3. Plano de Ação de 3 Semanas
4. Mentor Estratégico + Enigma Satírico

---

📥 Dados específicos desta clínica:
- Tipo de clínica: ${tipoClinica}
- Especialidade (se médica): ${especialidade}
- Procedimentos oferecidos: ${procedimentos}
- Equipamentos utilizados: ${equipamentos}
- Objetivo principal: ${objetivo}
- Faturamento atual: ${faturamento}
- Meta de crescimento: ${meta}
- Frequência de conteúdo: ${frequencia}
- Aparece no conteúdo? ${aparece}
- Público ideal: ${publico}
- Posicionamento da clínica: ${posicionamento}
- Usa tráfego pago? ${trafegoReq}

🎯 Contexto único desta clínica: ${contextoCriativo}
🧠 Mentor mais adequado: ${mentorSugerido}

---

📦 INSTRUÇÕES ESPECÍFICAS:

## 📊 Diagnóstico Estratégico
- Analise OS DADOS ESPECÍFICOS desta clínica (não seja genérico)
- Identifique gargalos únicos baseados no faturamento ${faturamento} e meta ${meta}
- Use tom consultivo e adapte ao perfil (${tipoClinica})

## 💡 Sugestões de Conteúdo SUPER PERSONALIZADAS
OBRIGATÓRIO: Gere 4-5 ideias ÚNICAS baseadas em:
- Especialidade específica: ${especialidade || procedimentos}
- Equipamentos da clínica: ${equipamentos}
- Objetivo: ${objetivo}
- Posicionamento: ${posicionamento}
- Público-alvo: ${publico}

Inclua:
- Pelo menos 1 ideia relacionada aos equipamentos específicos
- Pelo menos 1 ideia para aumentar faturamento de ${faturamento} para ${meta}
- Ideias adaptadas ao fato de que ${aparece} aparece no conteúdo
- Formatos específicos para ${tipoClinica} (médica = científico, estética = emocional)

## 📅 Plano de Ação – 3 Semanas ESPECÍFICO
Baseado na frequência atual (${frequencia}) e objetivo (${objetivo}):
- Semana 1: Ações para ${posicionamento} + ${especialidade || procedimentos}
- Semana 2: Estratégias para público ${publico} + equipamentos ${equipamentos}
- Semana 3: Conversão específica para meta ${meta}

## 🧩 Mentor Estratégico + Enigma Satírico
**Mentor escolhido:** ${mentorSugerido}
**Por que foi escolhido:** Baseado no perfil ${tipoClinica} + objetivo ${objetivo} + posicionamento ${posicionamento}

**Enigma Satírico OBRIGATÓRIO:**
Crie uma frase misteriosa com trocadilho/sátira usando o SOBRENOME do mentor (SEM citar o nome completo), relacionada aos desafios específicos desta clínica:

Exemplos do que fazer:
- "Quem tem visão para enxergar além, sempre encontra uma 'CARVALHO' sólida para crescer..."
- "Estratégia que funciona vem de quem sabe fazer uma 'LADEIRA' virar subida de sucesso..."
- "Criatividade que converte vem de quem tem 'PORTO' seguro para navegar no digital..."

---

⚠️ REGRAS CRÍTICAS:
- NUNCA cite o nome completo do mentor, apenas faça trocadilho com o sobrenome
- Gere ideias ESPECÍFICAS desta clínica, não genéricas
- Use os dados reais fornecidos para personalizar tudo
- Organize com títulos claros e tom humano/profissional
- Foque em ações que realmente aumentem o faturamento de ${faturamento} para ${meta}`;

  return prompt;
}

function generateCreativeContext(data: any): string {
  const contexts = [];
  
  if (data.clinicType === 'clinica_medica') {
    if (data.medicalSpecialty === 'dermatologia') {
      contexts.push('Clínica com potencial para autoridade em pele e rejuvenescimento');
    } else if (data.medicalSpecialty === 'nutrologia') {
      contexts.push('Nicho premium com foco em longevidade e qualidade de vida');
    } else if (data.medicalSpecialty === 'cirurgia_plastica') {
      contexts.push('Alto valor agregado, público exigente, resultados definitivos');
    }
  } else {
    if (data.aestheticFocus === 'corporal') {
      contexts.push('Mercado sazonal com picos no verão, foco em transformação');
    } else if (data.aestheticFocus === 'facial') {
      contexts.push('Demanda constante, relacionamento duradouro, autoestima');
    } else if (data.aestheticFocus === 'depilacao') {
      contexts.push('Base recorrente sólida, fidelização natural');
    }
  }
  
  if (data.currentRevenue === 'ate_15k') {
    contexts.push('Fase de estruturação, precisa profissionalizar marketing');
  } else if (data.currentRevenue === 'acima_60k') {
    contexts.push('Alto faturamento, foco em eficiência e liderança');
  }
  
  if (data.personalBrand === 'nunca') {
    contexts.push('Oportunidade inexplorada de marca pessoal');
  } else if (data.personalBrand === 'sim_sempre') {
    contexts.push('Marca pessoal ativa, otimizar alcance');
  }
  
  return contexts.join('. ') || 'Clínica com potencial de crescimento único';
}

function inferBestMentor(data: any): string {
  // Lógica para inferir o mentor mais adequado
  if (data.clinicType === 'clinica_medica') {
    if (data.medicalObjective === 'autoridade') {
      return 'Ícaro de Carvalho (Storytelling e Autoridade)';
    } else if (data.medicalObjective === 'escala') {
      return 'Pedro Sobral (Performance e Estruturação)';
    } else {
      return 'Washington Olivetto (Big Ideas Médicas)';
    }
  } else {
    if (data.aestheticObjective === 'mais_leads') {
      return 'Leandro Ladeira (Conversão e Tráfego)';
    } else if (data.aestheticObjective === 'autoridade') {
      return 'Ícaro de Carvalho (Storytelling e Posicionamento)';
    } else if (data.clinicPosition === 'premium') {
      return 'Washington Olivetto (Branding Premium)';
    } else {
      return 'Paulo Cuenca (Criatividade Visual)';
    }
  }
  
  // Fallbacks baseados em outros critérios
  if (data.personalBrand === 'nunca' || data.contentFrequency === 'irregular') {
    return 'Camila Porto (Marketing Básico Estruturado)';
  }
  
  if (data.paidTraffic === 'nunca_usei') {
    return 'Leandro Ladeira (Conversão e Tráfego Pago)';
  }
  
  return 'Hyeser Souza (Engajamento e Viralização)';
}
