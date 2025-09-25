
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as base64 from "https://deno.land/std@0.182.0/encoding/base64.ts";

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

    // Extrair textos básicos do HTML
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

    // Remover emojis e caracteres especiais
    const removeUnsupportedChars = (text: string) =>
      text.replace(/[^\x00-\x7F\s\n\r.,;:!?@#\$%\^&\*\(\)_\-\+=\/\\\|\[\]\{\}<>`'"~©®°ªº]/g, "");

    const cleanTitle = removeUnsupportedChars(title);
    const cleanText = removeUnsupportedChars(plainText);

    // Criar PDF simples como texto
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${(cleanTitle.length + cleanText.length + 100)}
>>
stream
BT
/F1 16 Tf
50 750 Td
(${cleanTitle}) Tj
0 -30 Td
/F1 12 Tf
(${cleanText.substring(0, 1000).replace(/\n/g, ') Tj 0 -15 Td (')}) Tj
0 -50 Td
/F1 10 Tf
(Gerado por Fluida - ${new Date().toLocaleDateString('pt-BR')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000273 00000 n 
0000000${(400 + cleanTitle.length + cleanText.substring(0, 1000).length).toString().padStart(3, '0')} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${500 + cleanTitle.length + cleanText.substring(0, 1000).length}
%%EOF`;

    const pdfBytes = new TextEncoder().encode(pdfContent);

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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
