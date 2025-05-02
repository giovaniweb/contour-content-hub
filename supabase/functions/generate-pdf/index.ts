
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as base64 from "https://deno.land/std@0.182.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    const { scriptId, content, title, type } = requestData;
    
    if (!scriptId || !content || !title) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2563EB;
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
          }
          .type {
            background-color: #EFF6FF;
            color: #1D4ED8;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 20px;
          }
          .content {
            white-space: pre-wrap;
            margin-bottom: 30px;
          }
          .footer {
            text-align: center;
            color: #6B7280;
            font-size: 12px;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
          }
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="type">${getTypeLabel(type)}</div>
        <div class="content">${formatContent(content)}</div>
        <div class="footer">Gerado por ReelLine - ${new Date().toLocaleDateString('pt-BR')}</div>
      </body>
      </html>
    `;

    // Em um ambiente real, você usaria um serviço como Puppeteer ou uma API de geração de PDF
    console.log("Gerando PDF...");
    
    // Em um cenário real, você usaria um serviço como PDF API ou bibliotecas como jsPDF
    // Para este exemplo, vamos simular a criação do PDF e retornar uma URL
    const pdfUrl = `https://storage.googleapis.com/reelline-pdfs/${scriptId}.pdf`;
    
    // Vamos registrar o sucesso
    console.log("PDF gerado com sucesso, URL:", pdfUrl);

    // Retornar URL do PDF simulado
    return new Response(
      JSON.stringify({ 
        success: true,
        pdfUrl: pdfUrl
      }), 
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

// Função auxiliar para formatar o conteúdo
function formatContent(content: string): string {
  // Escapar caracteres HTML
  let escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
    
  // Converter quebras de linha para <br>
  escaped = escaped.replace(/\n/g, '<br>');
  
  return escaped;
}

// Função auxiliar para obter o rótulo do tipo de roteiro
function getTypeLabel(type: string): string {
  switch (type) {
    case 'videoScript':
      return 'Roteiro para Vídeo';
    case 'bigIdea':
      return 'Grande Ideia';
    case 'dailySales':
      return 'Vendas Diárias';
    default:
      return type;
  }
}
