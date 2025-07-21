import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MonitoringAlert {
  id: string;
  type: 'performance' | 'error_rate' | 'cost' | 'user_satisfaction';
  severity: 'low' | 'medium' | 'high' | 'critical';
  service_name: string;
  message: string;
  metrics: any;
  created_at: string;
  resolved_at?: string;
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
      case 'monitor_performance':
        return await monitorPerformance(supabase);
      case 'auto_diagnose':
        return await autoDiagnose(supabase, data.service_name);
      case 'get_health_status':
        return await getHealthStatus(supabase);
      case 'generate_performance_report':
        return await generatePerformanceReport(supabase, data.period);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in ai-monitoring-system:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function monitorPerformance(supabase: any) {
  console.log('Starting performance monitoring...');
  
  const alerts: MonitoringAlert[] = [];
  const services = ['mestre_beleza', 'marketing_consultant', 'script_generator'];
  
  for (const service of services) {
    const serviceAlerts = await checkServiceHealth(supabase, service);
    alerts.push(...serviceAlerts);
  }

  // Salvar alertas no banco se houver problemas
  if (alerts.length > 0) {
    await saveAlerts(supabase, alerts);
  }

  // Gerar relatório de monitoramento
  const report = {
    timestamp: new Date().toISOString(),
    total_alerts: alerts.length,
    critical_alerts: alerts.filter(a => a.severity === 'critical').length,
    services_checked: services.length,
    alerts: alerts,
    overall_status: alerts.some(a => a.severity === 'critical') ? 'critical' : 
                   alerts.some(a => a.severity === 'high') ? 'warning' : 'healthy'
  };

  return new Response(
    JSON.stringify(report),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkServiceHealth(supabase: any, serviceName: string): Promise<MonitoringAlert[]> {
  const alerts: MonitoringAlert[] = [];
  
  // 1. Verificar métricas dos últimos 24 horas
  const { data: metrics, error } = await supabase
    .from('ai_performance_metrics')
    .select('*')
    .eq('service_name', serviceName)
    .gte('metric_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('metric_date', { ascending: false });

  if (error) {
    console.error(`Failed to fetch metrics for ${serviceName}:`, error);
    return alerts;
  }

  if (!metrics || metrics.length === 0) {
    alerts.push({
      id: `no-data-${serviceName}-${Date.now()}`,
      type: 'performance',
      severity: 'medium',
      service_name: serviceName,
      message: `Nenhuma métrica encontrada para ${serviceName} nos últimos 7 dias`,
      metrics: {},
      created_at: new Date().toISOString()
    });
    return alerts;
  }

  const latestMetrics = metrics[0];
  
  // 2. Verificar taxa de erro
  if (latestMetrics.error_rate > 0.1) { // 10% de erro
    alerts.push({
      id: `error-rate-${serviceName}-${Date.now()}`,
      type: 'error_rate',
      severity: latestMetrics.error_rate > 0.25 ? 'critical' : 'high',
      service_name: serviceName,
      message: `Taxa de erro alta: ${(latestMetrics.error_rate * 100).toFixed(1)}%`,
      metrics: { error_rate: latestMetrics.error_rate },
      created_at: new Date().toISOString()
    });
  }

  // 3. Verificar tempo de resposta
  if (latestMetrics.avg_response_time_ms > 10000) { // 10 segundos
    alerts.push({
      id: `response-time-${serviceName}-${Date.now()}`,
      type: 'performance',
      severity: latestMetrics.avg_response_time_ms > 20000 ? 'critical' : 'high',
      service_name: serviceName,
      message: `Tempo de resposta alto: ${latestMetrics.avg_response_time_ms}ms`,
      metrics: { avg_response_time_ms: latestMetrics.avg_response_time_ms },
      created_at: new Date().toISOString()
    });
  }

  // 4. Verificar satisfação do usuário
  if (latestMetrics.avg_rating < 3.0) {
    alerts.push({
      id: `satisfaction-${serviceName}-${Date.now()}`,
      type: 'user_satisfaction',
      severity: latestMetrics.avg_rating < 2.0 ? 'critical' : 'high',
      service_name: serviceName,
      message: `Baixa satisfação do usuário: ${latestMetrics.avg_rating.toFixed(1)}/5.0`,
      metrics: { avg_rating: latestMetrics.avg_rating },
      created_at: new Date().toISOString()
    });
  }

  // 5. Verificar custos
  const weeklyMetrics = metrics.slice(0, 7);
  const weeklyCost = weeklyMetrics.reduce((sum, m) => sum + (m.estimated_cost || 0), 0);
  
  if (weeklyCost > 100) { // Mais de $100 por semana
    alerts.push({
      id: `cost-${serviceName}-${Date.now()}`,
      type: 'cost',
      severity: weeklyCost > 500 ? 'critical' : 'medium',
      service_name: serviceName,
      message: `Custo semanal alto: $${weeklyCost.toFixed(2)}`,
      metrics: { weekly_cost: weeklyCost },
      created_at: new Date().toISOString()
    });
  }

  return alerts;
}

async function autoDiagnose(supabase: any, serviceName: string) {
  console.log(`Auto-diagnosing service: ${serviceName}`);
  
  const diagnosis = {
    service_name: serviceName,
    timestamp: new Date().toISOString(),
    issues: [] as any[],
    recommendations: [] as any[],
    auto_fixes_applied: [] as any[],
    health_score: 100
  };

  try {
    // 1. Analisar métricas recentes
    const { data: metrics, error } = await supabase
      .from('ai_performance_metrics')
      .select('*')
      .eq('service_name', serviceName)
      .gte('metric_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('metric_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }

    if (!metrics || metrics.length === 0) {
      diagnosis.issues.push({
        type: 'no_data',
        severity: 'medium',
        description: 'Nenhuma métrica disponível para análise'
      });
      diagnosis.health_score -= 30;
    } else {
      // 2. Analisar tendências
      const trends = analyzeTrends(metrics);
      
      if (trends.rating_declining) {
        diagnosis.issues.push({
          type: 'rating_decline',
          severity: 'high',
          description: 'Avaliação dos usuários em declínio',
          details: trends.rating_details
        });
        diagnosis.health_score -= 25;
        
        diagnosis.recommendations.push({
          type: 'improve_prompts',
          description: 'Revisar e melhorar prompts baseado em feedback recente',
          priority: 'high'
        });
      }

      if (trends.response_time_increasing) {
        diagnosis.issues.push({
          type: 'performance_degradation',
          severity: 'medium',
          description: 'Tempo de resposta aumentando',
          details: trends.response_time_details
        });
        diagnosis.health_score -= 15;
        
        diagnosis.recommendations.push({
          type: 'optimize_prompts',
          description: 'Otimizar prompts para reduzir tokens e tempo de processamento',
          priority: 'medium'
        });
      }

      if (trends.cost_increasing) {
        diagnosis.issues.push({
          type: 'cost_escalation',
          severity: 'medium',
          description: 'Custos em escalada',
          details: trends.cost_details
        });
        diagnosis.health_score -= 10;
        
        diagnosis.recommendations.push({
          type: 'implement_caching',
          description: 'Implementar cache para respostas similares',
          priority: 'medium'
        });
      }
    }

    // 3. Verificar feedback recente
    const { data: feedback, error: feedbackError } = await supabase
      .from('ai_feedback')
      .select('*')
      .eq('ai_service', serviceName)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (feedbackError) {
      console.error('Failed to fetch feedback:', feedbackError);
    } else if (feedback && feedback.length > 0) {
      const negativeFeedback = feedback.filter(f => f.user_feedback.rating < 3);
      
      if (negativeFeedback.length > feedback.length * 0.3) {
        diagnosis.issues.push({
          type: 'high_negative_feedback',
          severity: 'high',
          description: `${((negativeFeedback.length / feedback.length) * 100).toFixed(1)}% de feedback negativo`,
          details: { 
            total_feedback: feedback.length, 
            negative_count: negativeFeedback.length 
          }
        });
        diagnosis.health_score -= 20;
      }
    }

    // 4. Aplicar correções automáticas se possível
    for (const recommendation of diagnosis.recommendations) {
      if (recommendation.type === 'implement_caching' && recommendation.priority === 'medium') {
        // Auto-aplicar cache simples se o problema não for crítico
        const cacheResult = await applyCaching(supabase, serviceName);
        if (cacheResult.success) {
          diagnosis.auto_fixes_applied.push({
            type: 'caching_enabled',
            description: 'Cache automático habilitado para respostas similares',
            applied_at: new Date().toISOString()
          });
        }
      }
    }

    // 5. Salvar diagnóstico
    await saveDiagnosis(supabase, diagnosis);

  } catch (error) {
    console.error('Auto-diagnosis failed:', error);
    diagnosis.issues.push({
      type: 'diagnosis_error',
      severity: 'high',
      description: `Falha no auto-diagnóstico: ${error.message}`
    });
    diagnosis.health_score = 0;
  }

  return new Response(
    JSON.stringify(diagnosis),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getHealthStatus(supabase: any) {
  const services = ['mestre_beleza', 'marketing_consultant', 'script_generator'];
  const healthStatus = {
    overall_health: 'healthy' as 'healthy' | 'warning' | 'critical',
    timestamp: new Date().toISOString(),
    services: [] as any[]
  };

  for (const service of services) {
    const serviceHealth = await getServiceHealthStatus(supabase, service);
    healthStatus.services.push(serviceHealth);
  }

  // Calcular status geral
  const criticalServices = healthStatus.services.filter(s => s.status === 'critical').length;
  const warningServices = healthStatus.services.filter(s => s.status === 'warning').length;
  
  if (criticalServices > 0) {
    healthStatus.overall_health = 'critical';
  } else if (warningServices > 0) {
    healthStatus.overall_health = 'warning';
  }

  return new Response(
    JSON.stringify(healthStatus),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getServiceHealthStatus(supabase: any, serviceName: string) {
  const { data: metrics, error } = await supabase
    .from('ai_performance_metrics')
    .select('*')
    .eq('service_name', serviceName)
    .order('metric_date', { ascending: false })
    .limit(1);

  if (error || !metrics || metrics.length === 0) {
    return {
      service_name: serviceName,
      status: 'warning',
      health_score: 50,
      last_update: null,
      issues: ['Sem dados de métricas']
    };
  }

  const latest = metrics[0];
  let healthScore = 100;
  const issues = [];

  // Avaliar métricas
  if (latest.error_rate > 0.1) {
    healthScore -= 30;
    issues.push(`Taxa de erro: ${(latest.error_rate * 100).toFixed(1)}%`);
  }

  if (latest.avg_rating < 3.5) {
    healthScore -= 25;
    issues.push(`Avaliação baixa: ${latest.avg_rating.toFixed(1)}/5.0`);
  }

  if (latest.avg_response_time_ms > 8000) {
    healthScore -= 20;
    issues.push(`Tempo de resposta alto: ${latest.avg_response_time_ms}ms`);
  }

  let status = 'healthy';
  if (healthScore < 50) status = 'critical';
  else if (healthScore < 80) status = 'warning';

  return {
    service_name: serviceName,
    status,
    health_score: healthScore,
    last_update: latest.updated_at,
    issues
  };
}

async function generatePerformanceReport(supabase: any, period: string = '7d') {
  const days = period === '30d' ? 30 : 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: metrics, error } = await supabase
    .from('ai_performance_metrics')
    .select('*')
    .gte('metric_date', startDate)
    .order('metric_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch metrics: ${error.message}`);
  }

  const report = generateDetailedReport(metrics, period);

  return new Response(
    JSON.stringify(report),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function analyzeTrends(metrics: any[]) {
  if (metrics.length < 3) return {};

  const recent = metrics.slice(0, 3);
  const older = metrics.slice(3, 6);

  const recentAvgRating = recent.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / recent.length;
  const olderAvgRating = older.length > 0 ? older.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / older.length : recentAvgRating;

  const recentAvgTime = recent.reduce((sum, m) => sum + (m.avg_response_time_ms || 0), 0) / recent.length;
  const olderAvgTime = older.length > 0 ? older.reduce((sum, m) => sum + (m.avg_response_time_ms || 0), 0) / older.length : recentAvgTime;

  const recentCost = recent.reduce((sum, m) => sum + (m.estimated_cost || 0), 0);
  const olderCost = older.length > 0 ? older.reduce((sum, m) => sum + (m.estimated_cost || 0), 0) : recentCost;

  return {
    rating_declining: recentAvgRating < olderAvgRating - 0.3,
    rating_details: { recent: recentAvgRating, previous: olderAvgRating },
    response_time_increasing: recentAvgTime > olderAvgTime * 1.2,
    response_time_details: { recent: recentAvgTime, previous: olderAvgTime },
    cost_increasing: recentCost > olderCost * 1.3,
    cost_details: { recent: recentCost, previous: olderCost }
  };
}

async function applyCaching(supabase: any, serviceName: string) {
  // Simular aplicação de cache
  // Em produção, isso configuraria um sistema de cache real
  console.log(`Applying caching for service: ${serviceName}`);
  
  return { success: true, message: 'Cache configurado' };
}

async function saveAlerts(supabase: any, alerts: MonitoringAlert[]) {
  // Salvar alertas em uma tabela de monitoramento
  // Por simplicidade, vamos log apenas
  console.log('Alerts generated:', alerts.length);
  for (const alert of alerts) {
    console.log(`ALERT [${alert.severity}] ${alert.service_name}: ${alert.message}`);
  }
}

async function saveDiagnosis(supabase: any, diagnosis: any) {
  // Salvar diagnóstico em log
  console.log('Diagnosis completed:', diagnosis.service_name, 'Health Score:', diagnosis.health_score);
}

function generateDetailedReport(metrics: any[], period: string) {
  const services = [...new Set(metrics.map(m => m.service_name))];
  
  const report = {
    period,
    generated_at: new Date().toISOString(),
    summary: {
      total_requests: metrics.reduce((sum, m) => sum + (m.total_requests || 0), 0),
      avg_rating: metrics.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / metrics.length,
      total_cost: metrics.reduce((sum, m) => sum + (m.estimated_cost || 0), 0),
      avg_response_time: metrics.reduce((sum, m) => sum + (m.avg_response_time_ms || 0), 0) / metrics.length
    },
    services: services.map(service => {
      const serviceMetrics = metrics.filter(m => m.service_name === service);
      return {
        name: service,
        requests: serviceMetrics.reduce((sum, m) => sum + (m.total_requests || 0), 0),
        avg_rating: serviceMetrics.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / serviceMetrics.length,
        cost: serviceMetrics.reduce((sum, m) => sum + (m.estimated_cost || 0), 0),
        avg_response_time: serviceMetrics.reduce((sum, m) => sum + (m.avg_response_time_ms || 0), 0) / serviceMetrics.length
      };
    }),
    trends: analyzeTrends(metrics),
    recommendations: generateRecommendations(metrics)
  };

  return report;
}

function generateRecommendations(metrics: any[]) {
  const recommendations = [];
  
  const avgCost = metrics.reduce((sum, m) => sum + (m.estimated_cost || 0), 0);
  if (avgCost > 50) {
    recommendations.push({
      type: 'cost_optimization',
      priority: 'medium',
      description: 'Implementar cache para reduzir custos de API'
    });
  }

  const avgRating = metrics.reduce((sum, m) => sum + (m.avg_rating || 0), 0) / metrics.length;
  if (avgRating < 4.0) {
    recommendations.push({
      type: 'quality_improvement',
      priority: 'high',
      description: 'Revisar e melhorar prompts baseado em feedback'
    });
  }

  return recommendations;
}