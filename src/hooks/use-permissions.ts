
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const usePermissions = () => {
  const { user, refreshAuth, validateAuthState } = useAuth();
  const [hasCheckedConsistency, setHasCheckedConsistency] = useState(false);

  // Auto-check for role inconsistencies on mount
  useEffect(() => {
    if (user?.id && !hasCheckedConsistency) {
      checkRoleConsistency();
    }
  }, [user?.id, hasCheckedConsistency]);

  const checkRoleConsistency = async () => {
    if (!user?.id) return;
    
    try {
      const { data: dbProfile } = await supabase
        .from('perfis')
        .select('role, email')
        .eq('id', user.id)
        .single();
      
      if (dbProfile && dbProfile.role !== user.role) {
        console.log('🚨 INCONSISTÊNCIA DE ROLE DETECTADA!', {
          frontendRole: user.role,
          databaseRole: dbProfile.role
        });
        
        toast.warning('Detectada inconsistência de permissões. Corrigindo automaticamente...', {
          duration: 3000
        });
        
        // Force auth refresh to sync data
        await refreshAuth();
        
        setTimeout(() => {
          toast.success('Permissões atualizadas com sucesso!');
        }, 1500);
      }
      
      setHasCheckedConsistency(true);
    } catch (error) {
      console.error('❌ Erro ao verificar consistência de role:', error);
      setHasCheckedConsistency(true);
    }
  };

  const isAdmin = async (forceDbCheck = false, useServiceFallback = false) => {
    if (!user) return false;
    
    // Quick check from cache
    const cacheResult = user?.role === 'admin' || user?.role === 'superadmin';
    console.log('🔐 isAdmin cache check:', { userRole: user?.role, isAdmin: cacheResult });
    
    // If forcing database check or cache shows 'user' but we want to double-check
    if (forceDbCheck || (user?.role === 'user' && user?.email)) {
      try {
        console.log('🔍 Verificando role no banco de dados...');
        const { data: dbProfile, error: dbError } = await supabase
          .from('perfis')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (dbProfile) {
          const dbResult = dbProfile.role === 'admin' || dbProfile.role === 'superadmin';
          console.log('🔐 isAdmin DB check:', { dbRole: dbProfile.role, isAdmin: dbResult });
          
          // If database shows admin but frontend shows user, force refresh
          if (dbResult && !cacheResult) {
            console.log('🚨 INCONSISTÊNCIA CRÍTICA! Forçando refresh...');
            toast.info('Atualizando permissões...', { duration: 2000 });
            
            await refreshAuth();
            return true;
          }
          
          return dbResult;
        } else if (dbError && useServiceFallback) {
          // Fallback to service role edge function if direct query fails
          console.log('🔄 Tentando fallback via Edge Function...');
          return await checkRoleViaService();
        }
      } catch (error) {
        console.error('❌ Erro ao verificar role no banco:', error);
        
        // If useServiceFallback is true, try the service role fallback
        if (useServiceFallback) {
          console.log('🔄 Tentando fallback via Edge Function após erro...');
          return await checkRoleViaService();
        }
      }
    }
    
    return cacheResult;
  };

  const checkRoleViaService = async () => {
    try {
      console.log('🔍 Verificando role via Edge Function (Service Role)...');
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) {
        console.log('❌ Sem token de acesso para Edge Function');
        return false;
      }

      const response = await supabase.functions.invoke('get-user-role', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        }
      });

      if (response.error) {
        console.error('❌ Erro na Edge Function get-user-role:', response.error);
        return false;
      }

      const { role } = response.data;
      const serviceResult = role === 'admin' || role === 'superadmin';
      
      console.log('🔐 Role verificado via Service:', { role, isAdmin: serviceResult });

      // If service shows admin but frontend cache shows user, trigger refresh
      if (serviceResult && user?.role === 'user') {
        console.log('🚨 INCONSISTÊNCIA DETECTADA VIA SERVICE! Auto-corrigindo...');
        toast.success('Permissões atualizadas automaticamente!', { duration: 3000 });
        
        // Force auth refresh to sync the role
        await refreshAuth();
        
        return true;
      }

      return serviceResult;
    } catch (error) {
      console.error('❌ Erro no fallback via Service Role:', error);
      return false;
    }
  };

  const canViewConsultantPanel = () => {
    return user?.role === 'admin' || user?.role === 'consultor';
  };

  const canManageUsers = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const canAccessAdminPanel = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const canManageWorkspace = () => {
    return user?.role === 'admin' || user?.role === 'gerente' || user?.role === 'superadmin';
  };

  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'superadmin': 10,
      'admin': 9,
      'gerente': 8,
      'operador': 7,
      'consultor': 6,
      'cliente': 2,
      'user': 1
    };

    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  };

  const forcePermissionRefresh = async () => {
    try {
      console.log('🔄 Forçando refresh de permissões...');
      toast.loading('Atualizando permissões...', { duration: 2000 });
      
      await refreshAuth();
      await validateAuthState();
      setHasCheckedConsistency(false); // Reset to recheck consistency
      
      toast.success('Permissões atualizadas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar permissões:', error);
      toast.error('Erro ao atualizar permissões');
    }
  };

  return {
    isAdmin,
    canViewConsultantPanel,
    canManageUsers,
    canAccessAdminPanel,
    canManageWorkspace,
    hasPermission,
    forcePermissionRefresh,
    checkRoleConsistency
  };
};
