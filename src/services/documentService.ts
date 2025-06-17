import { supabase } from '@/integrations/supabase/client';
import type { TechnicalDocument, GetDocumentsParams, DocumentType } from '@/types/document';
import { downloadPdf } from '@/utils/pdfUtils'; // Keep existing import

/**
 * Fetches documents from the Supabase 'documentos_tecnicos' table.
 *
 * @param params Optional parameters to filter and paginate the results.
 * @returns A promise that resolves to an array of TechnicalDocument.
 */
export async function getDocuments(params?: GetDocumentsParams): Promise<TechnicalDocument[]> {
  try {
    let query = supabase
      .from('documentos_tecnicos')
      .select(`
        id,
        titulo,
        descricao,
        resumo,
        tipo,
        equipamento_id,
        equipamento_nome,
        link_dropbox,
        arquivo_url,
        preview_url,
        pdfUrl,
        idioma_original,
        idiomas_traduzidos,
        status,
        data_criacao,
        criado_por,
        conteudo_extraido,
        keywords,
        researchers,
        vetor_embeddings,
        duracao,
        video_url
      `); // Ensure all fields from TechnicalDocument are selected

    // Filter by type
    const docType: DocumentType = params?.type || 'artigo_cientifico';
    query = query.eq('tipo', docType);

    // Filter by search term (title, description, or resumo)
    if (params?.search && params.search.trim() !== '') {
      const searchTerm = `%${params.search.trim()}%`;
      query = query.or(`titulo.ilike.${searchTerm},descricao.ilike.${searchTerm},resumo.ilike.${searchTerm}`);
    }

    // Filter by equipmentId
    if (params?.equipmentId) {
      query = query.eq('equipamento_id', params.equipmentId);
    }

    // Filter by projectId
    if (params?.projectId) {
      query = query.eq('project_id', params.projectId);
    }

    const limit = params?.limit || 20;
    query = query.limit(limit);

    if (params?.offset) {
      query = query.range(params.offset, params.offset + limit - 1);
    }

    query = query.order('data_criacao', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching documents:', error.message);
      return [];
    }

    return data as TechnicalDocument[] || [];
  } catch (error) {
    console.error('An unexpected error occurred in getDocuments:', error);
    return [];
  }
}

/**
 * Downloads a PDF file from the given URL.
 */
export const downloadPdfFile = async (url: string, filename?: string): Promise<void> => {
  try {
    await downloadPdf(url, filename);
  } catch (error) {
    console.error('Error downloading PDF file:', error);
    throw error;
  }
};

/**
 * Invokes the 'ask-document' Supabase Edge Function.
 */
export async function askDocumentQuestion(
  documentId: string,
  question: string,
  projectId?: string // Adicionado projectId opcional
): Promise<{ answer: string; sourceDocument?: string } | null> {
  try {
    // Nota: A Edge Function 'ask-document' precisará ser atualizada
    // para aceitar e usar o projectId ao salvar em 'perguntas_artigos'.
    const requestBody: { documentId: string; question: string; projectId?: string } = {
      documentId,
      question,
    };
    if (projectId) {
      requestBody.projectId = projectId;
    }

    const { data, error } = await supabase.functions.invoke('ask-document', {
      body: JSON.stringify(requestBody),
    });

    if (error) {
      console.error('Error invoking ask-document function:', error.message);
      let details = error.message;
      if (error.context && typeof error.context.message === 'string') details = error.context.message;
      else if (typeof error.context === 'string') details = error.context;
      return { answer: `Erro ao contatar o serviço de perguntas: ${details}`, sourceDocument: documentId };
    }

    if (data && typeof data.success === 'boolean') {
      if (data.success) return { answer: data.answer, sourceDocument: data.sourceDocument };
      else {
        console.error('ask-document function reported an error:', data.error, data.details);
        return { answer: `Erro ao processar a pergunta: ${data.error || data.details || 'Erro desconhecido.'}`, sourceDocument: data.sourceDocument || documentId };
      }
    }

    if (data && data.answer) return { answer: data.answer, sourceDocument: data.sourceDocument };

    console.warn('ask-document function returned an unexpected data structure or no data.', data);
    return { answer: "Resposta inesperada do serviço de perguntas.", sourceDocument: documentId };

  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error calling askDocumentQuestion:', error.message);
    return { answer: `Erro crítico ao tentar fazer a pergunta: ${error.message}`, sourceDocument: documentId };
  }
}

