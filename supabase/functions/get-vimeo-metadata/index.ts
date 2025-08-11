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

    // Use Vimeo oEmbed API (more reliable)
    const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=640&height=480`
    const response = await fetch(oembedUrl)
    
    if (!response.ok) {
      console.error('oEmbed API failed, trying fallback...')
      // Fallback to old API
      const fallbackResponse = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
      if (!fallbackResponse.ok) {
        throw new Error('Erro ao buscar dados do Vimeo')
      }
      const fallbackData = await fallbackResponse.json()
      if (!fallbackData || fallbackData.length === 0) {
        throw new Error('Vídeo não encontrado no Vimeo')
      }
      
      const video = fallbackData[0]
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
      
      console.log('Vimeo metadata fetched via fallback:', metadata)
      return new Response(JSON.stringify(metadata), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const oembedData = await response.json()
    
    if (!oembedData) {
      throw new Error('Vídeo não encontrado no Vimeo')
    }

    // Extract duration from description or set default
    let durationMinutes = 5 // Default fallback
    if (oembedData.description) {
      // Try to extract duration from description if available
      const durationMatch = oembedData.description.match(/(\d+):(\d+)/)
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1])
        const seconds = parseInt(durationMatch[2])
        durationMinutes = minutes + Math.ceil(seconds / 60)
      }
    }

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