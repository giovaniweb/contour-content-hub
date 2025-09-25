import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackData {
  user_id: string;
  session_id: string;
  ai_service: string;
  prompt_used: string;
  ai_response: string;
  user_feedback: {
    rating: number;
    helpful: boolean;
    accuracy: number;
    relevance: number;
    comments?: string;
  };
  context_data?: any;
  response_time_ms?: number;
  tokens_used?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, action } = await req.json();

    switch (action) {
      case 'submit_feedback':
        return await submitFeedback(supabase, data);
      case 'analyze_feedback':
        return await analyzeFeedback(supabase, data.service_name);
      case 'auto_improve_prompts':
        return await autoImprovePrompts(supabase, data.service_name);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in ai-feedback-processor:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function submitFeedback(supabase: any, feedbackData: FeedbackData) {
  console.log('Submitting feedback:', feedbackData);

  // 1. Registrar feedback
  const { data: feedback, error: feedbackError } = await supabase
    .rpc('register_ai_feedback', {
      p_user_id: feedbackData.user_id,
      p_session_id: feedbackData.session_id,
      p_ai_service: feedbackData.ai_service,
      p_prompt_used: feedbackData.prompt_used,
      p_ai_response: feedbackData.ai_response,
      p_user_feedback: feedbackData.user_feedback,
      p_feedback_type: 'explicit',
      p_context_data: feedbackData.context_data || {},
      p_response_time_ms: feedbackData.response_time_ms,
      p_tokens_used: feedbackData.tokens_used
    });

  if (feedbackError) {
    throw new Error(`Feedback registration failed: ${feedbackError.message}`);
  }

  // 2. Atualizar métricas de performance
  await supabase.rpc('update_ai_performance_metrics', {
    p_service_name: feedbackData.ai_service,
    p_success: feedbackData.user_feedback.rating >= 3,
    p_response_time_ms: feedbackData.response_time_ms,
    p_rating: feedbackData.user_feedback.rating,
    p_tokens_used: feedbackData.tokens_used,
    p_estimated_cost: calculateCost(feedbackData.tokens_used, feedbackData.ai_service)
  });

  // 3. Trigger análise automática se feedback for negativo
  if (feedbackData.user_feedback.rating < 3) {
    console.log('Low rating detected, triggering analysis...');
    await analyzeFeedback(supabase, feedbackData.ai_service);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      feedback_id: feedback,
      message: 'Feedback processado com sucesso' 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeFeedback(supabase: any, serviceName: string) {
  console.log('Analyzing feedback for service:', serviceName);

  // 1. Buscar feedback recente com ratings baixos
  const { data: negativeFeedback, error } = await supabase
    .from('ai_feedback')
    .select('*')
    .eq('ai_service', serviceName)
    .lte('user_feedback->rating', 2)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // últimos 7 dias
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to fetch feedback: ${error.message}`);
  }

  if (!negativeFeedback || negativeFeedback.length === 0) {
    console.log('No negative feedback found for analysis');
    return new Response(
      JSON.stringify({ message: 'Nenhum feedback negativo encontrado' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // 2. Analisar padrões nos feedbacks negativos
  const patterns = analyzePatterns(negativeFeedback);
  
  // 3. Gerar recomendações de melhoria
  const improvements = await generateImprovements(supabase, serviceName, patterns);

  // 4. Registrar no log de aprendizado
  const { error: logError } = await supabase
    .from('ai_learning_log')
    .insert({
      service_name: serviceName,
      learning_type: 'feedback_analysis',
      trigger_event: 'negative_feedback_pattern',
      before_state: { patterns },
      after_state: { improvements },
      improvement_metrics: patterns.metrics,
      confidence_score: patterns.confidence
    });

  if (logError) {
    console.error('Failed to log learning:', logError);
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      patterns,
      improvements,
      message: 'Análise de feedback concluída' 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function autoImprovePrompts(supabase: any, serviceName: string) {
  console.log('Auto-improving prompts for service:', serviceName);

  try {
    // 1. Buscar template atual
    const { data: currentTemplate, error: templateError } = await supabase
      .from('ai_prompt_templates')
      .select('*')
      .eq('service_name', serviceName)
      .eq('is_active', true)
      .single();

    if (templateError) {
      throw new Error(`Failed to fetch current template: ${templateError.message}`);
    }

    // 2. Analisar feedback recente
    const { data: recentFeedback, error: feedbackError } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('ai_service', serviceName)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // últimos 30 dias
      .order('created_at', { ascending: false });

    if (feedbackError) {
      throw new Error(`Failed to fetch feedback: ${feedbackError.message}`);
    }

    // 3. Calcular métricas de performance atual
    const avgRating = recentFeedback.reduce((sum: number, f: any) => sum + (f.user_feedback.rating || 0), 0) / recentFeedback.length;
    const lowRatingCount = recentFeedback.filter((f: any) => f.user_feedback.rating < 3).length;
    
    // 4. Só melhorar se performance estiver abaixo do threshold
    if (avgRating >= 4.0 && lowRatingCount < recentFeedback.length * 0.2) {
      return new Response(
        JSON.stringify({ 
          message: 'Performance já está boa, não é necessário ajuste',
          current_rating: avgRating 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Gerar versão melhorada do prompt usando IA
    const improvedPrompt = await generateImprovedPrompt(
      currentTemplate.prompt_template,
      currentTemplate.system_instructions,
      recentFeedback
    );

    // 6. Criar nova versão do template
    const newVersion = `v${Date.now()}`;
    const { data: newTemplate, error: insertError } = await supabase
      .from('ai_prompt_templates')
      .insert({
        service_name: serviceName,
        prompt_version: newVersion,
        prompt_template: improvedPrompt.template,
        system_instructions: improvedPrompt.instructions,
        parameters: improvedPrompt.parameters,
        auto_generated: true,
        is_active: false // Não ativar automaticamente
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create new template: ${insertError.message}`);
    }

    // 7. Log da melhoria
    const { error: logError } = await supabase
      .from('ai_learning_log')
      .insert({
        service_name: serviceName,
        learning_type: 'prompt_adjustment',
        trigger_event: 'low_performance_auto_improvement',
        before_state: { 
          template: currentTemplate,
          avg_rating: avgRating,
          low_rating_percentage: lowRatingCount / recentFeedback.length
        },
        after_state: { 
          new_template: newTemplate,
          improvements: improvedPrompt.improvements
        },
        confidence_score: improvedPrompt.confidence,
        improvement_metrics: {
          expected_rating_improvement: improvedPrompt.expected_improvement,
          feedback_count: recentFeedback.length
        }
      });

    if (logError) {
      console.error('Failed to log improvement:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        new_template: newTemplate,
        improvements: improvedPrompt.improvements,
        confidence: improvedPrompt.confidence,
        message: 'Novo template de prompt gerado com melhorias baseadas em feedback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auto-improvement failed:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

function analyzePatterns(feedbacks: any[]) {
  console.log('Analyzing patterns in feedback...');
  
  const patterns = {
    common_complaints: [] as string[],
    accuracy_issues: 0,
    relevance_issues: 0,
    helpfulness_issues: 0,
    response_time_issues: 0,
    metrics: {
      avg_rating: 0,
      total_feedback: feedbacks.length,
      accuracy_score: 0,
      relevance_score: 0
    },
    confidence: 0.7
  };

  if (feedbacks.length === 0) return patterns;

  // Calcular métricas
  patterns.metrics.avg_rating = feedbacks.reduce((sum, f) => sum + (f.user_feedback.rating || 0), 0) / feedbacks.length;
  patterns.metrics.accuracy_score = feedbacks.reduce((sum, f) => sum + (f.user_feedback.accuracy || 0), 0) / feedbacks.length;
  patterns.metrics.relevance_score = feedbacks.reduce((sum, f) => sum + (f.user_feedback.relevance || 0), 0) / feedbacks.length;

  // Identificar problemas específicos
  patterns.accuracy_issues = feedbacks.filter(f => f.user_feedback.accuracy < 3).length;
  patterns.relevance_issues = feedbacks.filter(f => f.user_feedback.relevance < 3).length;
  patterns.helpfulness_issues = feedbacks.filter(f => !f.user_feedback.helpful).length;

  // Analisar comentários para encontrar padrões
  const comments = feedbacks
    .map(f => f.user_feedback.comments)
    .filter(c => c && c.length > 0);

  patterns.common_complaints = extractCommonComplaints(comments);

  return patterns;
}

function extractCommonComplaints(comments: string[]) {
  const commonPhrases = [
    'muito genérico',
    'não específico',
    'resposta vaga',
    'falta de detalhes',
    'não respondeu a pergunta',
    'informação incorreta',
    'muito longo',
    'muito curto',
    'não entendeu o contexto'
  ];

  return commonPhrases.filter(phrase => 
    comments.some(comment => 
      comment.toLowerCase().includes(phrase)
    )
  );
}

async function generateImprovements(supabase: any, serviceName: string, patterns: any) {
  const improvements = [];

  if (patterns.accuracy_issues > patterns.metrics.total_feedback * 0.3) {
    improvements.push({
      type: 'accuracy',
      description: 'Melhorar precisão das respostas',
      suggestion: 'Adicionar mais contexto específico ao prompt e validação de informações'
    });
  }

  if (patterns.relevance_issues > patterns.metrics.total_feedback * 0.3) {
    improvements.push({
      type: 'relevance',
      description: 'Aumentar relevância das respostas',
      suggestion: 'Melhorar compreensão do contexto e focar na pergunta específica'
    });
  }

  if (patterns.common_complaints.includes('muito genérico')) {
    improvements.push({
      type: 'specificity',
      description: 'Tornar respostas mais específicas',
      suggestion: 'Adicionar exemplos concretos e detalhes técnicos relevantes'
    });
  }

  return improvements;
}

async function generateImprovedPrompt(currentTemplate: string, currentInstructions: string, feedback: any[]) {
  // Simular geração de prompt melhorado baseado em feedback
  // Em produção, isso usaria uma IA para analisar e melhorar o prompt
  
  const improvements = [];
  let newTemplate = currentTemplate;
  let newInstructions = currentInstructions;
  
  // Analisar feedback para identificar melhorias
  const lowRatingFeedback = feedback.filter(f => f.user_feedback.rating < 3);
  const commonIssues = extractCommonComplaints(
    lowRatingFeedback.map(f => f.user_feedback.comments).filter(Boolean)
  );

  if (commonIssues.includes('muito genérico')) {
    newTemplate += ' Forneça exemplos específicos e detalhes técnicos relevantes.';
    newInstructions += ' Sempre inclua exemplos práticos e informações específicas.';
    improvements.push('Adicionado foco em especificidade e exemplos');
  }

  if (commonIssues.includes('não específico')) {
    newTemplate += ' Seja preciso e direto na resposta.';
    improvements.push('Adicionado foco em precisão');
  }

  return {
    template: newTemplate,
    instructions: newInstructions,
    parameters: {},
    improvements,
    confidence: 0.8,
    expected_improvement: 0.5 // Expectativa de melhoria de 0.5 pontos na avaliação
  };
}

function calculateCost(tokens: number | undefined, service: string): number {
  if (!tokens) return 0;
  
  // Preços aproximados por 1K tokens (ajustar conforme modelo usado)
  const prices = {
    'mestre_beleza': 0.002, // GPT-4o-mini
    'marketing_consultant': 0.002,
    'script_generator': 0.002,
    'default': 0.002
  };
  
  return (tokens / 1000) * (prices[service as keyof typeof prices] || prices.default);
}