
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { prompt, quality = 'standard', size = '1024x1024', style = 'natural' } = await req.json()

    console.log('🖼️ [generate-image] Recebendo solicitação:', { 
      prompt: prompt.substring(0, 100), 
      quality, 
      size,
      style,
      promptLength: prompt.length
    })

    if (!prompt) {
      throw new Error('Prompt é obrigatório')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY não configurada')
    }

    // Validar e preparar parâmetros para DALL-E-3
    const validQuality = quality === 'hd' ? 'hd' : 'standard';
    const validSize = ['1024x1024', '1792x1024', '1024x1792'].includes(size) ? size : '1024x1024';
    const validStyle = ['vivid', 'natural'].includes(style) ? style : 'natural';

    console.log('🎨 [generate-image] Usando DALL-E-3 com parâmetros:', {
      model: 'dall-e-3',
      quality: validQuality,
      size: validSize,
      style: validStyle
    });

    // Chamar API do OpenAI para geração de imagem com DALL-E-3
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: validSize,
        quality: validQuality,
        style: validStyle,
        response_format: 'b64_json'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ [generate-image] Erro da OpenAI:', errorData)
      throw new Error(errorData.error?.message || 'Falha ao gerar imagem')
    }

    const result = await response.json()
    console.log('✅ [generate-image] Imagem gerada com sucesso')

    // Retornar imagem em formato base64
    const imageData = result.data[0].b64_json
    const imageUrl = `data:image/png;base64,${imageData}`

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        success: true,
        revised_prompt: result.data[0].revised_prompt // DALL-E-3 pode revisar o prompt
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error: any) {
    console.error('❌ [generate-image] Erro:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
