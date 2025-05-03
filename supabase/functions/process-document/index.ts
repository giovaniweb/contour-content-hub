
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
    const requestData = await req.json();
    console.log("Received request:", JSON.stringify(requestData).substring(0, 200));
    
    // Handle direct file content or document ID
    if (requestData.fileContent) {
      // Process file content directly (base64 encoded PDF content)
      return await processFileContent(requestData.fileContent, corsHeaders);
    } else if (requestData.documentId) {
      // Process existing document by ID
      return await processDocumentById(requestData.documentId, requestData.userId || null, corsHeaders);
    } else {
      return new Response(
        JSON.stringify({ error: 'Either fileContent or documentId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processFileContent(fileContent: string, corsHeaders: HeadersInit) {
  try {
    console.log("Processing new file content...");
    
    // In a real implementation, you would extract text from the PDF
    // For demo purposes, we'll simulate text extraction with OpenAI
    // Start with empty data to avoid any contamination from previous runs
    let extractedText = "This is new extracted text from the PDF.";
    
    // The fileName or title info won't be available here, so we need to extract it from content
    
    // For PDF analysis, we would extract real text here
    // Adding placeholder content that will be replaced by OpenAI extraction
    extractedText += "\n\nTitle: [To be extracted from document]\n\n";
    extractedText += "Authors: [To be extracted from document]\n\n";
    extractedText += "Abstract: [To be extracted from document]\n\n";
    extractedText += "Keywords: [To be extracted from document]\n\n";
    extractedText += "Conclusion: [To be extracted from document]";
    
    // Extract key information using OpenAI - clear reset of any cached data
    const documentInfo = await extractDocumentInfo(extractedText, true);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        ...documentInfo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing file content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process file content', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function processDocumentById(documentId: string, userId: string | null, corsHeaders: HeadersInit) {
  try {
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

    // Extract text from document - start with fresh data
    let extractedText = "";
    try {
      // In a real implementation, you would use a library to extract text from different file types
      // This is a simplified version that assumes text extraction works
      extractedText = "This is newly extracted text from the document. In a real implementation, you would use libraries like pdf.js, docx-parser, etc.";
      
      // For demo purposes, adding some content based on the document title
      extractedText += `\n\nDocument Title: ${document.titulo}`;
      if (document.descricao) {
        extractedText += `\n\nDescription: ${document.descricao}`;
      }
      
      // Add some fake content based on document type
      switch (document.tipo) {
        case 'artigo_cientifico':
          extractedText += `\n\nTitle: [Will be extracted from document]`;
          extractedText += `\n\nAbstract: [Will be extracted from document]`;
          extractedText += `\n\nMethodology: [Will be extracted from document]`;
          extractedText += `\n\nResults: [Will be extracted from document]`;
          extractedText += `\n\nConclusion: [Will be extracted from document]`;
          extractedText += `\n\nKeywords: [Will be extracted from document]`;
          extractedText += `\n\nAuthors: [Will be extracted from document]`;
          break;
          
        case 'ficha_tecnica':
          extractedText += `\n\nSpecifications for ${document.titulo}:`;
          extractedText += `\n- [Technical specifications will be extracted]`;
          break;
          
        case 'protocolo':
          extractedText += `\n\nTreatment Protocol for ${document.titulo}:`;
          extractedText += `\n\n[Protocol steps will be extracted]`;
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

    // Extract key information using OpenAI - force reset of previous data
    const documentInfo = await extractDocumentInfo(extractedText, true);

    // Update document in database with extracted text, embeddings, and suggestions
    const { error: updateError } = await supabase
      .from('documentos_tecnicos')
      .update({
        conteudo_extraido: extractedText,
        titulo: documentInfo.title || document.titulo,
        descricao: documentInfo.conclusion || document.descricao,
        status: 'ativo',
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
        ...documentInfo
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
}

async function extractDocumentInfo(text: string, forceReset = false) {
  try {
    if (!OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback extraction");
      // Fallback to basic extraction if no API key
      // Make sure we're not reusing any fixed data if forceReset is true
      if (forceReset) {
        return {
          title: "",
          conclusion: "",
          keywords: [],
          researchers: []
        };
      }
      
      return {
        title: "Document Title",
        conclusion: "Document conclusion extracted from content.",
        keywords: ["keyword1", "keyword2", "keyword3"],
        researchers: ["Author 1", "Author 2"]
      };
    }

    // Call OpenAI to extract information with enhanced prompt to focus on actual authors
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a precise extraction tool that analyzes scientific articles and extracts specific information in JSON format.
            Extract ONLY the following fields from the document:
            1. title (the actual title of the paper, not the filename)
            2. conclusion (from the conclusion section)
            3. keywords (as an array of all found keywords)
            4. researchers (as an array of ONLY actual authors/researchers of the document)
            
            For researchers/authors, ONLY include names that are EXPLICITLY identified as authors in the document.
            Look specifically for sections labeled:
            - "Author", "Authors", "Autor", "Autores"
            - "Corresponding Author", "Autor Correspondente"
            - "Principal Investigator", "Investigador Principal"
            - "Research Team", "Equipe de Pesquisa", "Equipo de Investigación"
            
            DO NOT include names that appear elsewhere in the document unless they are clearly identified as authors.
            Include titles like Dr., Prof., Ph.D. if present with the author names.
            If no authors can be confidently identified, return an empty array for researchers.
            
            Return the data as a valid JSON object with these fields.
            If a field cannot be extracted, use an empty string for text fields or an empty array for lists.`
          },
          { 
            role: 'user', 
            content: `Extract ONLY the title, conclusion, keywords, and authors from this scientific document text:\n\n${text}` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });
    
    if (openaiResponse.ok) {
      const openaiData = await openaiResponse.json();
      const content = openaiData.choices[0].message.content;
      
      try {
        // Parse the JSON response
        const extractedData = JSON.parse(content);
        console.log("Extracted data from OpenAI:", extractedData);
        
        // Clean up the title - remove any numbering prefixes and suffixes like "OK"
        let cleanTitle = extractedData.title || "";
        cleanTitle = cleanTitle.replace(/^\d+\s+/, ''); // Remove leading numbers
        cleanTitle = cleanTitle.replace(/\s+OK$/i, ''); // Remove trailing "OK"
        
        return {
          title: cleanTitle,
          conclusion: extractedData.conclusion || "",
          keywords: extractedData.keywords || [],
          researchers: extractedData.researchers || []
        };
      } catch (parseError) {
        console.error("Error parsing OpenAI JSON response:", parseError);
        // Return empty data if forceReset is true to avoid contamination
        if (forceReset) {
          return {
            title: "",
            conclusion: "",
            keywords: [],
            researchers: []
          };
        }
        
        return {
          title: "Document Title",
          conclusion: "Error extracting conclusion.",
          keywords: [],
          researchers: []
        };
      }
    } else {
      console.error(`OpenAI API error: ${openaiResponse.status}`);
      // Return empty data if forceReset is true to avoid contamination
      if (forceReset) {
        return {
          title: "",
          conclusion: "",
          keywords: [],
          researchers: []
        };
      }
      
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }
  } catch (error) {
    console.error("Error in extractDocumentInfo:", error);
    // Return empty data if forceReset is true to avoid contamination
    if (forceReset) {
      return {
        title: "",
        conclusion: "",
        keywords: [],
        researchers: []
      };
    }
    
    // Return fallback extraction if OpenAI call fails
    return {
      title: "Document Title",
      conclusion: "Error extracting conclusion.",
      keywords: ["error"],
      researchers: []
    };
  }
}
