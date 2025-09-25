import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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
    const { 
      task, 
      userId, 
      sessionId, 
      requiredSpecializations = [],
      coordinationPattern = 'sequential' 
    } = await req.json();

    console.log('Multi-agent coordination request:', { task, userId, requiredSpecializations });

    // 1. Selecionar agentes apropriados
    const { data: agents, error: agentsError } = await supabase
      .from('ai_agents')
      .select('*')
      .in('specialization', requiredSpecializations)
      .eq('active', true);

    if (agentsError) throw agentsError;

    if (!agents || agents.length === 0) {
      throw new Error('No suitable agents found for the task');
    }

    // 2. Criar sessão multi-agente
    const { data: session, error: sessionError } = await supabase
      .from('multi_agent_sessions')
      .insert({
        user_id: userId,
        session_name: `Task: ${task.substring(0, 50)}...`,
        agents_involved: agents.map(a => a.id),
        primary_objective: task,
        coordination_pattern: coordinationPattern,
        session_context: { original_request: task }
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 3. Coordenar agentes baseado no padrão
    let results = {};
    
    if (coordinationPattern === 'sequential') {
      results = await coordinateSequentially(agents, task, sessionId);
    } else if (coordinationPattern === 'parallel') {
      results = await coordinateInParallel(agents, task, sessionId);
    } else if (coordinationPattern === 'hierarchical') {
      results = await coordinateHierarchically(agents, task, sessionId);
    }

    // 4. Atualizar sessão com resultados
    const { error: updateError } = await supabase
      .from('multi_agent_sessions')
      .update({
        results: results,
        current_phase: 'completed',
        completed_at: new Date().toISOString(),
        performance_score: calculatePerformanceScore(results)
      })
      .eq('id', session.id);

    if (updateError) throw updateError;

    // 5. Armazenar na memória do usuário
    await supabase.rpc('store_user_memory', {
      p_user_id: userId,
      p_memory_type: 'interaction',
      p_key: `multi_agent_task_${Date.now()}`,
      p_value: {
        task: task,
        agents_used: agents.map(a => a.name),
        coordination_pattern: coordinationPattern,
        performance_score: (results as any).performance_score,
        timestamp: new Date().toISOString()
      },
      p_importance: 0.8
    });

    return new Response(JSON.stringify({
      success: true,
      sessionId: session.id,
      results: results,
      agents_used: agents.map(a => ({ name: a.name, specialization: a.specialization })),
      coordination_pattern: coordinationPattern,
      performance_score: (results as any).performance_score
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Multi-agent coordination error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function coordinateSequentially(agents: any[], task: string, sessionId: string) {
  const results: any = { responses: [], coordination_type: 'sequential' };
  let previousOutput = task;

  for (const agent of agents) {
    const response = await callSpecializedAgent(agent, previousOutput, sessionId);
    results.responses.push({
      agent: agent.name,
      specialization: agent.specialization,
      input: previousOutput,
      output: response,
      timestamp: new Date().toISOString()
    });
    previousOutput = response; // Output de um agente vira input do próximo
  }

  return results;
}

async function coordinateInParallel(agents: any[], task: string, sessionId: string) {
  const promises = agents.map(agent => 
    callSpecializedAgent(agent, task, sessionId).then(response => ({
      agent: agent.name,
      specialization: agent.specialization,
      output: response,
      timestamp: new Date().toISOString()
    }))
  );

  const responses = await Promise.all(promises);
  
  return {
    responses: responses,
    coordination_type: 'parallel',
    synthesis: await synthesizeParallelResults(responses)
  };
}

async function coordinateHierarchically(agents: any[], task: string, sessionId: string) {
  // Usar o coordinator agent como master
  const coordinator = agents.find(a => a.specialization === 'coordination');
  const specialists = agents.filter(a => a.specialization !== 'coordination');
  
  if (!coordinator) {
    throw new Error('Hierarchical coordination requires a coordinator agent');
  }

  // 1. Coordinator planeja a execução
  const plan = await callSpecializedAgent(coordinator, 
    `Crie um plano de execução para a tarefa: "${task}". Agentes disponíveis: ${specialists.map(s => s.specialization).join(', ')}`, 
    sessionId
  );

  // 2. Executar especialistas baseado no plano
  const specialistResults = [];
  for (const specialist of specialists) {
    const specializedTask = `Baseado no plano: ${plan}\n\nSua tarefa específica como ${specialist.specialization}: ${task}`;
    const response = await callSpecializedAgent(specialist, specializedTask, sessionId);
    specialistResults.push({
      agent: specialist.name,
      specialization: specialist.specialization,
      output: response,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Coordinator sintetiza os resultados
  const finalSynthesis = await callSpecializedAgent(coordinator,
    `Sintetize os resultados dos especialistas em uma resposta final coerente:\n\n${JSON.stringify(specialistResults, null, 2)}`,
    sessionId
  );

  return {
    plan: plan,
    specialist_outputs: specialistResults,
    final_synthesis: finalSynthesis,
    coordination_type: 'hierarchical'
  };
}

async function callSpecializedAgent(agent: any, input: string, sessionId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: agent.system_prompt },
        { role: 'user', content: input }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function synthesizeParallelResults(responses: any[]) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  const synthesisPrompt = `Sintetize as respostas dos diferentes especialistas em uma resposta coerente e abrangente:

${responses.map(r => `${r.specialization}: ${r.output}`).join('\n\n')}

Crie uma síntese que combine os insights de todos os especialistas de forma harmoniosa.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é um sintetizador especializado em combinar insights de múltiplos especialistas.' },
        { role: 'user', content: synthesisPrompt }
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function calculatePerformanceScore(results: any): number {
  // Calcular score baseado na qualidade e completude das respostas
  let score = 0.5; // Base score
  
  if (results.responses && results.responses.length > 0) {
    score += 0.2; // Bonus por ter respostas
  }
  
  if (results.coordination_type === 'hierarchical' && results.final_synthesis) {
    score += 0.2; // Bonus por síntese hierárquica
  }
  
  if (results.synthesis) {
    score += 0.1; // Bonus por síntese paralela
  }
  
  return Math.min(score, 1.0);
}