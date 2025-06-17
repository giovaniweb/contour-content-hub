
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
    const forceRefresh = requestData.forceRefresh || false;
    
    // Handle direct file content or document ID
    if (requestData.fileContent) {
      // Process file content directly (base64 encoded PDF content)
      return await processFileContent(requestData.fileContent, corsHeaders);
    } else if (requestData.documentId) {
      // Process existing document by ID
      return await processDocumentById(requestData.documentId, requestData.userId || null, forceRefresh, corsHeaders);
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
    let extractedText = "";
    // TODO: Implement PDF text extraction here using a suitable library.
    // For example, if fileContent is a base64 string of the PDF:
    // try {
    //   const pdfData = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
    //   // const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    //   // let text = '';
    //   // for (let i = 1; i <= pdf.numPages; i++) {
    //   //   const page = await pdf.getPage(i);
    //   //   const content = await page.getTextContent();
    //   //   text += content.items.map(item => item.str).join(' ');
    //   // }
    //   // extractedText = text;
    //   // For now, using placeholder:
    //   extractedText = "Placeholder text from PDF content.";
    // } catch (pdfError) {
    //   console.error("Error parsing PDF from fileContent:", pdfError);
    //   extractedText = "Error extracting text from PDF. Using fallback.";
    // }
    // Using mock text until PDF extraction is implemented:
    extractedText = `
EFFECTS OF CRYOFREQUENCY ON LOCALIZED ADIPOSITY IN FLANKS

Rodrigo Marcel Valentim da Silva, Manoelly Wesleyana Tavares da Silva, Sâmela Fernandes de Medeiros, 
Sywdixianny Silva de Brito Guerra, Regina da Silva Nobre, Patricia Froes Meyer

Abstract:
This study evaluated the effects of cryofrequency on localized adiposity in flank. The sample consisted of 7 volunteers, who performed 10 cryofrequency sessions, being divided into Control Group - GC (n = 7) and Intervention Group - GI (n = 7), totaling 14 flanks. The volunteers were submitted to an Evaluation Protocol, which included anamnesis, anthropometric assessment, photogrammetry, ultrasound and perimetry. In the GI, Manthus equipment was used exclusively in the bipolar mode of cryofrequency. A descriptive statistical analysis was performed by mean and standard deviation. The inferential analysis was performed using the Wilcoxon test, with a significance level of p<0.05. After finalizing the protocol, a reduction in perimetry and the thickness of the adipose layer of the flank of the GI was observed, showing significant changes. The satisfaction level according to the GAP was also verified, showing complete satisfaction (100%) among the evaluated volunteers. It is concluded that the cryofrequency was effective for the treatment of localized adiposity, generating a positive satisfaction among the evaluated volunteers.

Keywords: Radiofrequency; Cryotherapy; Adipose Tissue.
    `;
    
    // Extract key information using OpenAI - with force reset to clear cached data
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

async function processDocumentById(documentId: string, userId: string | null, forceRefresh = false, corsHeaders: HeadersInit) {
  try {
    console.log(`Processing document with ID: ${documentId}, forceRefresh: ${forceRefresh}`);
    
    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documentos_tecnicos')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      return new Response(
        JSON.stringify({ error: 'Document not found', details: docError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found document: ${document.titulo}`);
    
    // Check if document has a URL
    if (!document.link_dropbox) {
      console.error('Document URL not found');
      return new Response(
        JSON.stringify({ error: 'Document URL not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Document URL: ${document.link_dropbox}`);
    
    // Check if we already have content extracted and force refresh is not set
    if (document.conteudo_extraido && !forceRefresh) {
      console.log("Document already has extracted content and no force refresh requested");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Document already has extracted content",
          documentId: documentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let extractedText = "";
    try {
      console.log("Attempting to fetch and extract text from PDF:", document.link_dropbox);
      // TODO: Implement PDF text extraction here using a suitable library (e.g., pdfjsLib for Deno)
      // after fetching from document.link_dropbox.
      // Example structure:
      // const response = await fetch(document.link_dropbox);
      // if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      // const pdfData = await response.arrayBuffer();
      // // const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      // // let text = '';
      // // for (let i = 1; i <= pdf.numPages; i++) {
      // //   const page = await pdf.getPage(i);
      // //   const content = await page.getTextContent();
      // //   text += content.items.map(item => item.str).join(' ');
      // // }
      // // extractedText = text;
      // For now, using placeholder mock text:
      if (document.link_dropbox) { // Only use mock if link exists
         extractedText = `# ${document.titulo}

## Resumo (mock)
Este estudo (mock) avaliou os efeitos da criofrequência na adiposidade localizada nos flancos. A amostra foi composta por 7 voluntárias, que realizaram 10 sessões de criofrequência. Conclui-se que a criofrequência foi eficaz.

## Introdução (mock)
A criofrequência é uma tecnologia inovadora...

## Palavras-chave (mock)
Radiofrequência, Crioterapia, Tecido Adiposo

## Autores (mock)
Nome Autor Um, Nome Autor Dois
`;
      } else {
        extractedText = `# ${document.titulo}\n\nNo PDF link provided. Using minimal mock text.`;
      }
      console.log("Successfully generated/mocked extracted text.");

    } catch (pdfError) {
      console.error("Error fetching or parsing PDF:", pdfError.message);
      extractedText = `# ${document.titulo}\n\nError extracting text from PDF. Using fallback content. Conteúdo original pode estar indisponível.`;
    }

    // Extract document info using OpenAI API directly
    const documentInfo = await extractDocumentInfo(extractedText, true); // forceReset is true to re-process
    console.log("Extracted document info:", documentInfo);

    // Generate embeddings
    let embeddingVector: number[] | null = null;
    if (OPENAI_API_KEY && extractedText && extractedText.trim() !== "") {
        console.log("Generating embeddings for the extracted text...");
        embeddingVector = await generateEmbeddings(extractedText, OPENAI_API_KEY);
        if (embeddingVector) {
            console.log("Embeddings generated successfully.");
        } else {
            console.warn("Failed to generate embeddings. Proceeding without them.");
        }
    } else {
        console.log("Skipping embedding generation as extracted text is empty or OpenAI key is missing.");
    }

    // Prepare data for Supabase update
    const updatePayload: {
      conteudo_extraido: string;
      status: string;
      titulo: string;
      resumo: string;
      keywords: string[];
      researchers: string[];
      vetor_embeddings?: number[]; // Optional embedding vector
    } = {
      conteudo_extraido: extractedText,
      status: 'ativo',
      titulo: documentInfo.title,
      resumo: documentInfo.summary,
      keywords: documentInfo.keywords || [],
      researchers: documentInfo.researchers || [],
    };

    if (embeddingVector) {
      updatePayload.vetor_embeddings = embeddingVector;
    }

    // Update document in database
    const { error: updateError } = await supabase
      .from('documentos_tecnicos')
      .update(updatePayload)
      .eq('id', documentId);

    if (updateError) {
        console.error('Failed to update document:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update document', details: updateError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log("Document updated successfully with extracted content and metadata");

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Document processed successfully",
          documentId: documentId,
          title: documentInfo.title,
          summary: documentInfo.summary,
          keywords: documentInfo.keywords,
          researchers: documentInfo.researchers
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error extracting text:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to extract text from document', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function generateEmbeddings(textToEmbed: string, apiKey: string): Promise<number[] | null> {
  if (!apiKey) {
    console.warn("OpenAI API key not provided. Cannot generate embeddings.");
    return null;
  }
  if (!textToEmbed || textToEmbed.trim() === "") {
    console.warn("Text to embed is empty. Cannot generate embeddings.");
    return null;
  }

  console.log("Requesting embeddings from OpenAI...");
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: textToEmbed,
        model: 'text-embedding-3-small', // Recommended model
      }),
    });

    if (response.ok) {
      const responseJson = await response.json();
      if (responseJson.data && responseJson.data.length > 0 && responseJson.data[0].embedding) {
        console.log("Embeddings received from OpenAI.");
        return responseJson.data[0].embedding;
      } else {
        console.error("OpenAI embeddings response does not contain expected data:", responseJson);
        return null;
      }
    } else {
      const errorStatus = response.status;
      const errorText = await response.text();
      console.error(`OpenAI Embeddings API error: ${errorStatus} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.error("Error calling OpenAI Embeddings API:", error.message);
    return null;
  }
}

async function extractDocumentInfo(text: string, forceReset = false) {
  try {
    // Always start with empty data when forceReset is true
    if (forceReset) {
      console.log("Forcing reset of extracted data");
    }
    
    if (!OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using sample data for development");
      
      // Use predefined sample data with real author names and keywords from the example text
      return {
        title: "EFFECTS OF CRYOFREQUENCY ON LOCALIZED ADIPOSITY IN FLANKS (Fallback)",
        summary: "Este é um resumo de exemplo do documento, gerado como fallback devido à ausência da chave da OpenAI ou erro na API.",
        conclusion: "Conclusão de fallback: A criofrequência parece ser eficaz.",
        keywords: ["Fallback", "Crioterapia", "Adiposidade"],
        researchers: [
          "Autor de Fallback 1",
          "Autor de Fallback 2"
        ]
      };
    }

    console.log("Calling OpenAI to extract document information, including summary");
    
    const systemPrompt = `You are a scientific paper metadata extraction system. Extract ONLY these exact fields from the document:

1. title: The complete title of the paper as it appears in the document.
2. summary: A concise summary of the paper's main content and findings. Should be about 2-4 sentences.
3. conclusion: The conclusion or final paragraph summary of the paper.
4. keywords: Array of keywords exactly as listed in the paper. If no keywords section, extract relevant terms from abstract/introduction.
5. researchers: Array with full names of ALL authors/researchers.

For researchers:
- Extract ALL author names that appear, typically at the beginning of the document or under the title.
- Do not miss any authors - they are crucial.
- Include complete names.
- Do not invent names - only extract what's in the document.

Return valid JSON with these exact fields. Do not explain or add comments. Example JSON:
{
  "title": "Example Title of a Research Paper",
  "summary": "This paper investigates the effects of X on Y, finding Z. The implications for future research are discussed.",
  "conclusion": "In conclusion, X significantly affects Y under conditions Z, supporting our hypothesis.",
  "keywords": ["X", "Y", "Z", "Research"],
  "researchers": ["Dr. Jane Doe", "Dr. John Smith"]
}`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a model that supports JSON mode and good instruction following
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Extract the title, summary, conclusion, keywords, and researchers from this scientific paper:\n\n${text}`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });
    
    if (openaiResponse.ok) {
      const openaiData = await openaiResponse.json();
      // It's good practice to check if choices array and message exist
      if (openaiData.choices && openaiData.choices.length > 0 && openaiData.choices[0].message) {
        const content = openaiData.choices[0].message.content;
      
        try {
          const extractedData = JSON.parse(content);
          console.log("Extracted data from OpenAI:", extractedData);

          return {
            title: extractedData.title || "Title not found",
            summary: extractedData.summary || "Summary not found",
            conclusion: extractedData.conclusion || "Conclusion not found",
            keywords: extractedData.keywords || [],
            researchers: extractedData.researchers || []
          };
        } catch (parseError) {
          console.error("Error parsing OpenAI JSON response:", parseError, "Content:", content);
          return { // Fallback if JSON parsing fails
            title: "Error: Could not parse title",
            summary: "Error: Could not parse summary",
            conclusion: "Error: Could not parse conclusion",
            keywords: ["parsing error"],
            researchers: ["parsing error"]
          };
        }
      } else {
        console.error("OpenAI response does not contain expected data structure:", openaiData);
        // Fallback if the response structure is not as expected
        return {
            title: "Error: Invalid OpenAI response structure",
            summary: "Error: Invalid OpenAI response structure",
            conclusion: "Error: Invalid OpenAI response structure",
            keywords: ["OpenAI response error"],
            researchers: ["OpenAI response error"]
        };
      }
    } else {
      const errorStatus = openaiResponse.status;
      const errorText = await openaiResponse.text();
      console.error(`OpenAI API error: ${errorStatus} - ${errorText}`);
      
      return { // Fallback for API errors
        title: `Error: OpenAI API ${errorStatus}`,
        summary: `Error: OpenAI API ${errorStatus}`,
        conclusion: `Error: OpenAI API ${errorStatus}`,
        keywords: ["API error"],
        researchers: ["API error"]
      };
    }
  } catch (error) {
    console.error("Error in extractDocumentInfo:", error.message);
    
    return { // General fallback for other errors in the function
      title: "Error: Processing failed",
      summary: "Error: Processing failed",
      conclusion: "Error: Processing failed",
      keywords: ["processing error"],
      researchers: ["processing error"]
    };
  }
}
