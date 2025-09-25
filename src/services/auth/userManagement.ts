import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export interface CreateUserData {
  nome: string;
  email: string;
  password: string;
  role: UserRole;
  cidade?: string;
  clinica?: string;
  telefone?: string;
  especialidade?: string;
  experiencia?: string;
  estado?: string;
  endereco_completo?: string;
  equipamentos?: string[];
  observacoes_conteudo?: string;
  idioma?: "PT" | "EN" | "ES";
  foto_url?: string;
}

/**
 * Verifica se existe um usuário com perfil na tabela perfis
 */
export async function checkExistingProfile(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar perfil existente:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar perfil existente:', error);
    return false;
  }
}

/**
 * Tenta criar um perfil para usuário que pode já existir no auth
 */
export async function createProfileForExistingUser(userData: CreateUserData): Promise<boolean> {
  try {
    // Tentar buscar o usuário atual autenticado (se existir)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return false;
    }

    // Verificar se é o mesmo email
    if (user.email !== userData.email) {
      return false;
    }

    // Criar perfil para usuário existente
    const { error: insertError } = await supabase
      .from('perfis')
      .insert({
        id: user.id,
        nome: userData.nome,
        email: userData.email,
        role: userData.role,
        cidade: userData.cidade,
        clinica: userData.clinica,
        telefone: userData.telefone,
        especialidade: userData.especialidade,
        estado: userData.estado,
        endereco_completo: userData.endereco_completo,
        equipamentos: userData.equipamentos,
        observacoes_conteudo: userData.observacoes_conteudo,
        idioma: userData.idioma || 'PT',
        foto_url: userData.foto_url
      });

    return !insertError;
  } catch (error) {
    console.error('Erro ao criar perfil para usuário existente:', error);
    return false;
  }
}

/**
 * Cria um novo usuário completo (auth + perfil)
 */
export async function createCompleteUser(userData: CreateUserData): Promise<void> {
  try {
    // Verificar se já existe perfil
    const hasProfile = await checkExistingProfile(userData.email);
    if (hasProfile) {
      throw new Error('Usuário já existe e possui perfil completo');
    }

    // Tentar criar novo usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome: userData.nome,
          role: userData.role
        }
      }
    });

    if (authError) {
      // Se erro de usuário já registrado, o trigger deve ter criado o perfil
      if (authError.message.includes('User already registered')) {
        throw new Error(
          'Este email já está registrado. Se você esqueceu a senha, use a opção de recuperação de senha na tela de login.'
        );
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário: dados de autenticação não retornados');
    }

    // Aguardar um pouco para o trigger criar o perfil
    await new Promise(resolve => setTimeout(resolve, 500));

    // Atualizar perfil com informações adicionais
    const { error: profileError } = await supabase
      .from('perfis')
      .update({
        nome: userData.nome,
        role: userData.role,
        cidade: userData.cidade,
        clinica: userData.clinica,
        telefone: userData.telefone,
        especialidade: userData.especialidade,
        estado: userData.estado,
        endereco_completo: userData.endereco_completo,
        equipamentos: userData.equipamentos,
        observacoes_conteudo: userData.observacoes_conteudo,
        idioma: userData.idioma || 'PT',
        foto_url: userData.foto_url
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Erro ao atualizar perfil:', profileError);
      // Não falhar aqui, o perfil básico foi criado
    }
  } catch (error) {
    console.error('Erro em createCompleteUser:', error);
    throw error;
  }
}