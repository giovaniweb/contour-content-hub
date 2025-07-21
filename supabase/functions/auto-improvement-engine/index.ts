import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action = 'analyze_and_improve' } = await req.json();

    console.log('Auto-improvement engine started:', action);

    if (action === 'analyze_and_improve') {
      const improvements = await analyzeAndImprove();
      return new Response(JSON.stringify({ improvements }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'run_ab_tests') {
      const testResults = await runABTests();
      return new Response(JSON.stringify({ testResults }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'optimize_prompts') {
      const optimizations = await optimizePrompts();
      return new Response(JSON.stringify({ optimizations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Auto-improvement error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeAndImprove() {
  console.log('Analyzing system performance for improvements...');

  // 1. Analisar performance dos agentes
  const { data: agents } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('active', true);

  // 2. Analisar feedback dos usuários
  const { data: feedback } = await supabase
    .from('ai_feedback')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // 3. Analisar métricas de performance
  const { data: metrics } = await supabase
    .from('ai_performance_metrics')
    .select('*')
    .gte('metric_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const improvements = [];

  // Analisar cada agente
  for (const agent of agents || []) {
    const agentFeedback = feedback?.filter(f => f.ai_service === agent.name) || [];
    const agentMetrics = metrics?.filter(m => m.service_name === agent.name) || [];

    const improvement = await analyzeAgentPerformance(agent, agentFeedback, agentMetrics);
    if (improvement) {
      improvements.push(improvement);
    }
  }

  // Aplicar melhorias automáticas
  for (const improvement of improvements) {
    if (improvement.auto_apply && improvement.confidence > 0.8) {
      await applyImprovement(improvement);
    }
  }

  return improvements;
}

async function analyzeAgentPerformance(agent: any, feedback: any[], metrics: any[]) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

  const analysisPrompt = `Analise a performance do agente AI e sugira melhorias:

AGENTE: ${agent.name} (${agent.specialization})
PROMPT ATUAL: ${agent.system_prompt}

FEEDBACK DOS USUÁRIOS (últimos 7 dias):
${feedback.map(f => `- ${f.feedback_type}: ${JSON.stringify(f.user_feedback)}`).join('\n')}

MÉTRICAS DE PERFORMANCE:
${metrics.map(m => `- ${m.metric_date}: Rating: ${m.avg_rating}, Tempo: ${m.avg_response_time_ms}ms, Sucesso: ${(m.successful_requests/m.total_requests*100).toFixed(1)}%`).join('\n')}

Baseado nesta análise, forneça uma resposta JSON com:
1. problemas_identificados: lista de problemas específicos
2. melhorias_sugeridas: lista de melhorias concretas
3. novo_prompt: versão otimizada do prompt (se necessário)
4. confianca: score 0-1 da confiança na melhoria
5. auto_aplicavel: boolean se pode ser aplicado automaticamente

Seja específico e prático nas sugestões.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Você é um especialista em otimização de sistemas AI. Sempre responda em JSON válido.' 
        },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  
  try {
    const analysis = JSON.parse(data.choices[0].message.content);
    return {
      agent_id: agent.id,
      agent_name: agent.name,
      ...analysis,
      analysis_date: new Date().toISOString()
    };
  } catch (e) {
    console.error('Failed to parse improvement analysis:', e);
    return null;
  }
}

async function applyImprovement(improvement: any) {
  console.log('Applying improvement for agent:', improvement.agent_name);

  // 1. Backup do estado atual
  const { data: currentAgent } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('id', improvement.agent_id)
    .single();

  // 2. Registrar no log de auto-melhoramento
  const { data: logEntry } = await supabase
    .from('self_improvement_log')
    .insert({
      agent_id: improvement.agent_id,
      improvement_type: 'prompt_optimization',
      before_state: currentAgent,
      after_state: {
        ...currentAgent,
        system_prompt: improvement.novo_prompt || currentAgent.system_prompt
      },
      improvement_reason: improvement.problemas_identificados.join('; '),
      success_metrics: {
        confidence: improvement.confianca,
        auto_applied: true
      }
    })
    .select()
    .single();

  // 3. Aplicar a melhoria
  if (improvement.novo_prompt) {
    await supabase
      .from('ai_agents')
      .update({
        system_prompt: improvement.novo_prompt,
        updated_at: new Date().toISOString()
      })
      .eq('id', improvement.agent_id);
  }

  console.log('Improvement applied successfully for agent:', improvement.agent_name);
  return logEntry;
}

async function runABTests() {
  console.log('Running A/B tests for prompt optimization...');

  // 1. Buscar testes ativos
  const { data: activeTests } = await supabase
    .from('prompt_ab_tests')
    .select('*')
    .eq('status', 'active');

  const results = [];

  for (const test of activeTests || []) {
    // Verificar se o teste tem dados suficientes
    const { data: testResults } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('session_id', test.id);

    if (testResults && testResults.length >= 20) { // Mínimo de 20 interações
      const analysis = await analyzeABTest(test, testResults);
      
      if (analysis.confidence > 0.95) {
        // Aplicar o vencedor automaticamente
        await applyABTestWinner(test, analysis);
      }
      
      results.push(analysis);
    }
  }

  return results;
}

async function analyzeABTest(test: any, results: any[]) {
  const groupA = results.filter(r => r.context_data?.ab_test_group === 'A');
  const groupB = results.filter(r => r.context_data?.ab_test_group === 'B');

  const metricsA = calculateABMetrics(groupA);
  const metricsB = calculateABMetrics(groupB);

  const winner = metricsA.score > metricsB.score ? 'A' : 'B';
  const confidence = calculateStatisticalConfidence(metricsA, metricsB);

  return {
    test_id: test.id,
    test_name: test.test_name,
    group_a_metrics: metricsA,
    group_b_metrics: metricsB,
    winner: winner,
    confidence: confidence,
    improvement: Math.abs(metricsA.score - metricsB.score),
    sample_size_a: groupA.length,
    sample_size_b: groupB.length
  };
}

function calculateABMetrics(group: any[]) {
  if (group.length === 0) return { score: 0, avg_rating: 0, response_time: 0 };

  const ratings = group.map(g => g.user_feedback?.rating || 3).filter(r => r);
  const responseTimes = group.map(g => g.response_time_ms || 1000).filter(r => r);

  return {
    score: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    avg_rating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    response_time: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
    sample_size: group.length
  };
}

function calculateStatisticalConfidence(metricsA: any, metricsB: any): number {
  // Simplified statistical confidence calculation
  const sampleSizeA = metricsA.sample_size || 1;
  const sampleSizeB = metricsB.sample_size || 1;
  const effectSize = Math.abs(metricsA.score - metricsB.score);
  
  // Simplified confidence based on sample size and effect size
  const minSampleSize = Math.min(sampleSizeA, sampleSizeB);
  const baseConfidence = Math.min(minSampleSize / 50, 1); // Max confidence at 50+ samples
  const effectConfidence = Math.min(effectSize / 2, 1); // Max confidence at 2+ point difference
  
  return (baseConfidence + effectConfidence) / 2;
}

async function applyABTestWinner(test: any, analysis: any) {
  const winningPrompt = analysis.winner === 'A' ? test.prompt_a : test.prompt_b;

  // Atualizar o agente com o prompt vencedor
  await supabase
    .from('ai_agents')
    .update({ system_prompt: winningPrompt })
    .eq('id', test.agent_id);

  // Marcar o teste como completo
  await supabase
    .from('prompt_ab_tests')
    .update({
      status: 'completed',
      winner: analysis.winner,
      confidence_level: analysis.confidence,
      results: analysis,
      completed_at: new Date().toISOString()
    })
    .eq('id', test.id);

  console.log(`A/B test ${test.test_name} completed. Winner: ${analysis.winner}`);
}

async function optimizePrompts() {
  console.log('Optimizing prompts based on recent performance...');

  const { data: agents } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('active', true);

  const optimizations = [];

  for (const agent of agents || []) {
    // Buscar feedback recente do agente
    const { data: recentFeedback } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('ai_service', agent.name)
      .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (recentFeedback && recentFeedback.length >= 10) {
      const optimization = await generatePromptOptimization(agent, recentFeedback);
      if (optimization && optimization.confidence > 0.7) {
        // Criar A/B test para a otimização
        await createABTest(agent, optimization);
        optimizations.push(optimization);
      }
    }
  }

  return optimizations;
}

async function generatePromptOptimization(agent: any, feedback: any[]) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

  const optimizationPrompt = `Otimize o prompt do agente AI baseado no feedback dos usuários:

AGENTE: ${agent.name}
ESPECIALIZAÇÃO: ${agent.specialization}
PROMPT ATUAL: ${agent.system_prompt}

FEEDBACK RECENTE:
${feedback.slice(0, 10).map(f => 
  `- Feedback: ${JSON.stringify(f.user_feedback)} | Resposta: ${f.ai_response?.substring(0, 200)}...`
).join('\n')}

Crie uma versão otimizada do prompt que:
1. Mantenha a especialização e personalidade
2. Corrija problemas identificados no feedback
3. Melhore a qualidade das respostas
4. Seja mais preciso e útil

Responda em JSON com:
{
  "prompt_otimizado": "novo prompt",
  "melhorias_feitas": ["lista de melhorias"],
  "confianca": 0.8,
  "justificativa": "explicação das mudanças"
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Você é um especialista em otimização de prompts AI. Sempre responda em JSON válido.' 
        },
        { role: 'user', content: optimizationPrompt }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    console.error('Failed to parse prompt optimization:', e);
    return null;
  }
}

async function createABTest(agent: any, optimization: any) {
  await supabase
    .from('prompt_ab_tests')
    .insert({
      agent_id: agent.id,
      test_name: `Auto-optimization ${new Date().toISOString()}`,
      prompt_a: agent.system_prompt,
      prompt_b: optimization.prompt_otimizado,
      success_metric: 'user_satisfaction',
      traffic_split: 0.5,
      status: 'active'
    });

  console.log(`Created A/B test for agent ${agent.name}`);
}