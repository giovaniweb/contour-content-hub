
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

  const startedAt = Date.now();

  try {
    const { 
      prompt, 
      quality = 'standard', 
      size = '1024x1024', 
      style = 'natural',
      n = 1,
      equipmentName // novo: ajuda a reduzir alucinação
    } = await req.json()

    const safePromptPreview = typeof prompt === 'string' ? prompt.substring(0, 160) : String(prompt || '').substring(0, 160);

    console.log('🖼️ [generate-image] Recebendo solicitação:', { 
      prompt: safePromptPreview, 
      quality, 
      size,
      style,
      n,
      equipmentName: equipmentName || null
    })

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt é obrigatório e deve ser string')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY não configurada')
    }

    // Validar e preparar parâmetros para DALL-E-3
    const validQuality = quality === 'hd' ? 'hd' : 'standard';
    const validSize = ['1024x1024', '1792x1024', '1024x1792'].includes(size) ? size : '1024x1024';
    const validStyle = ['vivid', 'natural'].includes(style) ? style : 'natural';

    // Regras anti-alucinação + ancoragem textual em equipamento (quando informado)
    const antiHallucination = [
      'IMPORTANT: Only depict real medical/aesthetic equipment.',
      'Do not invent fictional logos, brands, or devices.',
      'If a specific device is mentioned, keep all elements realistic and compliant.',
      'Clean clinical environment, professional stock photography style.',
      'No text overlays, no watermarks.'
    ].join(' ');

    const equipmentAnchor = equipmentName 
      ? `Featuring the real device: ${equipmentName}. Do not invent versions of it; represent only authentic, realistic visuals of the device.`
      : '';

    const finalPrompt = `${antiHallucination} ${equipmentAnchor} ${prompt}`.trim();

    console.log('🎨 [generate-image] Usando DALL-E-3 com parâmetros:', {
      model: 'dall-e-3',
      quality: validQuality,
      size: validSize,
      style: validStyle,
      n: 1 // DALL-E-3 suporta apenas n=1
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
        prompt: finalPrompt,
        n: 1,
        size: validSize,
        quality: validQuality,
        style: validStyle,
        response_format: 'b64_json'
      }),
    })

    const durationMs = Date.now() - startedAt;

    if (!response.ok) {
      let errorData: any = null;
      try { errorData = await response.json(); } catch {}
      console.error('❌ [generate-image] Erro da OpenAI:', errorData || await response.text())
      throw new Error(errorData?.error?.message || 'Falha ao gerar imagem')
    }

    const result = await response.json()
    console.log('✅ [generate-image] Imagem gerada com sucesso em', durationMs, 'ms')

    // Retornar imagem em formato base64
    const imageData = result.data[0].b64_json
    const imageUrl = `data:image/png;base64,${imageData}`

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        success: true,
        revised_prompt: result.data[0].revised_prompt, // DALL-E-3 pode revisar o prompt
        metrics: {
          model: 'dall-e-3',
          response_time_ms: durationMs
        }
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
