// Import necessary Deno and Supabase libraries
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // Required for Supabase client
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PDFDocument } from "https://deno.land/x/pdfparser@v0.0.2/mod.ts";

// Environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// CORS headers for responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow requests from any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main request handler
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Ensure Supabase environment variables are set
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase URL or Service Role Key is not configured.");
      throw new Error("Supabase URL or Service Role Key is not configured.");
    }
    
    const requestData = await req.json();
    console.log("Received request for document processing:", JSON.stringify(requestData).substring(0, 300) + "..."); // Log snippet of request

    const { documentId, forceRefresh = false } = requestData;

    if (!documentId) {
      return new Response(JSON.stringify({ error: 'documentId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key for admin-level access
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    return await processDocument(supabaseAdmin, documentId, forceRefresh, corsHeaders);

  } catch (error) {
    console.error('Critical error in main request handler:', error, error.stack);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to process a document by its ID from the `unified_documents` table
async function processDocument(supabase: SupabaseClient, documentId: string, forceRefresh: boolean, responseHeaders: HeadersInit) {
  let currentProcessingStatus = 'processando'; // Reflects the enum 'processing_status_enum'
  let currentErrorDetails = null as string | null;

  try {
    console.log(`Starting processing for document ID: ${documentId}, Force refresh: ${forceRefresh}`);

    // 1. Fetch document details from `unified_documents`
    // Ensure all necessary fields are selected, especially `tipo_documento` and `file_path`.
    const { data: doc, error: fetchError } = await supabase
      .from('unified_documents')
      .select('id, file_path, tipo_documento, titulo_extraido, autores, palavras_chave, raw_text, texto_completo, status_processamento')
      .eq('id', documentId)
      .single();

    if (fetchError || !doc) {
      console.error(`Document not found (ID: ${documentId}):`, fetchError?.message);
      return new Response(JSON.stringify({ error: 'Document not found', details: fetchError?.message }), {
        status: 404, headers: { ...responseHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Document ${doc.id} found. Type: ${doc.tipo_documento}, Current DB Status: ${doc.status_processamento}`);

    // Update status to 'processando' in the database immediately
    await supabase.from('unified_documents').update({ status_processamento: 'processando', detalhes_erro: null }).eq('id', documentId);
    console.log(`Document ${doc.id} status updated to 'processando'.`);

    // 2. Check if processing can be skipped (if not forceRefresh)
    // Consider if `raw_text` is enough or if `texto_completo` (AI summary/content) is also needed.
    const canSkipBasedOnContent = doc.raw_text && doc.raw_text.trim() !== "" && doc.titulo_extraido;
    
    if (doc.status_processamento === 'concluido' && !forceRefresh && canSkipBasedOnContent) {
        // Specific check for 'artigo_cientifico' regarding authors, even if previously 'concluido'
        if (doc.tipo_documento === 'artigo_cientifico' && (!doc.autores || doc.autores.length === 0)) {
            console.log(`Article ${doc.id} was 'concluido' but missing authors. Reprocessing is needed.`);
        } else {
            console.log(`Document ${doc.id} already processed satisfactorily and forceRefresh is false. Skipping actual processing.`);
            return new Response(JSON.stringify({ success: true, message: 'Document already processed.', document: doc }), { // Return existing doc data
                headers: { ...responseHeaders, 'Content-Type': 'application/json' }
            });
        }
    }

    // 3. Retrieve PDF from Supabase Storage
    if (!doc.file_path) {
      currentErrorDetails = `File path is missing for document ID: ${documentId}`;
      throw new Error(currentErrorDetails);
    }
    console.log(`Fetching PDF from storage path: ${doc.file_path} for document ${doc.id}`);
    const { data: fileData, error: storageError } = await supabase.storage
      .from('documents') // Bucket name from previous migration
      .download(doc.file_path);

    if (storageError || !fileData) {
      currentErrorDetails = `Failed to download PDF (path: ${doc.file_path}): ${storageError?.message}`;
      throw new Error(currentErrorDetails);
    }
    const pdfArrayBuffer = await fileData.arrayBuffer();
    console.log(`PDF for document ${doc.id} fetched, size: ${pdfArrayBuffer.byteLength} bytes.`);

    // 4. Extract raw text from PDF
    let rawText = "";
    if (pdfArrayBuffer.byteLength > 0) {
      try {
        const pdfDocParser = await PDFDocument.load(new Uint8Array(pdfArrayBuffer));
        const { texts } = await pdfDocParser.getTextContent();
        if (texts && texts.length > 0) {
          rawText = texts.map(textItem => textItem.str).join('\n\n');
          console.log(`Raw text extracted for document ${doc.id}. Length: ${rawText.length}`);
        } else {
          console.warn(`pdfparser returned no text items for document ${doc.id}. PDF might be image-based or empty of text.`);
        }
      } catch (parseError) {
        console.error(`Error parsing PDF for document ${doc.id}:`, parseError.message);
        // Do not throw an error here if parsing fails, rawText will remain empty.
        // The decision to fail processing will be based on whether rawText is empty AND if it's critical.
      }
    } else {
      console.warn(`PDF ArrayBuffer is empty for document ${doc.id}. Cannot parse.`);
    }

    // Update raw_text in the database. If rawText is empty, it's still stored as such.
    await supabase.from('unified_documents').update({ raw_text: rawText }).eq('id', documentId);
    console.log(`Stored raw_text (length: ${rawText.length}) for document ${doc.id}.`);

    // 5. Extract information using OpenAI
    // If rawText is empty, OpenAI call might be skipped or return empty results, which is handled by callOpenAIForExtraction.
    console.log(`Calling OpenAI for document ${doc.id} (type: ${doc.tipo_documento}).`);
    const aiExtractedInfo = await callOpenAIForExtraction(rawText, doc.tipo_documento);
    console.log(`OpenAI extraction completed for document ${doc.id}. Extracted Title: '${aiExtractedInfo.title}'`);

    // 6. Prepare data for final update payload
    const updatePayload: any = {
      // Use AI extracted title if available, otherwise keep existing, otherwise null
      titulo_extraido: aiExtractedInfo.title || doc.titulo_extraido || null,
      // Use AI keywords if available and not empty, otherwise keep existing, otherwise empty array
      palavras_chave: aiExtractedInfo.keywords && aiExtractedInfo.keywords.length > 0 ? aiExtractedInfo.keywords : (doc.palavras_chave || []),
      // Use AI authors if available and not empty, otherwise keep existing, otherwise empty array
      autores: aiExtractedInfo.researchers && aiExtractedInfo.researchers.length > 0 ? aiExtractedInfo.researchers : (doc.autores || []),
      // Use AI summary if available, otherwise keep existing, otherwise use a snippet of rawText as fallback for texto_completo
      texto_completo: aiExtractedInfo.summary || doc.texto_completo || rawText.substring(0, 25000), // Max length for texto_completo
      status_processamento: 'concluido', // Default to 'concluido', may change based on rules
      detalhes_erro: null, // Clear any previous error
    };

    // 7. Apply specific rules based on document type
    if (doc.tipo_documento === 'artigo_cientifico') {
      const titleMissing = !updatePayload.titulo_extraido || updatePayload.titulo_extraido.trim() === "";
      const authorsMissing = !updatePayload.autores || updatePayload.autores.length === 0;

      if (titleMissing || authorsMissing) {
        updatePayload.status_processamento = 'falhou';
        let missingFields = [];
        if (titleMissing) missingFields.push("Título");
        if (authorsMissing) missingFields.push("Autores");
        updatePayload.detalhes_erro = `Artigo Científico: Extração falhou. Campos obrigatórios (${missingFields.join(', ')}) não foram encontrados.`;
        console.warn(`Validation failed for Article ${doc.id}: ${updatePayload.detalhes_erro}. Title: '${updatePayload.titulo_extraido}', Authors: ${JSON.stringify(updatePayload.autores)}`);
      }
    } else { // For other document types (ficha_tecnica, protocolo, folder_publicitario, outro)
      // If title is still missing after AI, and raw_text had content, create a generic title.
      if ((!updatePayload.titulo_extraido || updatePayload.titulo_extraido.trim() === "") && rawText.trim() !== "") {
         updatePayload.titulo_extraido = `Documento (${doc.tipo_documento}) - ${doc.id.substring(0,8)}`;
         console.log(`Generated generic title for non-article ${doc.id}: ${updatePayload.titulo_extraido}`);
      }
      // If raw_text was empty AND AI couldn't produce a title, it might be a failure.
      // However, per requirements, these types continue even if extraction fails.
      // So, 'concluido' is fine, but 'detalhes_erro' could note partial extraction if desired.
      if (rawText.trim() === "" && (!updatePayload.titulo_extraido || updatePayload.titulo_extraido.trim() === "")) {
        console.warn(`Document ${doc.id} (type: ${doc.tipo_documento}) had no raw text and no title could be extracted. Marked as 'concluido' but content is minimal.`);
        // updatePayload.detalhes_erro = "Conteúdo do PDF vazio ou não legível, e título não pôde ser extraído."; // Optional: add a note
      }
    }

    currentProcessingStatus = updatePayload.status_processamento; // Update for final catch block
    currentErrorDetails = updatePayload.detalhes_erro;

    // 8. Save final extracted data (or error status) to `unified_documents`
    const { error: finalUpdateError } = await supabase
      .from('unified_documents')
      .update(updatePayload)
      .eq('id', documentId);

    if (finalUpdateError) {
      // This is a critical failure if the DB update itself fails.
      currentProcessingStatus = 'falhou';
      currentErrorDetails = `Falha crítica: Não foi possível salvar os resultados do processamento no banco de dados: ${finalUpdateError.message}`;
      console.error(currentErrorDetails + ` for document ${doc.id}`);
      // Attempt to update with this critical error, then throw to be caught by the main catch
      await supabase.from('unified_documents').update({
        status_processamento: 'falhou',
        detalhes_erro: currentErrorDetails
      }).eq('id', documentId);
      throw new Error(currentErrorDetails); // This will be caught by the outer catch
    }

    console.log(`Document ${doc.id} processing finished. Final status in DB: ${updatePayload.status_processamento}.`);
    return new Response(JSON.stringify({
        success: true,
        message: `Document ${doc.id} processed. Status: ${updatePayload.status_processamento}`,
        data: { // Return the data that was (attempted to be) saved
            id: doc.id,
            tipo_documento: doc.tipo_documento,
            titulo_extraido: updatePayload.titulo_extraido,
            palavras_chave: updatePayload.palavras_chave,
            autores: updatePayload.autores,
            status_processamento: updatePayload.status_processamento,
            detalhes_erro: updatePayload.detalhes_erro
        }
    }), {
      headers: { ...responseHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`Error during processing document ID ${documentId}:`, error.message, error.stack);
    // Ensure status is 'falhou' and error details are recorded.
    // currentErrorDetails might already be set by specific logic within the try block.
    const finalErrorMsg = currentErrorDetails || error.message || "Erro desconhecido durante o processamento.";

    // Attempt to update the database with the failure status and error details.
    // This is a best-effort update in the catch block.
    try {
        await supabase.from('unified_documents').update({
          status_processamento: 'falhou',
          detalhes_erro: `Processamento falhou: ${finalErrorMsg.substring(0, 500)}` // Truncate if too long
        }).eq('id', documentId);
        console.log(`Document ${documentId} status updated to 'falhou' due to error: ${finalErrorMsg}`);
    } catch (dbUpdateError) {
        console.error(`CRITICAL: Failed to update document ${documentId} status to 'falhou' in catch block:`, dbUpdateError.message);
    }

    return new Response(JSON.stringify({ error: `Failed to process document: ${finalErrorMsg}`, details: finalErrorMsg }), {
      status: 500, headers: { ...responseHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// OpenAI extraction function
async function callOpenAIForExtraction(text: string, documentType: string) {
  const result = {
    title: null as string | null,
    summary: null as string | null, // Represents 'texto_completo' if it's a summary
    keywords: [] as string[],    // Represents 'palavras_chave'
    researchers: [] as string[], // Represents 'autores'
  };

  if (!text || text.trim() === "") {
    console.warn("OpenAI call skipped: Input text is empty.");
    return result;
  }

  if (!OPENAI_API_KEY) {
    console.warn("OpenAI API key not found. Skipping AI extraction.");
    // Optionally, return some mock data if in a specific dev environment
    // if (Deno.env.get('ENVIRONMENT') === 'development') { ... }
    return result;
  }

  console.log(`Calling OpenAI for document type: ${documentType}. Text length for AI: ${text.substring(0, 16000).length}`); // OpenAI has token limits

  const systemPrompt = `You are an expert document analysis system. Your task is to extract specific information from the provided text based on the document type.
Return ONLY a valid JSON object with the following fields: "title", "summary", "keywords", "researchers".

- "title": (string) The main title of the document. If no clear title, try to infer a concise one.
- "summary": (string) A concise summary of the document. For scientific papers, this should be the abstract if available. For other types, a 1-3 sentence overview. This will be used as 'texto_completo' if it's a summary.
- "keywords": (array of strings) Relevant keywords.
- "researchers": (array of strings) Full names of authors/researchers. This field is primarily for 'artigo_cientifico'. For other document types, if authors are not explicitly listed, return an empty array.

Document Type: ${documentType}

Strictly adhere to the JSON output format. If a field cannot be found or is not applicable, use null for strings or an empty array for arrays. Do not add explanations.`;

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Specify your model, e.g., gpt-4o-mini or gpt-4
        messages: [
          { role: 'system', content: systemPrompt },
          // Send only a portion of text if it's too long, respecting token limits
          { role: 'user', content: `Extract information from the following text:\n\n${text.substring(0, 16000)}` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      console.error(`OpenAI API error: ${openaiResponse.status} - ${errorBody}`);
      return result; // Return default empty result on API error
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (content) {
      const parsedContent = JSON.parse(content);
      result.title = parsedContent.title || null;
      result.summary = parsedContent.summary || null;
      // Ensure keywords and researchers are arrays of strings
      result.keywords = Array.isArray(parsedContent.keywords) ? parsedContent.keywords.filter((k: any) => typeof k === 'string' && k.trim() !== "") : [];
      result.researchers = Array.isArray(parsedContent.researchers) ? parsedContent.researchers.filter((r: any) => typeof r === 'string' && r.trim() !== "") : [];
      
      console.log("OpenAI successfully extracted data:", JSON.stringify(result).substring(0,250) + "...");
    } else {
      console.warn("OpenAI response content was empty or not in the expected format.");
    }
  } catch (error) {
    console.error("Error during OpenAI call or parsing its response:", error.message, error.stack);
    // Return default empty result on exception
  }
  return result;
}
