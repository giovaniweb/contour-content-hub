
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
      // Usar marked para converter Markdown para HTML
      const contentHtml = marked(item.conteudo);
      
      return {
        id: item.id,
        title: item.titulo,
        content: item.conteudo,
        contentHtml,
        type: item.tipo as ScriptType,
        status: item.status,
        createdAt: item.data_criacao,
        marketingObjective: item.objetivo_marketing,
        observation: item.observacoes
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
    const contentHtml = marked(data.conteudo);
    
    return {
      id: data.id,
      title: data.titulo,
      content: data.conteudo,
      contentHtml,
      type: data.tipo as ScriptType,
      status: data.status,
      createdAt: data.data_criacao,
      marketingObjective: data.objetivo_marketing,
      observation: data.observacoes
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
