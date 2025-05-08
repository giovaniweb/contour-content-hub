
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { User } from "@supabase/supabase-js";

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Buscar perfil do usuário no Supabase
    const { data: perfil, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !perfil) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }

    // Type guard to ensure role is one of the allowed values
    const validateRole = (role: string): 'cliente' | 'admin' | 'operador' | 'vendedor' => {
      if (role === 'cliente' || role === 'admin' || role === 'operador' || role === 'vendedor') {
        return role;
      }
      return 'cliente'; // Default to 'cliente' if an invalid role is found
    };

    // Converter o formato do banco para o formato esperado pelo frontend
    return {
      id: perfil.id,
      name: perfil.nome || '',
      email: perfil.email,
      clinic: perfil.clinica || '',
      city: perfil.cidade || '',
      phone: perfil.telefone || '',
      equipment: perfil.equipamentos || [],
      language: (perfil.idioma?.toUpperCase() as "PT" | "EN" | "ES") || "EN",
      profilePhotoUrl: perfil.foto_url || '/placeholder.svg',
      passwordChanged: true, // Presumimos que usuários no banco já alteraram a senha
      role: validateRole(perfil.role || 'cliente')
    };
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    return null;
  }
}

export async function loginWithEmailAndPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language: "PT" | "EN" | "ES";
}) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        nome: userData.name,
      },
    },
  });

  if (authError || !authData.user) {
    throw authError;
  }

  // Update the profile with additional data
  const { error: updateError } = await supabase
    .from('perfis')
    .update({
      nome: userData.name,
      clinica: userData.clinic,
      cidade: userData.city,
      telefone: userData.phone,
      equipamentos: userData.equipment || [],
      idioma: userData.language.toLowerCase(),
      role: 'cliente'  // Novos usuários sempre começam como clientes
    })
    .eq('id', authData.user.id);
    
  if (updateError) {
    console.error("Erro ao atualizar perfil:", updateError);
    throw updateError;
  }

  return authData;
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}

export async function updateUserPassword(newPassword: string) {
  return await supabase.auth.updateUser({
    password: newPassword
  });
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  // Converter do formato frontend para o formato do banco
  const perfilData: any = {};
  
  if (data.name) perfilData.nome = data.name;
  if (data.clinic) perfilData.clinica = data.clinic;
  if (data.city) perfilData.cidade = data.city;
  if (data.phone) perfilData.telefone = data.phone;
  if (data.equipment) perfilData.equipamentos = data.equipment;
  if (data.language) perfilData.idioma = data.language.toLowerCase();
  if (data.profilePhotoUrl) perfilData.foto_url = data.profilePhotoUrl;
  
  return await supabase
    .from('perfis')
    .update(perfilData)
    .eq('id', userId);
}
