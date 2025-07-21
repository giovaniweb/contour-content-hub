import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CacheEntry {
  id: string;
  cache_key: string;
  ai_service: string;
  prompt_hash: string;
  response_content: string;
  metadata: any;
  hit_count: number;
  cost_saved: number;
  created_at: string;
  expires_at: string;
  last_accessed: string;
}

interface PromptCompression {
  original_prompt: string;
  compressed_prompt: string;
  compression_ratio: number;
  tokens_saved: number;
  estimated_cost_saving: number;
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

    const { action, data } = await req.json();

    switch (action) {
      case 'check_cache':
        return await checkCache(supabase, data);
      case 'store_cache':
        return await storeCache(supabase, data);
      case 'compress_prompt':
        return await compressPrompt(data.prompt, data.context);
      case 'optimize_costs':
        return await optimizeCosts(supabase, data.service_name);
      case 'cache_analytics':
        return await getCacheAnalytics(supabase);
      case 'cleanup_cache':
        return await cleanupCache(supabase);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in ai-cache-optimizer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function checkCache(supabase: any, data: any) {
  const { prompt, ai_service, context } = data;
  
  // Gerar hash do prompt para verificação de cache
  const promptHash = await generatePromptHash(prompt, context);
  
  console.log(`Checking cache for service: ${ai_service}, hash: ${promptHash}`);

  // Primeiro, criar tabela de cache se não existir
  await ensureCacheTable(supabase);

  // Verificar se existe entrada no cache
  const { data: cacheEntry, error } = await supabase
    .from('ai_response_cache')
    .select('*')
    .eq('ai_service', ai_service)
    .eq('prompt_hash', promptHash)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Cache check error:', error);
    return new Response(
      JSON.stringify({ 
        cache_hit: false, 
        error: 'Cache check failed' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (cacheEntry) {
    // Cache hit - atualizar contadores
    await supabase
      .from('ai_response_cache')
      .update({
        hit_count: (cacheEntry.hit_count || 0) + 1,
        last_accessed: new Date().toISOString()
      })
      .eq('id', cacheEntry.id);

    console.log('Cache HIT for prompt hash:', promptHash);

    return new Response(
      JSON.stringify({
        cache_hit: true,
        response: cacheEntry.response_content,
        metadata: cacheEntry.metadata,
        hit_count: (cacheEntry.hit_count || 0) + 1,
        cost_saved: calculateCostSaved(prompt)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Cache MISS for prompt hash:', promptHash);

  return new Response(
    JSON.stringify({
      cache_hit: false,
      prompt_hash: promptHash
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function storeCache(supabase: any, data: any) {
  const { 
    prompt, 
    ai_service, 
    response, 
    context, 
    prompt_hash, 
    tokens_used, 
    response_time_ms 
  } = data;

  console.log(`Storing cache for service: ${ai_service}, hash: ${prompt_hash}`);

  await ensureCacheTable(supabase);

  const cacheEntry = {
    cache_key: `${ai_service}_${prompt_hash}_${Date.now()}`,
    ai_service,
    prompt_hash,
    response_content: response,
    metadata: {
      original_prompt_length: prompt.length,
      tokens_used,
      response_time_ms,
      context_provided: !!context,
      cached_at: new Date().toISOString()
    },
    hit_count: 0,
    cost_saved: 0,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    last_accessed: new Date().toISOString()
  };

  const { data: result, error } = await supabase
    .from('ai_response_cache')
    .insert(cacheEntry)
    .select()
    .single();

  if (error) {
    console.error('Cache storage error:', error);
    throw new Error(`Failed to store cache: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      success: true,
      cache_id: result.id,
      expires_at: cacheEntry.expires_at
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function compressPrompt(prompt: string, context?: any): Promise<PromptCompression> {
  console.log('Compressing prompt...');
  
  const originalLength = prompt.length;
  let compressedPrompt = prompt;
  
  // 1. Remover palavras desnecessárias
  const stopWords = [
    'por favor', 'gentilmente', 'muito obrigado', 'se possível',
    'gostaria que', 'poderia', 'seria possível', 'deste modo',
    'desta forma', 'dessa maneira', 'com isso', 'portanto',
    'sendo assim', 'neste sentido', 'nesta perspectiva'
  ];
  
  for (const stopWord of stopWords) {
    const regex = new RegExp(`\\b${stopWord}\\b`, 'gi');
    compressedPrompt = compressedPrompt.replace(regex, '');
  }
  
  // 2. Condensar frases repetitivas
  compressedPrompt = compressedPrompt.replace(/\s+/g, ' '); // Múltiplos espaços
  compressedPrompt = compressedPrompt.replace(/\.\s*\.\s*/g, '. '); // Pontos duplos
  compressedPrompt = compressedPrompt.replace(/,\s*,/g, ','); // Vírgulas duplas
  
  // 3. Simplificar estruturas verbais
  const verbSimplifications = {
    'gostaria de saber': 'quero saber',
    'seria interessante': 'preciso',
    'é importante que': 'deve',
    'é necessário que': 'deve',
    'com o objetivo de': 'para',
    'a fim de': 'para',
    'no sentido de': 'para'
  };
  
  for (const [long, short] of Object.entries(verbSimplifications)) {
    const regex = new RegExp(long, 'gi');
    compressedPrompt = compressedPrompt.replace(regex, short);
  }
  
  // 4. Remover redundâncias contextuais
  if (context) {
    // Se há contexto, pode remover explicações básicas
    const contextualRemovals = [
      'como você sabe',
      'conforme mencionado',
      'é importante mencionar que',
      'vale ressaltar que',
      'cabe destacar que'
    ];
    
    for (const removal of contextualRemovals) {
      const regex = new RegExp(removal, 'gi');
      compressedPrompt = compressedPrompt.replace(regex, '');
    }
  }
  
  // 5. Limpar espaços extras
  compressedPrompt = compressedPrompt.trim().replace(/\s+/g, ' ');
  
  const finalLength = compressedPrompt.length;
  const compressionRatio = (originalLength - finalLength) / originalLength;
  const tokensOriginal = estimateTokens(prompt);
  const tokensCompressed = estimateTokens(compressedPrompt);
  const tokensSaved = tokensOriginal - tokensCompressed;
  
  return {
    original_prompt: prompt,
    compressed_prompt: compressedPrompt,
    compression_ratio: compressionRatio,
    tokens_saved: tokensSaved,
    estimated_cost_saving: tokensSaved * 0.000002 // Aproximadamente $0.002 per 1K tokens
  };
}

async function optimizeCosts(supabase: any, serviceName: string) {
  console.log(`Optimizing costs for service: ${serviceName}`);
  
  const optimization = {
    service_name: serviceName,
    analysis_date: new Date().toISOString(),
    current_costs: 0,
    potential_savings: 0,
    recommendations: [] as any[],
    cache_opportunities: [] as any[]
  };

  try {
    // 1. Analisar custos atuais
    const { data: metrics, error } = await supabase
      .from('ai_performance_metrics')
      .select('*')
      .eq('service_name', serviceName)
      .gte('metric_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('metric_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }

    if (metrics && metrics.length > 0) {
      optimization.current_costs = metrics.reduce((sum, m) => sum + (m.estimated_cost || 0), 0);
    }

    // 2. Analisar padrões de cache
    await ensureCacheTable(supabase);
    
    const { data: cacheData, error: cacheError } = await supabase
      .from('ai_response_cache')
      .select('*')
      .eq('ai_service', serviceName)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!cacheError && cacheData) {
      const totalHits = cacheData.reduce((sum, entry) => sum + (entry.hit_count || 0), 0);
      const totalSaved = cacheData.reduce((sum, entry) => sum + (entry.cost_saved || 0), 0);
      
      optimization.cache_opportunities.push({
        type: 'current_cache_performance',
        description: `Cache atual salvou $${totalSaved.toFixed(2)} com ${totalHits} hits`,
        potential_improvement: totalHits > 0 ? 'Cache funcionando bem' : 'Aumentar período de cache'
      });
    }

    // 3. Analisar prompts para compressão
    const { data: recentFeedback, error: feedbackError } = await supabase
      .from('ai_feedback')
      .select('prompt_used')
      .eq('ai_service', serviceName)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .limit(100);

    if (!feedbackError && recentFeedback && recentFeedback.length > 0) {
      let totalCompressionSavings = 0;
      
      for (const feedback of recentFeedback.slice(0, 10)) { // Analisar apenas 10 exemplos
        const compression = await compressPrompt(feedback.prompt_used);
        totalCompressionSavings += compression.estimated_cost_saving;
      }
      
      const projectedMonthlySavings = (totalCompressionSavings / 10) * (recentFeedback.length * 4); // Projeção mensal
      
      if (projectedMonthlySavings > 5) { // Se economia > $5/mês
        optimization.recommendations.push({
          type: 'prompt_compression',
          description: 'Implementar compressão automática de prompts',
          potential_monthly_savings: projectedMonthlySavings,
          priority: projectedMonthlySavings > 20 ? 'high' : 'medium'
        });
        optimization.potential_savings += projectedMonthlySavings;
      }
    }

    // 4. Recomendações baseadas em volume
    if (optimization.current_costs > 50) {
      optimization.recommendations.push({
        type: 'cache_extension',
        description: 'Estender período de cache de 7 para 30 dias',
        potential_monthly_savings: optimization.current_costs * 0.3,
        priority: 'high'
      });
      optimization.potential_savings += optimization.current_costs * 0.3;
    }

    if (optimization.current_costs > 100) {
      optimization.recommendations.push({
        type: 'model_optimization',
        description: 'Considerar usar modelos mais eficientes para tarefas simples',
        potential_monthly_savings: optimization.current_costs * 0.4,
        priority: 'high'
      });
      optimization.potential_savings += optimization.current_costs * 0.4;
    }

    // 5. Implementar otimizações automáticas
    const autoOptimizations = await applyAutoOptimizations(supabase, serviceName, optimization);
    optimization.auto_applied = autoOptimizations;

  } catch (error) {
    console.error('Cost optimization failed:', error);
    optimization.error = error.message;
  }

  return new Response(
    JSON.stringify(optimization),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getCacheAnalytics(supabase: any) {
  await ensureCacheTable(supabase);
  
  const { data: cacheData, error } = await supabase
    .from('ai_response_cache')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    throw new Error(`Failed to fetch cache analytics: ${error.message}`);
  }

  const analytics = {
    total_entries: cacheData?.length || 0,
    total_hits: cacheData?.reduce((sum, entry) => sum + (entry.hit_count || 0), 0) || 0,
    total_cost_saved: cacheData?.reduce((sum, entry) => sum + (entry.cost_saved || 0), 0) || 0,
    hit_rate: 0,
    by_service: {} as any,
    cache_efficiency: 'low' as 'low' | 'medium' | 'high'
  };

  if (cacheData && cacheData.length > 0) {
    // Calcular hit rate
    const totalRequests = cacheData.reduce((sum, entry) => sum + (entry.hit_count || 0), 0) + cacheData.length;
    analytics.hit_rate = totalRequests > 0 ? (analytics.total_hits / totalRequests) * 100 : 0;

    // Agrupar por serviço
    const serviceGroups = cacheData.reduce((groups, entry) => {
      const service = entry.ai_service;
      if (!groups[service]) {
        groups[service] = {
          entries: 0,
          hits: 0,
          cost_saved: 0
        };
      }
      groups[service].entries += 1;
      groups[service].hits += entry.hit_count || 0;
      groups[service].cost_saved += entry.cost_saved || 0;
      return groups;
    }, {});

    analytics.by_service = serviceGroups;

    // Determinar eficiência
    if (analytics.hit_rate > 30) analytics.cache_efficiency = 'high';
    else if (analytics.hit_rate > 15) analytics.cache_efficiency = 'medium';
  }

  return new Response(
    JSON.stringify(analytics),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function cleanupCache(supabase: any) {
  await ensureCacheTable(supabase);
  
  console.log('Starting cache cleanup...');
  
  // Remover entradas expiradas
  const { data: expired, error: expiredError } = await supabase
    .from('ai_response_cache')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select();

  // Remover entradas antigas com 0 hits (não utilizadas em 30 dias)
  const { data: unused, error: unusedError } = await supabase
    .from('ai_response_cache')
    .delete()
    .eq('hit_count', 0)
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .select();

  const cleanup = {
    expired_removed: expired?.length || 0,
    unused_removed: unused?.length || 0,
    cleanup_date: new Date().toISOString(),
    errors: []
  };

  if (expiredError) cleanup.errors.push(`Expired cleanup error: ${expiredError.message}`);
  if (unusedError) cleanup.errors.push(`Unused cleanup error: ${unusedError.message}`);

  return new Response(
    JSON.stringify(cleanup),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Funções auxiliares

async function ensureCacheTable(supabase: any) {
  // Verificar se tabela existe, se não, criar
  const { error } = await supabase
    .from('ai_response_cache')
    .select('id')
    .limit(1);

  if (error && error.message.includes('does not exist')) {
    console.log('Creating ai_response_cache table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.ai_response_cache (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        cache_key TEXT NOT NULL UNIQUE,
        ai_service TEXT NOT NULL,
        prompt_hash TEXT NOT NULL,
        response_content TEXT NOT NULL,
        metadata JSONB DEFAULT '{}',
        hit_count INTEGER DEFAULT 0,
        cost_saved DOUBLE PRECISION DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      CREATE INDEX IF NOT EXISTS idx_cache_service_hash ON public.ai_response_cache(ai_service, prompt_hash);
      CREATE INDEX IF NOT EXISTS idx_cache_expires ON public.ai_response_cache(expires_at);
      CREATE INDEX IF NOT EXISTS idx_cache_created ON public.ai_response_cache(created_at);
      
      ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.ai_response_cache FORCE ROW LEVEL SECURITY;
      
      CREATE POLICY "Cache is public for reading" ON public.ai_response_cache FOR SELECT USING (true);
      CREATE POLICY "System can manage cache" ON public.ai_response_cache FOR ALL USING (true);
    `;

    await supabase.rpc('exec_sql', { sql: createTableSQL });
  }
}

async function generatePromptHash(prompt: string, context?: any): Promise<string> {
  const content = prompt + (context ? JSON.stringify(context) : '');
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16); // Usar apenas primeiros 16 caracteres
}

function calculateCostSaved(prompt: string): number {
  const estimatedTokens = estimateTokens(prompt);
  return (estimatedTokens / 1000) * 0.002; // Aproximadamente $0.002 per 1K tokens
}

function estimateTokens(text: string): number {
  // Estimativa aproximada: 1 token ≈ 4 caracteres em português
  return Math.ceil(text.length / 4);
}

async function applyAutoOptimizations(supabase: any, serviceName: string, optimization: any) {
  const applied = [];
  
  // Auto-aplicar extensão de cache se economia for significativa
  const cacheRecommendation = optimization.recommendations.find(r => r.type === 'cache_extension');
  if (cacheRecommendation && cacheRecommendation.potential_monthly_savings > 20) {
    // Estender período de cache automaticamente
    await supabase
      .from('ai_response_cache')
      .update({
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      })
      .eq('ai_service', serviceName)
      .gt('expires_at', new Date().toISOString());
    
    applied.push({
      type: 'cache_extension_applied',
      description: 'Período de cache estendido para 30 dias',
      applied_at: new Date().toISOString()
    });
  }
  
  return applied;
}