
import { supabase } from '@/integrations/supabase/client';
import { ScriptType } from './api';
import { marked } from 'marked';

export interface ScriptHistoryItem {
  id: string;
  title: string;
  content: string;
  contentHtml: string;
  type: ScriptType;
  status: 'gerado' | 'aprovado' | 'editado';
  createdAt: string;
  marketingObjective?: string;
  observation?: string;
  pdf_url?: string;
  evento_agenda_id?: string;
}

// Obter histórico de roteiros
export const getScriptHistory = async (): Promise<ScriptHistoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('roteiros')
      .select('*')
      .order('data_criacao', { ascending: false });
      
    if (error) throw error;
    
    // Converter de Markdown para HTML para exibição
    return (data || []).map(item => {
      // Usar marked de forma síncrona para converter Markdown para HTML
      const contentHtml = marked.parse(item.conteudo || '', { async: false }) as string;
      
      return {
        id: item.id,
        title: item.titulo,
        content: item.conteudo,
        contentHtml,
        type: item.tipo as ScriptType,
        status: (item.status || 'gerado') as 'gerado' | 'aprovado' | 'editado',
        createdAt: item.data_criacao,
        marketingObjective: item.tipo, // Usar tipo como fallback
        observation: item.observacoes,
        pdf_url: item.pdf_url,
        evento_agenda_id: item.evento_agenda_id
      };
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de roteiros:', error);
    throw error;
  }
};

// Obter um roteiro específico
export const getScriptById = async (id: string): Promise<ScriptHistoryItem> => {
  try {
    const { data, error } = await supabase
      .from('roteiros')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Converter de Markdown para HTML para exibição
    // Usar marked de forma síncrona para evitar Promise<string>
    const contentHtml = marked.parse(data.conteudo || '', { async: false }) as string;
    
    return {
      id: data.id,
      title: data.titulo,
      content: data.conteudo,
      contentHtml,
      type: data.tipo as ScriptType,
      status: (data.status || 'gerado') as 'gerado' | 'aprovado' | 'editado',
      createdAt: data.data_criacao,
      marketingObjective: data.tipo, // Usar tipo como fallback
      observation: data.observacoes,
      pdf_url: data.pdf_url,
      evento_agenda_id: data.evento_agenda_id
    };
  } catch (error) {
    console.error(`Erro ao buscar roteiro ID ${id}:`, error);
    throw error;
  }
};

// Atualizar um roteiro existente
export const updateScript = async (
  id: string, 
  content: string, 
  feedback?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('roteiros')
      .update({
        conteudo: content,
        observacoes: feedback,
        status: feedback ? 'editado' : undefined
      })
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao atualizar roteiro ID ${id}:`, error);
    throw error;
  }
};

// Gerar PDF do roteiro
export const generateScriptPDF = async (scriptId: string): Promise<string | null> => {
  try {
    const { data: script } = await supabase
      .from('roteiros')
      .select('*')
      .eq('id', scriptId)
      .single();

    if (!script) throw new Error('Roteiro não encontrado');

    // Chamar edge function para gerar PDF
    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: {
        scriptId,
        content: script.conteudo,
        title: script.titulo,
        type: script.tipo
      }
    });

    if (error) throw error;

    // Atualizar URL do PDF no banco
    if (data.pdfUrl) {
      await supabase
        .from('roteiros')
        .update({ pdf_url: data.pdfUrl })
        .eq('id', scriptId);
    }

    return data.pdfUrl;
  } catch (error) {
    console.error(`Erro ao gerar PDF do roteiro ID ${scriptId}:`, error);
    return null;
  }
};

// Associar roteiro à agenda
export const linkScriptToCalendar = async (
  scriptId: string,
  eventId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('roteiros')
      .update({ evento_agenda_id: eventId })
      .eq('id', scriptId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao vincular roteiro ${scriptId} ao evento ${eventId}:`, error);
    return false;
  }
};
