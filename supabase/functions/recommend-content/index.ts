
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function buildVideoRecommendations(format: string, equipmentName?: string) {
  const eq = (equipmentName || 'seu equipamento').trim();
  if (format === 'reels') {
    return [
      `Gancho em 3s: "Você conhece o poder do ${eq}?"`,
      `Antes e Depois (rápido) com overlay sutil, sem texto grande na tela`,
      `Demonstração do procedimento com o ${eq} em 2 cenas (close e resultado)`,
      `Depoimento curto de paciente (1 frase)`,
      `CTA: "Agende sua avaliação" com contato`
    ];
  }
  if (format === 'long') {
    return [
      `Introdução (30-45s): contexto do problema e como o ${eq} ajuda`,
      `Capítulo 1: Tecnologia do ${eq} explicada de forma simples`,
      `Capítulo 2: Indicações e contraindicações reais`,
      `Capítulo 3: Protocolo clínico e expectativas de resultado`,
      `Conclusão com CTA e perguntas frequentes`
    ];
  }
  return [];
}

function buildPhotoSuggestions(format: string, equipmentName?: string) {
  const eq = (equipmentName || 'equipamento estético real').trim();
  const basePrompts = [
    `Professional medical stock photography, ${eq} em clínica moderna, luz natural, sem textos, sem logos, realista`,
    `Close-up do ${eq} em uso por profissional com EPI, composição limpa, iluminação suave`,
    `Ambiente de recepção elegante, foco no ${eq} como destaque em bancada, estilo comercial`
  ];
  if (format === 'artigo') {
    return unique([
      ...basePrompts,
      `Foto hero com ${eq} e profissional explicando ao paciente (consultório)`,
      `Detalhe técnico do ${eq} com display visível, sem marcas fictícias`
    ]);
  }
  if (format === 'carrossel') {
    return unique([
      ...basePrompts,
      `Slide 1 (hero): clínica premium com ${eq} ao fundo`,
      `Slide 2 (problema): consulta com paciente (sem mostrar procedimento invasivo)`,
      `Slide 3 (solução): ${eq} em uso realista`,
      `Slide 4 (resultados): paciente feliz em ambiente clínico`,
      `Slide 5 (CTA): recepção convidativa`
    ]);
  }
  return basePrompts;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { format, equipmentName } = await req.json();
    if (!format) {
      return new Response(JSON.stringify({ error: 'format é obrigatório' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    const videos = buildVideoRecommendations(String(format), equipmentName ? String(equipmentName) : undefined);
    const photoPrompts = buildPhotoSuggestions(String(format), equipmentName ? String(equipmentName) : undefined);

    return new Response(JSON.stringify({
      success: true,
      format,
      equipmentName: equipmentName || null,
      recommendations: {
        videos,
        photoPrompts
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error: any) {
    console.error('❌ [recommend-content] Erro:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Erro desconhecido' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
  }
});
