
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
    const prompt = createDiagnosticPrompt(diagnosticData);
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
            content: 'Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e clínicas estéticas. Responda sempre de forma estruturada e profissional, incluindo a identificação de um mentor estratégico adequado.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
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

function createDiagnosticPrompt(data: any): string {
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

  const prompt = `Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e clínicas estéticas.

Com base no briefing abaixo, gere uma resposta completa dividida em seções claras:

1. Diagnóstico Estratégico da Clínica
2. Sugestões de Conteúdo Inteligente
3. Plano de Ação de 3 Semanas
4. Mentor Estratégico Identificado + Enigma

---

📥 Dados do briefing:
- Tipo de clínica: ${tipoClinica}
- Especialidade (se médica): ${especialidade}
- Procedimentos oferecidos: ${procedimentos}
- Equipamentos utilizados: ${equipamentos}
- Objetivo principal: ${objetivo}
- Faturamento atual: ${faturamento}
- Meta: ${meta}
- Frequência de conteúdo: ${frequencia}
- Aparece no conteúdo? ${aparece}
- Público ideal: ${publico}
- Posicionamento da clínica: ${posicionamento}
- Usa tráfego pago? ${trafegoReq}

---

📦 Geração do conteúdo:

## 📊 Diagnóstico Estratégico
- Identifique os principais gargalos e oportunidades
- Use tom consultivo, direto e adaptado ao perfil (médico ou estético)

## 💡 Sugestões de Conteúdo Inteligente
- Gere 3 a 5 ideias de conteúdo que a clínica pode executar imediatamente
- Adapte à linguagem desejada e formatos mais usados
- Incluir pelo menos uma ideia relacionada a equipamentos, se aplicável

## 📅 Plano de Ação – 3 Semanas
- Semana 1: Posicionamento e visibilidade
- Semana 2: Prova social e diferenciação
- Semana 3: Conversão e fidelização
- Liste 3 a 4 ações práticas por semana, com tom consultivo

## 🧩 Mentor Estratégico Identificado
Baseado no perfil da clínica, identifique qual dos mentores abaixo seria mais adequado e gere um enigma personalizado:

**Mentores disponíveis:**
- **Leandro Ladeira**: Conversão e vendas diretas (tráfego pago, gatilhos mentais)
- **Ícaro de Carvalho**: Storytelling e posicionamento (branding, autoridade)
- **Camila Porto**: Marketing digital acessível (redes sociais, iniciantes)
- **Paulo Cuenca**: Criatividade e estética visual (criatividade, diferenciação)
- **Hyeser Souza**: Virais e engajamento orgânico (humor, trends)
- **Washington Olivetto**: Big ideas e branding institucional (conceito, memorável)
- **Pedro Sobral**: Performance e ROI estruturado (métricas, analítico)

**Critérios de seleção:**
- Clínicas médicas + autoridade → Ícaro de Carvalho
- Clínicas médicas + escala/estruturação → Pedro Sobral
- Clínicas estéticas + mais leads → Leandro Ladeira
- Iniciantes em marketing → Camila Porto
- Posicionamento premium → Washington Olivetto
- Foco em criatividade visual → Paulo Cuenca
- Presença ativa + engajamento → Hyeser Souza

Apresente o mentor escolhido assim:
**🧠 Mentor Estratégico: [NOME DO MENTOR]**
**Foco:** [ESPECIALIDADE]
**Por que foi escolhido:** [JUSTIFICATIVA BASEADA NO PERFIL]
**Enigma personalizado:** [FRASE SATÍRICA RELACIONADA AO PERFIL DA CLÍNICA]

---

⚠️ Regras finais:
- Use linguagem coerente com o perfil e objetivo da clínica
- Não gere texto genérico
- Organize com títulos claros e tom profissional/humano
- Seja específico e acionável nas sugestões
- O mentor deve ser relevante ao perfil identificado
- O enigma deve ser espirituoso e relacionado aos desafios da clínica`;

  return prompt;
}
