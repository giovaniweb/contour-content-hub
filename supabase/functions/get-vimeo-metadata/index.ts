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

    // Try Vimeo API v2 first (has accurate duration data)
    try {
      console.log('Trying Vimeo API v2 for accurate duration...')
      const v2Response = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
      
      if (v2Response.ok) {
        const v2Data = await v2Response.json()
        if (v2Data && v2Data.length > 0) {
          const video = v2Data[0]
          const durationMinutes = Math.max(1, Math.ceil(video.duration / 60)) // At least 1 minute
          
          console.log(`Duration from API v2: ${video.duration} seconds = ${durationMinutes} minutes`)
          
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
          
          console.log('Vimeo metadata fetched successfully via API v2:', metadata)
          return new Response(JSON.stringify(metadata), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
      }
    } catch (error: any) {
      console.log('API v2 failed, trying oEmbed fallback...', error.message)
    }

    // Fallback to oEmbed API (doesn't have duration but has other data)
    console.log('Using oEmbed API as fallback...')
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=640&height=480`
    const oembedResponse = await fetch(oembedUrl)
    
    if (!oembedResponse.ok) {
      throw new Error('Erro ao buscar dados do Vimeo - ambas APIs falharam')
    }

    const oembedData = await oembedResponse.json()
    
    if (!oembedData) {
      throw new Error('Vídeo não encontrado no Vimeo')
    }

    // Since oEmbed doesn't provide duration, use a reasonable default
    const durationMinutes = 5 // Default when duration is not available
    console.log('Using default duration (oEmbed API does not provide duration):', durationMinutes)

    const metadata = {
      title: oembedData.title || '',
      description: oembedData.description || '',
      duration_minutes: durationMinutes,
      thumbnail_url: oembedData.thumbnail_url || '',
      vimeo_id: vimeoId,
      upload_date: new Date().toISOString(),
      user_name: oembedData.author_name || '',
      width: oembedData.width || 640,
      height: oembedData.height || 480
    }

    console.log('Vimeo metadata fetched via oEmbed fallback:', metadata)

    return new Response(
      JSON.stringify(metadata),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error: any) {
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