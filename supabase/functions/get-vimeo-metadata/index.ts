import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vimeoUrl } = await req.json()
    
    if (!vimeoUrl) {
      throw new Error('URL do Vimeo é obrigatória')
    }

    // Extract Vimeo ID from URL
    const vimeoId = extractVimeoId(vimeoUrl)
    if (!vimeoId) {
      throw new Error('URL do Vimeo inválida')
    }

    console.log('Fetching metadata for Vimeo ID:', vimeoId)

    // Call Vimeo API
    const response = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do Vimeo')
    }

    const vimeoData = await response.json()
    
    if (!vimeoData || vimeoData.length === 0) {
      throw new Error('Vídeo não encontrado no Vimeo')
    }

    const video = vimeoData[0]

    // Convert duration from seconds to minutes
    const durationMinutes = Math.ceil(video.duration / 60)

    const metadata = {
      title: video.title || '',
      description: video.description || '',
      duration_minutes: durationMinutes,
      thumbnail_url: video.thumbnail_large || video.thumbnail_medium || video.thumbnail_small || '',
      vimeo_id: vimeoId,
      upload_date: video.upload_date,
      user_name: video.user_name,
      width: video.width,
      height: video.height
    }

    console.log('Vimeo metadata fetched successfully:', metadata)

    return new Response(
      JSON.stringify(metadata),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching Vimeo metadata:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor'
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function extractVimeoId(url: string): string | null {
  // Handle various Vimeo URL formats
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/channels\/[^\/]+\/(\d+)/,
    /vimeo\.com\/groups\/[^\/]+\/videos\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}