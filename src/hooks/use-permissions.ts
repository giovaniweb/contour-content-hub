
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

// Superuser allowlist - these emails always have admin access
const SUPERUSER_EMAILS = [
  'giovani.g@live.com'
];

export const usePermissions = () => {
  const { user, refreshAuth, validateAuthState } = useAuth();
  const [hasCheckedConsistency, setHasCheckedConsistency] = useState(false);
  const [isAdminCache, setIsAdminCache] = useState<{ result: boolean; timestamp: number } | null>(null);
  
  // Prevent infinite loops
  const isCheckingRef = useRef(false);
  const lastRefreshTimeRef = useRef<number>(0);
  const refreshCountRef = useRef(0);

  // Helper function to check if user is a superuser by email
  const isSuperUserByEmail = (email?: string) => {
    if (!email) return false;
    return SUPERUSER_EMAILS.includes(email.toLowerCase());
  };

  // Auto-check for role inconsistencies on mount
  useEffect(() => {
    if (user?.id && !hasCheckedConsistency) {
      checkRoleConsistency();
    }
  }, [user?.id, hasCheckedConsistency]);

  const checkRoleConsistency = async () => {
    if (!user?.id) return;
    
    // Skip for superusers - they always have admin access
    if (isSuperUserByEmail(user.email)) {
      setHasCheckedConsistency(true);
      return;
    }
    
    // Prevent excessive checking
    if (isCheckingRef.current) return;
    
    // Throttle checks - max once per 30 seconds
    const now = Date.now();
    if (lastRefreshTimeRef.current && (now - lastRefreshTimeRef.current) < 30000) return;
    
    // Limit total refresh attempts in session
    if (refreshCountRef.current >= 2) {
      setHasCheckedConsistency(true);
      return;
    }
    
    isCheckingRef.current = true;
    lastRefreshTimeRef.current = now;
    
    try {
      const { data: dbProfile } = await supabase
        .from('perfis')
        .select('role, email')
        .eq('id', user.id)
        .single();
      
      if (dbProfile && dbProfile.role !== user.role) {
        // Only show toast for admin elevation, and only once
        if ((dbProfile.role === 'admin' || dbProfile.role === 'superadmin') && user.role === 'user' && refreshCountRef.current === 0) {
          toast.success('Permissões atualizadas automaticamente', { duration: 2000 });
          refreshCountRef.current++;
          await refreshAuth();
        }
      }
      
      setHasCheckedConsistency(true);
    } catch (error) {
      setHasCheckedConsistency(true);
    } finally {
      isCheckingRef.current = false;
    }
  };

  const isAdmin = async (forceDbCheck = false, useServiceFallback = false) => {
    if (!user) return false;
    
    // Check superuser allowlist first - these emails always have admin access
    if (isSuperUserByEmail(user.email)) {
      setIsAdminCache({ result: true, timestamp: Date.now() });
      return true;
    }
    
    // Check memory cache (30 seconds TTL)
    const now = Date.now();
    if (!forceDbCheck && isAdminCache && (now - isAdminCache.timestamp < 30000)) {
      return isAdminCache.result;
    }
    
    // Quick check from user object
    const cacheResult = user?.role === 'admin' || user?.role === 'superadmin';
    
    // If forcing database check or cache shows 'user' but we want to double-check
    if (forceDbCheck || (user?.role === 'user' && user?.email)) {
      try {
        const { data: dbProfile } = await supabase
          .from('perfis')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (dbProfile) {
          const dbResult = dbProfile.role === 'admin' || dbProfile.role === 'superadmin';
          
          // If database shows admin but frontend shows user, silently refresh
          if (dbResult && !cacheResult && refreshCountRef.current === 0) {
            refreshCountRef.current++;
            await refreshAuth();
            setIsAdminCache({ result: true, timestamp: now });
            return true;
          }
          
          setIsAdminCache({ result: dbResult, timestamp: now });
          return dbResult;
        } else if (useServiceFallback) {
          return await checkRoleViaService();
        }
      } catch (error) {
        if (useServiceFallback) {
          return await checkRoleViaService();
        }
      }
    }
    
    // Cache the user role result
    if (!forceDbCheck) {
      setIsAdminCache({ result: cacheResult, timestamp: now });
    }
    
    return cacheResult;
  };

  const checkRoleViaService = async () => {
    try {
      const now = Date.now();
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.access_token) return false;

      const response = await supabase.functions.invoke('get-user-role', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        }
      });

      if (response.error) return false;

      const { role } = response.data;
      const serviceResult = role === 'admin' || role === 'superadmin';

      // If service shows admin but frontend cache shows user, silently refresh (only once)
      if (serviceResult && user?.role === 'user' && refreshCountRef.current === 0) {
        refreshCountRef.current++;
        await refreshAuth();
        setIsAdminCache({ result: true, timestamp: now });
        return true;
      }

      return serviceResult;
    } catch (error) {
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
    
    // Check superuser allowlist first
    if (isSuperUserByEmail(user.email) && (requiredRole === 'admin' || requiredRole === 'superadmin')) {
      return true;
    }
    
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
      toast.loading('Atualizando permissões...', { duration: 2000 });
      
      await refreshAuth();
      await validateAuthState();
      setHasCheckedConsistency(false);
      
      toast.success('Permissões atualizadas com sucesso!');
    } catch (error) {
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
    checkRoleConsistency,
    isSuperUserByEmail
  };
};
