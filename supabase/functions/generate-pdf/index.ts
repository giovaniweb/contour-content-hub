import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as base64 from "https://deno.land/std@0.182.0/encoding/base64.ts";
// Adição: imports para PDF e storage
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const storageBucket = "fluida-pdfs"; // bucket de PDF público

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function de geração de PDF iniciada (IMAGEM)");

    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos (imagem):", JSON.stringify(requestData).substring(0, 200) + "...");
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      sessionId,
      title,
      imgBase64,
      type
    } = requestData;

    if (!sessionId || !imgBase64 || !title) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos para PDF (falta imagem, título ou id)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar PDF usando imagem (base64 PNG)
    console.log("Gerando PDF Aurora a partir de IMAGEM...");
    const pdfDoc = await PDFDocument.create();

    // Padrão A4: 595 x 842. Ajustar à imagem depois de carregar.
    const page = pdfDoc.addPage([595, 842]);

    // Pega apenas a base64, sem prefixo "data:image/png;base64,"
    const base64Data = imgBase64.split(",")[1];
    const pngImage = await pdfDoc.embedPng(base64.decode(base64Data));

    // Ajusta imagem para ocupar toda a página A4 (mantém proporção)
    const { width, height } = pngImage.size();
    const aspectRatio = width / height;
    let targetWidth = 595;
    let targetHeight = 842;

    if (width / 595 > height / 842) {
      targetHeight = 595 / aspectRatio;
    } else {
      targetWidth = 842 * aspectRatio;
    }

    const x = (595 - targetWidth) / 2;
    const y = (842 - targetHeight) / 2;

    page.drawImage(pngImage, {
      x: x,
      y: y,
      width: targetWidth,
      height: targetHeight,
    });

    // Rodapé opcional
    page.drawText(`Gerado por Fluida - Aurora Boreal • ${new Date().toLocaleDateString('pt-BR')}`, {
      x: 160,
      y: 20,
      size: 10,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0.7, 0.7, 0.9),
    });

    const pdfBytes = await pdfDoc.save();

    // Upload para Supabase Storage!
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const storageBucket = "fluida-pdfs";
    const fileName = `${sessionId}.pdf`;
    const pdfPath = fileName;

    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${storageBucket}/${pdfPath}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/pdf",
      },
      body: pdfBytes,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text();
      return new Response(
        JSON.stringify({ error: "Erro ao fazer upload do PDF", details: uploadError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pdfUrl = `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${pdfPath}`;
    console.log("PDF Aurora Boreal IMAGEM gerado com sucesso!", pdfUrl);

    return new Response(
      JSON.stringify({ success: true, pdfUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função generate-pdf:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
