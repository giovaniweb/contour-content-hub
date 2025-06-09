
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🎯 CONSULTOR FLUIDA - Diagnóstico iniciado');
  console.log('📝 Method:', req.method);
  console.log('🔑 OpenAI Key present:', !!openAIApiKey);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const diagnosticData = await req.json();
    console.log('📊 Dados do diagnóstico recebidos:', JSON.stringify(diagnosticData, null, 2));

    // Validação da chave OpenAI
    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY não configurada!');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'OPENAI_API_KEY não configurada'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Criar prompt consolidado seguindo as especificações completas
    const prompt = createConsolidatedFluidaPrompt(diagnosticData);
    console.log('📝 Prompt consolidado criado, tamanho:', prompt.length);

    console.log('🌐 Iniciando chamada OpenAI...');
    
    // Configurações corrigidas com timeout de 60s
    const requestBody = {
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: getConsolidatedSystemPrompt()
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000 // Aumentado para garantir resposta completa
    };

    console.log('📦 Request configurado:', { model: requestBody.model, max_tokens: requestBody.max_tokens });
    
    // Chamada para OpenAI com timeout controlado de 60s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Timeout de 60s atingido');
      controller.abort();
    }, 60000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);
    console.log('📡 Status da resposta OpenAI:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: `OpenAI Error ${response.status}: ${errorText}`
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📄 Resposta OpenAI recebida com sucesso');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Estrutura de resposta inválida da OpenAI');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'Estrutura de resposta inválida'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const diagnosticResult = data.choices[0].message.content;
    console.log('✅ Diagnóstico gerado com sucesso, tamanho:', diagnosticResult?.length || 0);

    // Validar se o diagnóstico tem a estrutura obrigatória das 6 seções
    const hasRequiredSections = validateDiagnosticStructure(diagnosticResult);
    if (!hasRequiredSections) {
      console.warn('⚠️ Diagnóstico não possui estrutura completa, usando fallback');
      return new Response(JSON.stringify({ 
        diagnostic: generateFallbackDiagnostic(diagnosticData),
        success: false,
        fallback: true,
        error: 'Estrutura incompleta no diagnóstico'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      diagnostic: diagnosticResult,
      success: true,
      timestamp: new Date().toISOString(),
      model_used: 'gpt-4',
      clinic_type: diagnosticData.clinicType,
      equipments_validated: await validateEquipments(diagnosticData)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
    
    return new Response(JSON.stringify({ 
      diagnostic: generateFallbackDiagnostic(diagnosticData || {}),
      success: false,
      fallback: true,
      error: error.message || 'Erro desconhecido',
      error_details: error.name === 'AbortError' ? 'Timeout na chamada da OpenAI (60s)' : 'Erro interno'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getConsolidatedSystemPrompt(): string {
  return `Você é o CONSULTOR FLUIDA — estrategista oficial da plataforma para clínicas estéticas e médicas.

Sua missão é gerar um diagnóstico completo com base nas respostas fornecidas, adaptando a linguagem e recomendações ao tipo de clínica (médica ou estética).

⚠️ ESTRUTURA OBRIGATÓRIA (usar EXATAMENTE estes títulos e emojis):

## 📊 Diagnóstico Estratégico da Clínica
[Identifique gargalos, analise desalinhamento entre público/oferta/visual/autoridade, use tom consultivo adaptado]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas SOMENTE para Instagram, Reels, TikTok, Shorts - incluir pelo menos 3 ideias com equipamentos citados]

## 📅 Plano de Ação Semanal
Semana 1: Autoridade e visibilidade
Semana 2: Prova social e diferencial  
Semana 3: Conversão e campanha
Semana 4: Aceleração e fidelização
[3-4 tarefas práticas por semana]

## 🎨 Avaliação de Marca e Atendimento
[Avalie identidade visual, atendimento vs posicionamento, sugira melhorias e programa de indicação]

## 🧩 Enigma do Mentor
[Frase misteriosa com trocadilho - NUNCA revele o nome verdadeiro do mentor]

## 📈 Insights Estratégicos Fluida
[3-5 insights práticos com tom de consultoria]

🎯 Fluxo de Segmentação:
- Clínica Médica → Pode ver todos os equipamentos
- Clínica Estética → Apenas equipamentos não invasivos

Use a linguagem adequada:
- Clínica médica = técnico-consultiva
- Clínica estética = emocional-inspiradora

⚠️ RESTRIÇÕES:
- Proibido citar live, blog, ebook ou webinar
- Tudo deve caber em conteúdo de rede social
- Use linguagem adaptada: médica = técnico-consultivo, estética = emocional-inspirador
- Não alucine equipamentos ou formatos não citados
- Continue sempre a partir da estrutura atual

⚠️ IMPORTANTE: Siga EXATAMENTE a estrutura das 6 seções obrigatórias com os títulos e emojis especificados.

SEMPRE gere um diagnóstico completo e estruturado, mesmo com dados limitados.`;
}

function createConsolidatedFluidaPrompt(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  // Detectar dados principais com base no tipo de clínica
  const especialidade = isClinicaMedica 
    ? (data.medicalSpecialty || 'Não informado')
    : (data.aestheticFocus || 'Não informado');

  const procedimentos = isClinicaMedica
    ? (data.medicalProcedures || 'Não informado')
    : (data.aestheticTreatments || 'Não informado');

  const equipamentos = isClinicaMedica
    ? (data.medicalEquipments || 'Não informado')
    : (data.aestheticEquipments || 'Não informado');

  const protocolo = isClinicaMedica
    ? (data.medicalBestSeller || 'Não informado')
    : (data.aestheticBestSeller || 'Não informado');

  const ticketMedio = isClinicaMedica
    ? formatMedicalTicket(data.medicalTicket)
    : formatAestheticTicket(data.aestheticTicket);

  const objetivo = isClinicaMedica
    ? formatMedicalObjective(data.medicalObjective)
    : formatAestheticObjective(data.aestheticObjective);

  const modelo_venda = isClinicaMedica
    ? (data.medicalSalesModel || 'Não informado')
    : (data.aestheticSalesModel || 'Não informado');

  const frequencia = data.contentFrequency || 'Não informado';
  const faturamento = formatRevenue(data.currentRevenue);
  const meta = formatGoal(data.revenueGoal);
  const publicoIdeal = data.targetAudience || 'Não definido';
  const estiloClinica = data.clinicType === 'clinica_medica' ? data.medicalClinicStyle : data.aestheticClinicStyle || 'Não definido';
  const desafios = data.mainChallenges || 'Não informado';
  const estiloLinguagem = data.communicationStyle || (isClinicaMedica ? 'técnico-consultivo' : 'emocional e inspirador');
  const apareceVideos = data.contentFrequency === 'diario' ? 'Sim' : 'Raramente';

  const prompt = `🎯 CONSULTOR FLUIDA - DIAGNÓSTICO PERSONALIZADO

📋 Dados de briefing disponíveis:

- Tipo: ${tipoClinica}
- Especialidade: ${especialidade}
- Procedimentos: ${procedimentos}
- Equipamentos: ${equipamentos}
- Protocolo mais vendido: ${protocolo}
- Ticket médio: ${ticketMedio}
- Modelo de venda: ${modelo_venda}
- Faturamento atual: ${faturamento}
- Meta 3 meses: ${meta}
- Objetivo de marketing: ${objetivo}
- Frequência de conteúdo: ${frequencia}
- Aparece nos vídeos: ${apareceVideos}
- Público ideal: ${publicoIdeal}
- Estilo da clínica: ${estiloClinica}
- Estilo de linguagem desejado: ${estiloLinguagem}
- Principais desafios: ${desafios}

🎯 GERE UM DIAGNÓSTICO COMPLETO SEGUINDO A ESTRUTURA OBRIGATÓRIA:

## 📊 Diagnóstico Estratégico da Clínica
[Identifique gargalos, analise desalinhamento entre público/oferta/visual/autoridade, use tom consultivo adaptado]

## 💡 Sugestões de Conteúdo Personalizado
[3-5 ideias práticas SOMENTE para Instagram, Reels, TikTok, Shorts - incluir pelo menos 3 ideias com equipamentos citados]

## 📅 Plano de Ação Semanal
Semana 1: Autoridade e visibilidade
Semana 2: Prova social e diferencial  
Semana 3: Conversão e campanha
Semana 4: Aceleração e fidelização
[3-4 tarefas práticas por semana]

## 🎨 Avaliação de Marca e Atendimento
[Avalie identidade visual, atendimento vs posicionamento, sugira melhorias e programa de indicação]

## 🧩 Enigma do Mentor
[Frase misteriosa com trocadilho - NUNCA revele o nome verdadeiro do mentor]

## 📈 Insights Estratégicos Fluida
[3-5 insights práticos com tom de consultoria]

Use a linguagem adequada:
- ${isClinicaMedica ? 'TÉCNICO-CONSULTIVA (clínica médica)' : 'EMOCIONAL-INSPIRADORA (clínica estética)'}

Foque nos equipamentos mencionados: ${equipamentos}

Personalize tudo com base no perfil fornecido acima.

⚠️ IMPORTANTE: Siga EXATAMENTE a estrutura das 6 seções obrigatórias com os títulos e emojis especificados.`;

  return prompt;
}

// Função para validar se o diagnóstico tem as 6 seções obrigatórias
function validateDiagnosticStructure(diagnostic: string): boolean {
  const requiredSections = [
    '📊 Diagnóstico Estratégico da Clínica',
    '💡 Sugestões de Conteúdo Personalizado',
    '📅 Plano de Ação Semanal',
    '🎨 Avaliação de Marca e Atendimento',
    '🧩 Enigma do Mentor',
    '📈 Insights Estratégicos Fluida'
  ];
  
  let foundSections = 0;
  requiredSections.forEach(section => {
    if (diagnostic.includes(section)) {
      foundSections++;
    }
  });
  
  console.log(`🔍 Estrutura validada: ${foundSections}/6 seções encontradas`);
  return foundSections >= 5; // Aceita se pelo menos 5 das 6 seções estão presentes
}

// Função para gerar fallback estruturado
function generateFallbackDiagnostic(data: any): string {
  const tipoClinica = data.clinicType === 'clinica_medica' ? 'Médica' : 'Estética';
  const isClinicaMedica = data.clinicType === 'clinica_medica';
  
  return `## 📊 Diagnóstico Estratégico da Clínica

⚠️ **Geração automática indisponível. Exibindo sugestões padrão com base no seu perfil.**

**Tipo:** Clínica ${tipoClinica}
**Análise:** Sua clínica possui potencial de crescimento. ${isClinicaMedica ? 'Como clínica médica, o foco deve ser autoridade científica e credibilidade.' : 'Como clínica estética, o foco deve ser transformação visual e experiência do cliente.'}

## 💡 Sugestões de Conteúdo Personalizado

1. **Posts educativos** sobre ${isClinicaMedica ? 'procedimentos médicos' : 'tratamentos estéticos'}
2. **Antes e depois** de casos reais (respeitando privacidade)
3. **Stories com dicas** rápidas e práticas
4. **Reels explicativos** sobre diferenciais da clínica

## 📅 Plano de Ação Semanal

**Semana 1:** Estruturar linha editorial
**Semana 2:** Criar conteúdo de autoridade
**Semana 3:** Implementar campanhas de captação
**Semana 4:** Otimizar e mensurar resultados

## 🎨 Avaliação de Marca e Atendimento

- Revisar identidade visual
- Alinhar atendimento com posicionamento
- Criar programa de indicação

## 🧩 Enigma do Mentor

"Quem planta consistência, colhe resultados duradouros..."

## 📈 Insights Estratégicos Fluida

- Consistência na comunicação é fundamental
- ${isClinicaMedica ? 'Autoridade técnica gera confiança' : 'Transformação visual gera desejo'}
- Investir em relacionamento com pacientes

---
*Diagnóstico temporariamente indisponível. Suas respostas foram salvas e você pode tentar novamente em instantes.*`;
}

// Função para validar equipamentos (simples, pode ser expandida)
async function validateEquipments(data: any): Promise<string[]> {
  const equipments = data.clinicType === 'clinica_medica' 
    ? (data.medicalEquipments || '')
    : (data.aestheticEquipments || '');
    
  if (!equipments) return [];
  
  // Lista básica de equipamentos conhecidos (pode ser expandida)
  const knownEquipments = [
    'unyque_pro', 'reverso', 'enygma', 'crystal_3d_plus', 'crio', 'multishape',
    'laser_co2', 'microagulhamento', 'peeling_quimico', 'toxina_botulinica',
    'preenchimento', 'sculptra', 'harmonizacao_facial', 'criolipolise',
    'adélla_laser', 'lasers_co2'
  ];
  
  return equipments.split(',').map((eq: string) => eq.trim()).filter((eq: string) => 
    knownEquipments.includes(eq.toLowerCase().replace(' ', '_'))
  );
}

// Funções auxiliares de formatação (mantidas iguais)
function formatRevenue(revenue: string): string {
  const map: { [key: string]: string } = {
    'ate_15k': 'Até R$ 15.000/mês',
    '15k_30k': 'R$ 15.000 - R$ 30.000/mês',
    '30k_60k': 'R$ 30.000 - R$ 60.000/mês',
    'acima_60k': 'Acima de R$ 60.000/mês'
  };
  return map[revenue] || revenue || 'Não informado';
}

function formatGoal(goal: string): string {
  const map: { [key: string]: string } = {
    'crescer_30': 'Crescer 30% em 3 meses',
    'crescer_50': 'Crescer 50% em 3 meses',
    'dobrar': 'Dobrar em 6 meses',
    'triplicar': 'Triplicar em 1 ano',
    'manter_estavel': 'Manter estabilidade'
  };
  return map[goal] || goal || 'Não informado';
}

function formatMedicalObjective(objective: string): string {
  const map: { [key: string]: string } = {
    'autoridade_medica': 'Aumentar autoridade médica',
    'escalar_consultorio': 'Escalar consultório',
    'fidelizar_pacientes': 'Melhorar retenção de pacientes',
    'diferenciar_mercado': 'Diferenciar no mercado'
  };
  return map[objective] || objective || 'Não informado';
}

function formatAestheticObjective(objective: string): string {
  const map: { [key: string]: string } = {
    'atrair_leads': 'Atrair leads qualificados',
    'aumentar_recorrencia': 'Aumentar recorrência',
    'elevar_ticket': 'Aumentar ticket médio',
    'autoridade_regiao': 'Ser referência na região'
  };
  return map[objective] || objective || 'Não informado';
}

function formatMedicalTicket(ticket: string): string {
  const map: { [key: string]: string } = {
    'ate_500': 'Até R$ 500',
    '500_1500': 'R$ 500 - R$ 1.500',
    '1500_3000': 'R$ 1.500 - R$ 3.000',
    '3000_5000': 'R$ 3.000 - R$ 5.000',
    'acima_5000': 'Acima de R$ 5.000'
  };
  return map[ticket] || ticket || 'Não informado';
}

function formatAestheticTicket(ticket: string): string {
  const map: { [key: string]: string } = {
    'ate_150': 'Até R$ 150',
    '150_300': 'R$ 150 - R$ 300',
    '300_600': 'R$ 300 - R$ 600',
    '600_1000': 'R$ 600 - R$ 1.000',
    'acima_1000': 'Acima de R$ 1.000'
  };
  return map[ticket] || ticket || 'Não informado';
}
