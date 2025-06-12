
// Funções para interagir com o banco de dados
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export interface ScriptData {
  usuario_id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  status: 'gerado' | 'aprovado' | 'editado';
  objetivo_marketing?: string | null;
}

export async function saveScriptToDatabase(
  supabase: SupabaseClient,
  scriptData: ScriptData
): Promise<void> {
  try {
    console.log('💾 Tentando salvar roteiro no banco:', scriptData);
    
    const { error } = await supabase
      .from('roteiros')
      .insert(scriptData);
      
    if (error) {
      console.error('❌ Erro ao salvar roteiro:', error);
      // Não vamos fazer throw do erro para não quebrar o fluxo
      console.log('⚠️ Continuando sem salvar no banco - roteiro será retornado normalmente');
    } else {
      console.log('✅ Roteiro salvo com sucesso no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro inesperado ao salvar roteiro:', error);
    // Não vamos fazer throw do erro para não quebrar o fluxo
    console.log('⚠️ Continuando sem salvar no banco - roteiro será retornado normalmente');
  }
}

export async function getUserFromToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ id: string } | null> {
  try {
    const { data: userData, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return null;
    }
    
    if (userData.user) {
      console.log('✅ Usuário autenticado:', userData.user.id);
      return { id: userData.user.id };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro inesperado ao obter usuário:', error);
    return null;
  }
}
