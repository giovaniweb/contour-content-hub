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
 * Normaliza os dados do usuário removendo campos vazios
 */
function normalizeUserData(userData: CreateUserData) {
  const normalized: any = {
    nome: userData.nome,
    email: userData.email,
    role: userData.role
  };

  // Adicionar apenas campos que não estão vazios
  if (userData.telefone?.trim()) normalized.telefone = userData.telefone.trim();
  if (userData.cidade?.trim()) normalized.cidade = userData.cidade.trim();
  if (userData.clinica?.trim()) normalized.clinica = userData.clinica.trim();
  if (userData.especialidade?.trim()) normalized.especialidade = userData.especialidade.trim();
  if (userData.estado?.trim()) normalized.estado = userData.estado.trim();
  if (userData.endereco_completo?.trim()) normalized.endereco_completo = userData.endereco_completo.trim();
  if (userData.observacoes_conteudo?.trim()) normalized.observacoes_conteudo = userData.observacoes_conteudo.trim();
  if (userData.equipamentos && userData.equipamentos.length > 0) normalized.equipamentos = userData.equipamentos;
  if (userData.idioma) normalized.idioma = userData.idioma;
  if (userData.foto_url?.trim()) normalized.foto_url = userData.foto_url.trim();

  return normalized;
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
          ...profileData,
          updated_at: new Date().toISOString()
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

/**
 * Cria um novo usuário completo (auth + perfil)
 */
export async function createCompleteUser(userData: CreateUserData): Promise<void> {
  console.log('🚀 [createCompleteUser] Iniciando criação de usuário:', { 
    email: userData.email, 
    nome: userData.nome,
    role: userData.role,
    hasEquipamentos: !!userData.equipamentos?.length
  });

  try {
    // Verificar se já existe perfil
    const hasProfile = await checkExistingProfile(userData.email);
    if (hasProfile) {
      throw new Error('Usuário já existe e possui perfil completo');
    }

    // Normalizar dados
    const normalizedData = normalizeUserData(userData);
    console.log('📊 [createCompleteUser] Dados normalizados:', normalizedData);

    // Preparar metadata completo para o signUp
    const metadata = {
      nome: normalizedData.nome,
      role: normalizedData.role,
      telefone: normalizedData.telefone,
      cidade: normalizedData.cidade,
      clinica: normalizedData.clinica,
      especialidade: normalizedData.especialidade,
      estado: normalizedData.estado,
      endereco_completo: normalizedData.endereco_completo,
      equipamentos: normalizedData.equipamentos || null,
      observacoes_conteudo: normalizedData.observacoes_conteudo,
      idioma: normalizedData.idioma || 'PT',
      foto_url: normalizedData.foto_url
    };

    console.log('📝 [createCompleteUser] Metadata preparado:', metadata);

    // Criar usuário no auth com metadata completo
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata
      }
    });

    if (authError) {
      console.error('❌ [createCompleteUser] Erro no auth.signUp:', authError);
      if (authError.message.includes('User already registered')) {
        throw new Error(
          'Este email já está registrado. Se você esqueceu a senha, use a opção de recuperação de senha na tela de login.'
        );
      }
      throw new Error(`Erro na autenticação: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário: dados de autenticação não retornados');
    }

    console.log('✅ [createCompleteUser] Usuário criado no auth:', authData.user.id);

    // Aguardar para o trigger processar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o trigger criou o perfil básico
    console.log('🔍 [createCompleteUser] Verificando se trigger criou perfil básico...');
    const { data: existingProfile, error: checkError } = await supabase
      .from('perfis')
      .select('id, nome, role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (checkError) {
      console.error('❌ [createCompleteUser] Erro ao verificar perfil criado pelo trigger:', checkError);
    } else {
      console.log('📊 [createCompleteUser] Status do perfil após trigger:', { 
        exists: !!existingProfile,
        profile: existingProfile 
      });
    }

    // Fazer upsert com retry para garantir que todos os dados são salvos
    try {
      console.log('🔄 [createCompleteUser] Fazendo upsert com retry...');
      await upsertProfileWithRetry(authData.user.id, normalizedData);
      console.log('✅ [createCompleteUser] Upsert concluído com sucesso');
    } catch (upsertError) {
      console.error('❌ [createCompleteUser] Erro no upsert:', upsertError);
      throw new Error(`Erro ao salvar perfil completo: ${upsertError.message}`);
    }

    // Enviar email de boas-vindas
    try {
      console.log('📧 [createCompleteUser] Enviando email de confirmação...');
      await supabase.functions.invoke('send-signup-confirmation', {
        body: {
          email: userData.email,
          name: userData.nome,
          userId: authData.user.id,
          isAdminCreated: true
        }
      });
      console.log('✅ [createCompleteUser] Email enviado com sucesso');
    } catch (emailError) {
      console.warn('⚠️ [createCompleteUser] Erro ao enviar email (não crítico):', emailError);
      // Não falhar o processo por causa do email
    }

    console.log('🎉 [createCompleteUser] Usuário criado com sucesso!');
  } catch (error: any) {
    console.error('❌ [createCompleteUser] Erro crítico:', error);
    throw new Error(`Database error saving new user: ${error.message || error}`);
  }
}