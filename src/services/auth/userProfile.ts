
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/auth";
import { DbPerfil } from "@/lib/supabase/schema-types";

// Type guard to ensure role is one of the allowed values
export function validateRole(role: string): UserRole {
  const validRoles: string[] = [
    'admin', 'gerente', 'operador', 'consultor', 'superadmin', 'cliente',
    'editAllContent', 'manageClients', 'viewSales'
  ];
  
  if (validRoles.includes(role)) {
    return role as UserRole;
  }
  return 'operador'; // Default to 'operador' if an invalid role is found
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Buscar perfil do usuário no Supabase
    const { data: userData, error: userError } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error("Erro ao buscar usuário:", userError);
      return null;
    }

    // Converter o formato do banco para o formato esperado pelo frontend
    const profile: UserProfile = {
      id: userData.id,
      email: userData.email,
      nome: userData.nome || '',
      role: validateRole(userData.role || 'operador'),
      city: userData.cidade,
      clinic: userData.clinica,
      phone: userData.telefone,
      equipment: userData.equipamentos,
      language: userData.idioma as "PT" | "EN" | "ES" | undefined,
      profilePhotoUrl: userData.foto_url,
      name: userData.nome || '' // Usar nome como name para compatibilidade
    };

    return profile;
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  // Converter do formato frontend para o formato do banco
  const userData: any = {};
  
  if (data.nome) userData.nome = data.nome;
  if (data.role) userData.role = data.role;
  if (data.clinic) userData.clinica = data.clinic;
  if (data.city) userData.cidade = data.city;
  if (data.phone) userData.telefone = data.phone;
  if (data.equipment) userData.equipamentos = data.equipment;
  if (data.language) userData.idioma = data.language;
  if (data.profilePhotoUrl) userData.foto_url = data.profilePhotoUrl;
  
  return await supabase
    .from('perfis')
    .update(userData)
    .eq('id', userId);
}
