
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export async function loginWithEmailAndPassword(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Executa upsert com retry e backoff exponencial
 */
async function upsertProfileWithRetry(userId: string, profileData: any, maxRetries = 5): Promise<void> {
  const delays = [200, 400, 800, 1600, 3200]; // ms
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { error } = await supabase
        .from('perfis')
        .upsert({ 
          id: userId, 
          ...profileData
        }, {
          onConflict: 'id'
        });

      if (!error) {
        return; // Sucesso
      }

      // Se é o último attempt, lança o erro
      if (attempt === maxRetries - 1) {
        throw error;
      }

      console.warn(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delays[attempt]}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      console.warn(`Tentativa ${attempt + 1} falhou com erro:`, error);
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
    }
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  clinic?: string;
  city?: string;
  phone?: string;
  equipment?: string[];
  language?: "PT" | "EN" | "ES";
}) {
  // Preparar metadata completo
  const metadata: any = {
    nome: userData.name,
  };

  // Adicionar campos adicionais se fornecidos
  if (userData.phone?.trim()) metadata.telefone = userData.phone.trim();
  if (userData.city?.trim()) metadata.cidade = userData.city.trim();
  if (userData.clinic?.trim()) metadata.clinica = userData.clinic.trim();
  if (userData.equipment && userData.equipment.length > 0) metadata.equipamentos = userData.equipment;
  if (userData.language) metadata.idioma = userData.language;

  // Registrar o usuário no auth com metadata completo
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: metadata,
    },
  });

  if (authError || !authData.user) {
    throw authError;
  }

  // Verificar se existe algum convite para o e-mail
  const { data: inviteData } = await supabase
    .from('user_invites')
    .select('*, workspace_id')
    .eq('email_convidado', userData.email)
    .eq('status', 'pendente')
    .single();

  if (inviteData) {
    // Se existe um convite, fazer upsert com role do convite
    const profileData = {
      nome: userData.name,
      role: inviteData.role_sugerido,
      telefone: metadata.telefone,
      cidade: metadata.cidade,
      clinica: metadata.clinica,
      equipamentos: metadata.equipamentos,
      idioma: metadata.idioma
    };

    await upsertProfileWithRetry(authData.user.id, profileData);

    // Atualizar o status do convite
    await supabase
      .from('user_invites')
      .update({ 
        status: 'aceito',
        atualizado_em: new Date().toISOString() 
      })
      .eq('id', inviteData.id);

    return authData;
  }
  
  // Aguardar para o trigger processar
  await new Promise(resolve => setTimeout(resolve, 300));

  // IMPORTANTE: Só fazer upsert se temos uma sessão ativa (confirmação de email desabilitada)
  // Se não temos sessão, significa que precisa confirmar email e o trigger já criou o perfil básico
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session && (userData.clinic || userData.city || userData.phone || userData.equipment || userData.language)) {
    const profileData = {
      nome: userData.name,
      clinica: userData.clinic,
      cidade: userData.city,
      telefone: userData.phone,
      equipamentos: userData.equipment && userData.equipment.length > 0 ? userData.equipment : undefined,
      idioma: userData.language
    };

    // Remover campos undefined
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    await upsertProfileWithRetry(authData.user.id, profileData);
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
