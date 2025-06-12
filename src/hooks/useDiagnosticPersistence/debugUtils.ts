
export const debugDiagnosticPersistence = () => {
  console.log('🔍 DEBUG: Verificando dados de diagnóstico...');
  
  // Verificar localStorage
  const currentSessionKey = 'fluida_current_diagnostic';
  const currentSession = localStorage.getItem(currentSessionKey);
  console.log('📱 LocalStorage currentSession:', currentSession ? JSON.parse(currentSession) : 'null');
  
  // Verificar outros dados no localStorage
  const allKeys = Object.keys(localStorage).filter(key => 
    key.includes('fluida') || key.includes('diagnostic') || key.includes('marketing')
  );
  console.log('🗂️ Todas as chaves relacionadas no localStorage:', allKeys);
  
  allKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      console.log(`📄 ${key}:`, data ? JSON.parse(data) : data);
    } catch (e) {
      console.log(`📄 ${key}:`, localStorage.getItem(key));
    }
  });
};

export const syncLocalStorageWithState = (savedDiagnostics: any[], currentSession: any) => {
  console.log('🔄 Sincronizando dados...');
  console.log('💾 savedDiagnostics no estado:', savedDiagnostics);
  console.log('📱 currentSession no estado:', currentSession);
  
  // Verificar se há discrepância
  const localCurrentSession = localStorage.getItem('fluida_current_diagnostic');
  if (localCurrentSession && !currentSession) {
    console.warn('⚠️ DISCREPÂNCIA: LocalStorage tem sessão mas estado não');
    return JSON.parse(localCurrentSession);
  }
  
  return null;
};
