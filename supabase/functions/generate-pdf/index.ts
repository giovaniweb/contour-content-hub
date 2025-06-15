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
    console.log("Edge function de geração de PDF iniciada");
    
    // Parse request
    let requestData;
    try {
      requestData = await req.json();
      console.log("Dados recebidos:", JSON.stringify(requestData).substring(0, 200) + "...");
    } catch (parseError) {
      console.error("Erro ao processar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: "Formato de requisição inválido" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const {
      scriptId,
      diagnosticSection,
      actionsSection,
      contentSection,
      title,
      type
    } = requestData;

    if (!scriptId || !diagnosticSection || !actionsSection || !contentSection || !title) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar PDF: cada seção em uma página, estilizada em Aurora
    console.log("Gerando PDF estilizado Aurora Boreal...");
    const pdfDoc = await PDFDocument.create();

    // Fontes e cores customizadas
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const auroraGradients = [
      { color: rgb(0.42, 0.27, 0.76), label: "Aurora Deep Purple" },
      { color: rgb(0.06, 0.72, 0.83), label: "Aurora Neon Blue" },
      { color: rgb(0.07, 0.72, 0.62), label: "Aurora Sage" }
    ];

    // Helpers para adicionar páginas
    function addAuroraPage(titleText: string, sectionContent: string, gradientColor: any) {
      const page = pdfDoc.addPage([595, 842]); // A4
      page.drawRectangle({
        x: 0, y: 0, width: 595, height: 842, 
        color: gradientColor,
        opacity: 0.30
      });
      page.drawText(titleText, {
        x: 50,
        y: 790,
        size: 24,
        font,
        color: rgb(0.33, 0.10, 0.95)
      });
      page.drawText(sectionContent.substring(0, 2500), { // Limite de texto
        x: 40,
        y: 770,
        size: 12,
        font,
        color: rgb(1, 1, 1),
        maxWidth: 500,
        lineHeight: 18
      });
    }

    addAuroraPage("Diagnóstico Estratégico", diagnosticSection, auroraGradients[0].color);
    addAuroraPage("Ações - Plano Semanal", actionsSection, auroraGradients[1].color);
    addAuroraPage("Sugestões de Conteúdo", contentSection, auroraGradients[2].color);

    // Rodapé "Gerado por Fluida - Aurora Boreal"
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPages()[i];
      page.drawText(`Gerado por Fluida - Aurora Boreal • ${new Date().toLocaleDateString('pt-BR')}`, {
        x: 180,
        y: 30,
        size: 10,
        font,
        color: rgb(0.7, 0.7, 0.9),
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Upload para Supabase Storage!
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const fileName = `${scriptId}.pdf`;
    const pdfPath = fileName;

    // Usar API de storage direto
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

    // URL pública
    const pdfUrl = `${supabaseUrl}/storage/v1/object/public/${storageBucket}/${pdfPath}`;
    console.log("PDF Aurora Boreal gerado com sucesso!", pdfUrl);

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
