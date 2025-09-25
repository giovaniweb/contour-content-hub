/**
 * Utilitário para debug de permissões
 */
export const clearPermissionsCache = () => {
  console.log('🧹 [Debug] Limpando cache de permissões...');
  localStorage.removeItem('feature_permissions_cache');
  localStorage.removeItem('feature_notifications_cache');
  console.log('✅ [Debug] Cache limpo!');
};

export const debugUserPermissions = () => {
  const permCache = localStorage.getItem('feature_permissions_cache');
  const notifCache = localStorage.getItem('feature_notifications_cache');
  
  console.log('🔍 [Debug] Estado atual do cache:', {
    permissions: permCache ? JSON.parse(permCache) : 'Nenhum cache',
    notifications: notifCache ? JSON.parse(notifCache) : 'Nenhum cache'
  });
  
  const authData = localStorage.getItem('sb-mksvzhgqnsjfolvskibq-auth-token');
  console.log('🔍 [Debug] Token de auth presente:', !!authData);
  
  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData);
      console.log('🔍 [Debug] Usuário logado:', {
        email: parsedAuth.user?.email,
        id: parsedAuth.user?.id,
        role: parsedAuth.user?.user_metadata?.role
      });
    } catch (e) {
      console.log('❌ [Debug] Erro ao parsear auth data');
    }
  }
};

// Disponibilizar globalmente para debug no console
if (typeof window !== 'undefined') {
  (window as any).debugPermissions = {
    clearCache: clearPermissionsCache,
    debug: debugUserPermissions
  };
  
  console.log('🛠️ [Debug] Funções de debug disponíveis:');
  console.log('- window.debugPermissions.clearCache() - Limpa cache de permissões');
  console.log('- window.debugPermissions.debug() - Mostra estado atual');
}