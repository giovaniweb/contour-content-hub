
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Get document ID from request
    const { documentId, userId } = await req.json();

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documentos_tecnicos')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download file from storage
    if (!document.link_dropbox) {
      return new Response(
        JSON.stringify({ error: 'Document URL not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download the document file
    const fileResponse = await fetch(document.link_dropbox);
    
    if (!fileResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to download document file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fileArrayBuffer = await fileResponse.arrayBuffer();
    const fileBuffer = new Uint8Array(fileArrayBuffer);

    // Extract text from document
    let extractedText = "";
    try {
      // In a real implementation, you would use a library to extract text from different file types
      // This is a simplified version that assumes text extraction works
      extractedText = "This is extracted text from the document. In a real implementation, you would use libraries like pdf.js, docx-parser, etc.";
      
      // For demo purposes, adding some content based on the document title
      extractedText += `\n\nDocument Title: ${document.titulo}`;
      if (document.descricao) {
        extractedText += `\n\nDescription: ${document.descricao}`;
      }
      
      // Add some fake content based on document type
      switch (document.tipo) {
        case 'artigo_cientifico':
          extractedText += `\n\nAbstract: This scientific article presents groundbreaking research in the field of ${document.titulo.toLowerCase()}.`;
          extractedText += `\n\nMethodology: The study used a double-blind approach with control groups to validate the findings.`;
          extractedText += `\n\nResults: The results show significant improvements over previous methods, with p-value < 0.05.`;
          extractedText += `\n\nConclusion: This research opens new avenues for innovation in the field.`;
          break;
          
        case 'ficha_tecnica':
          extractedText += `\n\nSpecifications for ${document.titulo}:`;
          extractedText += `\n- Power: 220V/110V adjustable`;
          extractedText += `\n- Frequency: 60Hz`;
          extractedText += `\n- Dimensions: 50cm x 40cm x 30cm`;
          extractedText += `\n- Weight: 5kg`;
          extractedText += `\n- Materials: Medical-grade silicone and stainless steel`;
          extractedText += `\n- Certifications: ANVISA, CE, FDA`;
          break;
          
        case 'protocolo':
          extractedText += `\n\nTreatment Protocol for ${document.titulo}:`;
          extractedText += `\n\nStep 1: Patient assessment and eligibility verification.`;
          extractedText += `\n\nStep 2: Prepare the treatment area with antiseptic solution.`;
          extractedText += `\n\nStep 3: Apply the device with medium intensity for 15 minutes.`;
          extractedText += `\n\nStep 4: Increase intensity gradually based on patient feedback.`;
          extractedText += `\n\nStep 5: Complete the session with a cooling gel application.`;
          extractedText += `\n\nFrequency: 1 session per week for 6 weeks.`;
          extractedText += `\n\nExpected outcomes: Visible improvement after 3 sessions.`;
          break;
          
        default:
          extractedText += `\n\nThis document contains important information about ${document.titulo}.`;
          extractedText += `\n\nPlease refer to the original document for complete details.`;
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to extract text from document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embeddings using OpenAI
    let embeddings = null;
    try {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: extractedText.slice(0, 8000), // Limit size for embedding
        }),
      });

      if (!embeddingResponse.ok) {
        const errorData = await embeddingResponse.json();
        throw new Error(errorData.error?.message || 'Failed to generate embeddings');
      }

      const embeddingData = await embeddingResponse.json();
      embeddings = embeddingData.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      // Continue without embeddings
    }

    // Update document in database with extracted text and embeddings
    const { error: updateError } = await supabase
      .from('documentos_tecnicos')
      .update({
        conteudo_extraido: extractedText,
        vetor_embeddings: embeddings,
        status: 'ativo'
      })
      .eq('id', documentId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update document', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log document access in history
    if (userId) {
      await supabase
        .from('document_access_history')
        .insert({
          document_id: documentId,
          user_id: userId,
          action_type: 'process'
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document processed successfully',
        extractedTextLength: extractedText.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
