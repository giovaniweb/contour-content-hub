
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const authorization = req.headers.get('Authorization')
    if (authorization) {
      supabaseClient.auth.setSession({
        access_token: authorization.replace('Bearer ', ''),
        refresh_token: ''
      })
    }

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { action, instagram_config } = await req.json()

    switch (action) {
      case 'fetch_analytics':
        return await fetchInstagramAnalytics(supabaseClient, user.id, instagram_config)
      case 'analyze_engagement':
        return await analyzeEngagement(supabaseClient, user.id, instagram_config)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})

async function fetchInstagramAnalytics(supabaseClient: any, userId: string, config: any) {
  const { access_token, instagram_user_id } = config

  try {
    // Fetch basic account info
    const accountResponse = await fetch(
      `https://graph.instagram.com/${instagram_user_id}?fields=account_type,media_count,followers_count,follows_count,username&access_token=${access_token}`
    )
    const accountData = await accountResponse.json()

    // Fetch recent media for engagement calculation
    const mediaResponse = await fetch(
      `https://graph.instagram.com/${instagram_user_id}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,reach,impressions&limit=25&access_token=${access_token}`
    )
    const mediaData = await mediaResponse.json()

    // Calculate engagement metrics
    const analytics = calculateEngagementMetrics(accountData, mediaData.data || [])

    // Store analytics in database
    const { error } = await supabaseClient
      .from('instagram_analytics')
      .insert({
        user_id: userId,
        instagram_user_id,
        followers_count: accountData.followers_count,
        following_count: accountData.follows_count,
        media_count: accountData.media_count,
        reach: analytics.avgReach,
        impressions: analytics.avgImpressions,
        engagement_rate: analytics.engagementRate,
        post_frequency: analytics.postFrequency,
        data_snapshot: {
          account_data: accountData,
          recent_media: mediaData.data?.slice(0, 10) || []
        }
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        analytics: {
          ...accountData,
          ...analytics
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Instagram API Error:', error)
    throw new Error('Failed to fetch Instagram analytics')
  }
}

async function analyzeEngagement(supabaseClient: any, userId: string, config: any) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // Get latest analytics data
  const { data: analytics } = await supabaseClient
    .from('instagram_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!analytics) {
    throw new Error('No analytics data found. Please fetch analytics first.')
  }

  // Get user profile for clinic type
  const { data: profile } = await supabaseClient
    .from('perfis')
    .select('clinica, role')
    .eq('id', userId)
    .single()

  const clinicType = profile?.clinica ? 'médica' : 'estética'
  const recentMedia = analytics.data_snapshot?.recent_media || []
  const lastPostsText = recentMedia.map((post: any) => post.caption?.substring(0, 100)).join('; ')

  const prompt = `
Você é o motor de análise de engajamento do Fluida. Sua missão é usar os dados reais do Instagram da clínica para gerar um parecer objetivo e sugestões estratégicas.

📥 Dados disponíveis da conta:
- Nome do usuário: ${config.username}
- Número de seguidores: ${analytics.followers_count}
- Alcance médio por post: ${analytics.reach}
- Impressões: ${analytics.impressions}
- Engajamento médio: ${analytics.engagement_rate}%
- Frequência de postagens: ${analytics.post_frequency} posts/semana
- Últimos conteúdos: ${lastPostsText}

📊 Entrega esperada:

1. Diagnóstico de Engajamento
- Analise se o número de seguidores está proporcional ao alcance
- Avalie se o engajamento está acima ou abaixo da média do setor (~1,5%)
- Comente sobre frequência de postagem real x desejada

2. Alertas Estratégicos
- Gere até 2 alertas se houver dados críticos (ex: muitos seguidores, pouco alcance)
- Ex: "Engajamento abaixo de 1% — risco de público desengajado. Reative com Reels curtos e enquetes."

3. Recomendações Inteligentes
- Sugira até 3 ações baseadas nos dados reais, com linguagem consultiva
- Use o estilo ${clinicType} (médica = técnico, estética = emocional)

Formato de resposta em JSON:
{
  "diagnostico": "texto do diagnóstico",
  "alertas": ["alerta 1", "alerta 2"],
  "recomendacoes": ["rec 1", "rec 2", "rec 3"]
}
`

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de engajamento do Instagram para clínicas de estética e medicina. Responda sempre em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    })

    const openaiData = await openaiResponse.json()
    const analysisText = openaiData.choices?.[0]?.message?.content

    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch (e) {
      // Fallback if JSON parsing fails
      analysis = {
        diagnostico: analysisText,
        alertas: [],
        recomendacoes: []
      }
    }

    // Update analytics record with analysis
    await supabaseClient
      .from('instagram_analytics')
      .update({ analysis_result: JSON.stringify(analysis) })
      .eq('id', analytics.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        analytics: {
          followers_count: analytics.followers_count,
          engagement_rate: analytics.engagement_rate,
          reach: analytics.reach,
          impressions: analytics.impressions
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('Failed to analyze engagement with AI')
  }
}

function calculateEngagementMetrics(accountData: any, mediaData: any[]) {
  if (!mediaData || mediaData.length === 0) {
    return {
      engagementRate: 0,
      avgReach: 0,
      avgImpressions: 0,
      postFrequency: 0
    }
  }

  const totalEngagement = mediaData.reduce((sum, post) => {
    return sum + (post.like_count || 0) + (post.comments_count || 0)
  }, 0)

  const totalReach = mediaData.reduce((sum, post) => sum + (post.reach || 0), 0)
  const totalImpressions = mediaData.reduce((sum, post) => sum + (post.impressions || 0), 0)

  const avgEngagement = totalEngagement / mediaData.length
  const engagementRate = accountData.followers_count > 0 
    ? (avgEngagement / accountData.followers_count) * 100 
    : 0

  // Calculate posting frequency (posts per week based on last 25 posts)
  const sortedDates = mediaData
    .map(post => new Date(post.timestamp))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let postFrequency = 0
  if (sortedDates.length >= 2) {
    const daysDiff = (sortedDates[0].getTime() - sortedDates[sortedDates.length - 1].getTime()) / (1000 * 60 * 60 * 24)
    postFrequency = Math.round((mediaData.length / daysDiff) * 7) // posts per week
  }

  return {
    engagementRate: Math.round(engagementRate * 100) / 100,
    avgReach: Math.round(totalReach / mediaData.length),
    avgImpressions: Math.round(totalImpressions / mediaData.length),
    postFrequency
  }
}
