
import { supabase } from "@/integrations/supabase/client";

export async function fetchUserScripts(userId: string) {
  const { data, error } = await supabase
    .from('roteiros')
    .select('id, titulo, conteudo, tipo, data_criacao, status')
    .eq('usuario_id', userId)
    .order('data_criacao', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao buscar roteiros do usuário:", error);
    return [];
  }
  return data || [];
}

export async function fetchUserContentPlanner(userId: string) {
  const { data, error } = await supabase
    .from('content_planner_items')
    .select('id, title, description, status, created_at, format, objective, tags')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao buscar content planner do usuário:", error);
    return [];
  }
  return data || [];
}

export async function fetchUserEquipments(userId: string) {
  // Fetch perfil to get user's equipamentos (IDs or names)
  const { data: perfis, error } = await supabase
    .from('perfis')
    .select('equipamentos')
    .eq('id', userId)
    .single();

  if (error || !perfis) {
    console.error("Erro ao buscar equipamentos do perfil:", error);
    return [];
  }

  // Pode ser array de nomes ou IDs, depende dos dados da tabela
  return perfis.equipamentos || [];
}