/**
 * Invokes the 'translate-document' Supabase Edge Function.
 */
export async function translateDocumentContent(
  documentId: string, // Included for potential logging or context in the Edge Function
  targetLanguage: string,
  textToTranslate: string,
  sourceLanguage?: string
): Promise<{ translatedText: string; language: string } | null> {
  try {
    const body: {
      text: string;
      target_lang: string;
      source_lang?: string;
      document_id?: string; // Optional, if your EF uses it
    } = {
      text: textToTranslate,
      target_lang: targetLanguage,
    };
    if (sourceLanguage) body.source_lang = sourceLanguage;
    // body.document_id = documentId; // Add if your Edge Function expects/uses it

    const { data, error } = await supabase.functions.invoke('translate-document', {
      body: JSON.stringify(body),
    });

    if (error) {
      console.error('Error invoking translate-document function:', error.message);
      // Consider returning a structured error if your component can handle it
      return null;
    }

    // Assuming the Edge Function returns { translated_text: "...", language_code: "..." }
    // or similar upon successful translation.
    if (data && data.translated_text && data.language_code) {
      return {
        translatedText: data.translated_text,
        language: data.language_code,
      };
    }

    console.warn('translate-document function returned unexpected data structure:', data);
    return null;
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error calling translateDocumentContent:', error.message);
    return null;
  }
}

/**
 * Updates a document in the 'documentos_tecnicos' table.
 */
export async function updateDocument(
  documentId: string,
  updateData: Partial<TechnicalDocument>
): Promise<TechnicalDocument | null> {
  try {
    const { data, error } = await supabase
      .from('documentos_tecnicos')
      .update(updateData)
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error.message);
      return null;
    }

    return data as TechnicalDocument | null;
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error in updateDocument:', error.message);
    return null;
  }
}

/**
 * Searches for articles semantically similar to a given query embedding.
 *
 * @param queryEmbedding The embedding vector of the search query.
 * @param topK The maximum number of similar articles to return.
 * @param articleType The type of article to search for (defaults to 'artigo_cientifico').
 * @param matchThreshold The similarity threshold (defaults to 0.7).
 * @returns A promise that resolves to an array of TechnicalDocument or null in case of error.
 */
export async function searchSimilarArticles(
  queryEmbedding: number[],
  topK: number = 5,
  articleType: DocumentType = 'artigo_cientifico',
  matchThreshold: number = 0.7,
  projectId?: string // Adicionado projectId opcional
): Promise<TechnicalDocument[] | null> {
  if (!queryEmbedding || queryEmbedding.length === 0) {
    console.error("Query embedding is required for semantic search.");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('semantic-search-articles', {
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_count: topK,
        article_type: articleType,
        match_threshold: matchThreshold,
        project_id: projectId // Passa o projectId para a Edge Function
      }),
    });

    if (error) {
      console.error('Error invoking semantic-search-articles function:', error.message);
      return null;
    }

    // The Edge Function is expected to return an array of documents directly
    // (matching the structure returned by the 'match_documents' RPC).
    // The RPC returns more fields than TechnicalDocument might have,
    // but TS will only map known fields. Ensure 'similarity' is handled if needed.
    return data as TechnicalDocument[] || [];
  } catch (e) {
    const error = e as Error;
    console.error('Unexpected error calling searchSimilarArticles:', error.message);
    return null;
  }
}
