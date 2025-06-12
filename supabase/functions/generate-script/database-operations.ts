
export async function saveScriptToDatabase(supabaseAdmin: any, scriptData: any) {
  try {
    console.log("💾 Salvando roteiro no banco de dados...");
    
    const { data, error } = await supabaseAdmin
      .from('roteiros_gerados')
      .insert([scriptData]);

    if (error) {
      console.error("❌ Erro ao salvar no banco:", error);
      throw error;
    }

    console.log("✅ Roteiro salvo com sucesso no banco");
    return data;
  } catch (error) {
    console.error("🔥 Erro crítico ao salvar no banco:", error);
    throw error;
  }
}

export async function getUserFromToken(supabaseAdmin: any, token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      console.error("❌ Erro ao obter usuário:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("❌ Erro ao processar token:", error);
    return null;
  }
}
