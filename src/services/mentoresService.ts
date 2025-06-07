
import { supabase } from '@/integrations/supabase/client';

export interface Mentor {
  id?: string;
  nome: string;
  descricao: string;
  estilo: string;
  uso_ideal: string;
  tom: string;
  exemplos: string[];
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const cadastrarMentor = async (mentor: Omit<Mentor, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    console.log('Cadastrando mentor:', mentor.nome);
    
    const { data, error } = await supabase
      .from('mentores')
      .insert({
        nome: mentor.nome,
        descricao: mentor.descricao,
        estilo: mentor.estilo,
        uso_ideal: mentor.uso_ideal,
        tom: mentor.tom,
        exemplos: mentor.exemplos,
        ativo: mentor.ativo ?? true
      });
      
    if (error) {
      console.error('Erro ao cadastrar mentor:', error);
      throw error;
    }
    
    console.log('Mentor cadastrado com sucesso:', mentor.nome);
    return true;
  } catch (error) {
    console.error('Erro no cadastrarMentor:', error);
    throw error;
  }
};

export const listarMentores = async (): Promise<Mentor[]> => {
  try {
    const { data, error } = await supabase
      .from('mentores')
      .select('*')
      .eq('ativo', true)
      .order('nome');
      
    if (error) {
      console.error('Erro ao listar mentores:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro no listarMentores:', error);
    throw error;
  }
};

export const buscarMentorPorNome = async (nome: string): Promise<Mentor | null> => {
  try {
    const { data, error } = await supabase
      .from('mentores')
      .select('*')
      .eq('nome', nome)
      .eq('ativo', true)
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao buscar mentor:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro no buscarMentorPorNome:', error);
    throw error;
  }
};
