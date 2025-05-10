
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  user_id: string;
  estilo_preferido?: string | null;
  tipos_conteudo_validados?: string[] | null;
  foco_comunicacao?: string | null;
  perfil_comportamental?: string[] | null;
  insights_performance?: string[] | null;
}

export interface ScriptFeedback {
  user_id: string;
  script_id: string;
  feedback_tipo: 'aprovado' | 'ignorado' | 'descartado';
  estilo_detectado?: string;
  formato?: string;
  tema_principal?: string;
}

export interface ValidatedIdea {
  user_id: string;
  origem_ideia: string;
  tipo_validacao: 'aprovado' | 'usado' | 'publicado';
  tema: string;
  formato: string;
}

export interface ValidatedArticle {
  user_id: string;
  article_link: string;
  tema: string;
  foco: string;
  tipo_interacao: 'clicado' | 'salvo' | 'usado';
}

// Função para obter o perfil do usuário
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

// Função para criar ou atualizar o perfil do usuário
export async function upsertUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para atualizar seu perfil.",
        variant: "destructive",
      });
      return false;
    }
    
    const user_id = session.user.id;
    
    // Verifica se o perfil existe
    const { data: existingProfile } = await supabase
      .from('user_profile')
      .select('user_id')
      .eq('user_id', user_id)
      .single();
    
    let result;
    
    if (existingProfile) {
      // Atualiza o perfil existente
      result = await supabase
        .from('user_profile')
        .update({
          ...profile,
          atualizado_em: new Date().toISOString(),
        })
        .eq('user_id', user_id);
    } else {
      // Cria um novo perfil
      result = await supabase
        .from('user_profile')
        .insert({
          user_id,
          ...profile,
        });
    }
    
    if (result.error) {
      console.error('Erro ao salvar perfil:', result.error);
      toast({
        title: "Erro ao salvar perfil",
        description: result.error.message,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    return false;
  }
}

// Função para registrar feedback de roteiro
export async function addScriptFeedback(feedback: ScriptFeedback): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { error } = await supabase
      .from('script_feedback')
      .insert({
        user_id: session.user.id,
        script_id: feedback.script_id,
        feedback_tipo: feedback.feedback_tipo,
        estilo_detectado: feedback.estilo_detectado,
        formato: feedback.formato,
        tema_principal: feedback.tema_principal,
      });
    
    if (error) {
      console.error('Erro ao registrar feedback:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar feedback:', error);
    return false;
  }
}

// Função para registrar ideia validada
export async function addValidatedIdea(idea: ValidatedIdea): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { error } = await supabase
      .from('validated_ideas')
      .insert({
        user_id: session.user.id,
        origem_ideia: idea.origem_ideia,
        tipo_validacao: idea.tipo_validacao,
        tema: idea.tema,
        formato: idea.formato,
      });
    
    if (error) {
      console.error('Erro ao registrar ideia validada:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar ideia validada:', error);
    return false;
  }
}

// Função para registrar artigo validado
export async function addValidatedArticle(article: ValidatedArticle): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { error } = await supabase
      .from('validated_articles')
      .insert({
        user_id: session.user.id,
        article_link: article.article_link,
        tema: article.tema,
        foco: article.foco,
        tipo_interacao: article.tipo_interacao,
      });
    
    if (error) {
      console.error('Erro ao registrar artigo validado:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao registrar artigo validado:', error);
    return false;
  }
}
