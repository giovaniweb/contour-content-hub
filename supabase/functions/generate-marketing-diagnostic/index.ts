
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
            content: `Você é o CONSULTOR FLUIDA — um estrategista de marketing especializado em clínicas médicas e estéticas, com foco total em atrair, encantar e fidelizar o público final.

🔐 REGRAS DE ACESSO IMPORTANTES:
- Se for CLÍNICA MÉDICA: pode sugerir TODOS os equipamentos (médicos e estéticos)
- Se for CLÍNICA ESTÉTICA: pode sugerir APENAS equipamentos estéticos
- NUNCA sugira equipamentos médicos (CO2 Fracionado, Ultrassom microfocado, Intradermoterapia) para clínicas estéticas

Use linguagem emocional, acessível e inspiração prática. Foque em conteúdo para Instagram, TikTok e YouTube Shorts.` 
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
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  // Filtrar equipamentos baseado no tipo de clínica
  let equipamentosDisponiveis = '';
  if (data.equipments && Array.isArray(data.equipments)) {
    const equipamentosFiltrados = data.equipments.filter(eq => {
      if (isClinicaMedica) {
        // Clínica médica pode ver todos os equipamentos
        return true;
      } else {
        // Clínica estética só pode ver equipamentos estéticos
        return eq.categoria === 'estetico';
      }
    });
    
    equipamentosDisponiveis = equipamentosFiltrados.length > 0 
      ? equipamentosFiltrados.map(eq => `${eq.nome} (${eq.categoria})`).join(', ')
      : 'Nenhum equipamento cadastrado para este perfil';
  }
  
  // Identificar equipamentos mencionados pelo usuário
  let equipamentosUsuario = '';
  if (data.clinicType === 'clinica_medica') {
    equipamentosUsuario = data.medicalEquipments || 'Não informado';
  } else {
    equipamentosUsuario = data.aestheticEquipments || 'Não informado';
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

  const prompt = `CONSULTOR FLUIDA com Especialistas Inteligentes (para Dashboard)

Você é o CONSULTOR FLUIDA — um estrategista de marketing para clínicas estéticas e clínicas médicas.

Com base no briefing a seguir, execute as etapas abaixo:

---

📥 Dados de entrada:
- Tipo de clínica: ${tipoClinica}
- Equipamentos utilizados: ${equipamentosUsuario}
- Equipamentos disponíveis no sistema: ${equipamentosDisponiveis}
- Problemas/Protocolos: ${problemasProtocolos}
- Público ideal: ${publicoIdeal}
- Estilo de linguagem: ${estilo}
- Faturamento atual: ${faturamentoAtual}
- Meta de faturamento: ${meta}
- Frequência de conteúdo: ${data.contentFrequency || 'Não informado'}

**Dados específicos:**
${dadosEspecificos}

---

🔐 REGRAS DE ACESSO IMPORTANTES:
- Tipo de clínica detectado: ${tipoClinica}
- ${isClinicaMedica ? 'CLÍNICA MÉDICA: pode sugerir TODOS os equipamentos (médicos e estéticos)' : 'CLÍNICA ESTÉTICA: pode sugerir APENAS equipamentos estéticos'}
- ${!isClinicaMedica ? 'NUNCA sugira equipamentos médicos (CO2 Fracionado, Ultrassom microfocado, Intradermoterapia) para esta clínica' : ''}

---

📊 Etapa 1 – Diagnóstico Estratégico:
Gere um texto consultivo apontando os principais gargalos e oportunidades, com base no perfil da clínica.

---

💡 Etapa 2 – Sugestões de Conteúdo:
Gere 3 a 5 ideias práticas de Reels, Shorts ou TikTok, com linguagem adaptada ao perfil.
Inclua 1 ideia envolvendo o uso de equipamentos, se aplicável.

---

📅 Etapa 3 – Plano de Ação (3 semanas):
- Semana 1: Autoridade e Presença
- Semana 2: Prova Social e Conexão  
- Semana 3: Conversão e Campanha
Inclua 3 ações práticas por semana.

---

🎨 Etapa 4 – Avaliação de Marca:
Analise logo, paleta de cores, tom de voz, atendimento e harmonia visual.
Sugira melhorias + programa de indicação + humanização da jornada.

---

🧠 Etapa 5 – Ativação de Especialistas:
Escolha de 2 a 4 especialistas abaixo com base no diagnóstico.
Para cada um, gere:
- Nome do especialista
- Missão dele no caso da clínica
- Mini diagnóstico do motivo de sua convocação
- Uma ação prática que ele recomenda

Especialistas disponíveis:

1. Expert em Conversão — foco em leads e agendamento
2. Especialista em Storytelling — autoridade emocional
3. Consultor Criativo — ideias virais e campanhas
4. Gestor de Tráfego — anúncios e performance
5. Especialista em Posicionamento — clareza da promessa
6. Expert em Fidelização — aumentar retorno e recorrência
7. Harmonizador de Marca — logotipo, visual e encantamento

---

🧩 Etapa 6 – Enigma do Mentor:
Crie um trocadilho divertido com o sobrenome do mentor usado, sem citar o nome.
Exemplo: "Esse plano foi guiado por alguém que transforma estratégia em ladainha... convincente."

---

⚠️ Regras finais:
- Não cite o nome do mentor
- Linguagem humana, consultiva e prática
- Foco 100% no cliente final da clínica
- Não sugerir lives, webinars ou blogs
- Todo conteúdo deve funcionar em Instagram, TikTok ou Shorts
- **IMPORTANTE:** Respeite o controle de acesso - ${!isClinicaMedica ? 'NÃO sugira equipamentos médicos para clínica estética' : 'Pode sugerir qualquer equipamento'}`;

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
