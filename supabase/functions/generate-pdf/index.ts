
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as base64 from "https://deno.land/std@0.182.0/encoding/base64.ts";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const storageBucket = "fluida-pdfs"; // bucket de PDF público

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function de geração de PDF iniciada (HTML PARA TEXTO)");

    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos (html):", JSON.stringify(requestData).substring(0, 200) + "...");
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
      htmlString,
      type
    } = requestData;

    if (!sessionId || !htmlString || !title) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos para PDF (falta HTML, título ou id)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ✨ NOVO: gerar PDF textual simples a partir do HTML
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    // Extrair textos básicos do HTML (apenas os títulos, parágrafos, spans - simples!)
    let plainText = "";

    try {
      // Regex para extrair textos de títulos, parágrafos e spans
      const h1 = [...htmlString.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)].map(m => m[1]);
      const h2 = [...htmlString.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1]);
      const h3 = [...htmlString.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)].map(m => m[1]);
      const h4 = [...htmlString.matchAll(/<h4[^>]*>(.*?)<\/h4>/gi)].map(m => m[1]);
      const ps = [...htmlString.matchAll(/<p[^>]*>(.*?)<\/p>/gi)].map(m => m[1]);
      const spans = [...htmlString.matchAll(/<span[^>]*>(.*?)<\/span>/gi)].map(m => m[1]);
      plainText += h1.join("\n\n") + "\n";
      plainText += h2.join("\n\n") + "\n";
      plainText += h3.join("\n\n") + "\n";
      plainText += h4.join("\n\n") + "\n";
      plainText += ps.join("\n\n") + "\n";
      plainText += spans.join("\n\n") + "\n";
    } catch (e) {
      plainText = "Erro ao extrair texto do HTML.";
    }
    if (!plainText.trim()) {
      plainText = "Relatório gerado pelo Fluida — conteúdo não pôde ser lido do HTML.";
    }

    // Limite de 2000 caracteres para não estourar a página
    const max = 2000;
    if (plainText.length > max) plainText = plainText.substring(0, max) + "\n...";

    // NOVO: Remover emojis e caracteres não suportados (fica só ASCII padrão)
    // Isso evita o erro "WinAnsi cannot encode ..."
    const removeUnsupportedChars = (text: string) =>
      text.replace(/[^\x00-\x7F\s\n\r.,;:!?@#\$%\^&\*\(\)_\-\+=\/\\\|\[\]\{\}<>`'"~©®°ªº]/g, "");

    const cleanTitle = removeUnsupportedChars(title);
    const cleanText = removeUnsupportedChars(plainText);

    // Adiciona título do relatório (header)
    page.drawText(cleanTitle, {
      x: 40, y: 800,
      size: 18,
      font: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
      color: rgb(0.4, 0.25, 0.7),
    });
    // Adiciona bloco de texto extraído
    page.drawText(cleanText, {
      x: 40, y: 780,
      size: 12,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0.09, 0.07, 0.15),
      maxWidth: 500,
      lineHeight: 15
    });

    // Rodapé
    page.drawText(`Gerado por Fluida - Aurora Boreal • ${new Date().toLocaleDateString('pt-BR')}`, {
      x: 160,
      y: 20,
      size: 10,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      color: rgb(0.7, 0.7, 0.9),
    });

    const pdfBytes = await pdfDoc.save();

    // Upload para Supabase Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
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
    console.log("PDF Aurora Boreal TEXTO gerado com sucesso!", pdfUrl);

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
