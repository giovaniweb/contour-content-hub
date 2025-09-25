// Temporary debug script - run this in console to check current user
console.log('🔍 [Debug] Verificando usuário atual...');

// Check localStorage auth data
const authData = localStorage.getItem('sb-mksvzhgqnsjfolvskibq-auth-token');
if (authData) {
  try {
    const parsedAuth = JSON.parse(authData);
    console.log('🔍 [Debug] Usuário logado:', {
      id: parsedAuth.user?.id,
      email: parsedAuth.user?.email,
      role: parsedAuth.user?.user_metadata?.role
    });
  } catch (e) {
    console.log('❌ [Debug] Erro ao parsear auth data');
  }
}

// Clear permissions cache
console.log('🧹 [Debug] Limpando cache de permissões...');
localStorage.removeItem('feature_permissions_cache');
localStorage.removeItem('feature_notifications_cache');

// Check which user should be used for testing
console.log('📝 [Debug] Para testar bloqueios:');
console.log('✅ Use: giovani.g2008@gmail.com (role: user)');
console.log('❌ NÃO use: giovani.g@live.com (role: superadmin - bypassa bloqueios)');

console.log('🔄 [Debug] Recarregue a página após limpar o cache.');