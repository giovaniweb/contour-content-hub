import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [permissionCache, setPermissionCache] = useState<Record<string, { value: boolean; timestamp: number }>>({});
  const CACHE_DURATION = 30000; // 30 seconds
  
  /**
   * Check if user is in the superuser allowlist by email (uses database)
   */
  const isSuperUserByEmail = useCallback(async (email?: string): Promise<boolean> => {
    if (!email) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_superuser_by_email', { 
        user_email: email.toLowerCase() 
      });
      
      if (error) {
        console.warn('Error checking superuser status:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.warn('Error in superuser check:', error);
      return false;
    }
  }, []);

  /**
   * Synchronous version for immediate UI decisions (checks known patterns)
   */
  const isSuperUserByEmailSync = useCallback((email?: string): boolean => {
    if (!email) return false;
    // Emergency fallback for known superuser
    return email.toLowerCase() === 'giovani.g@live.com';
  }, []);

  /**
   * Main admin check function using new secure database functions
   */  
  const isAdmin = useCallback(async (forceDbCheck: boolean = false): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    // PRIORITY 1: Check superuser allowlist synchronously first for immediate UI
    if (isSuperUserByEmailSync(user.email)) {
      return true;
    }
    
    // PRIORITY 2: Check cache if not forcing DB check
    const cacheKey = `admin_${user.id}`;
    const cached = permissionCache[cacheKey];
    const now = Date.now();
    
    if (!forceDbCheck && cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.value;
    }
    
    try {
      // PRIORITY 3: Use new secure database function (no recursion)
      const { data, error } = await supabase.rpc('check_user_is_admin');
      
      if (error) {
        console.warn('Database admin check failed:', error.message);
        // Fallback to superuser check
        const superuserResult = await isSuperUserByEmail(user.email);
        if (superuserResult) return true;
        
        // Final fallback to context role
        return user.role === 'admin' || user.role === 'superadmin';
      }
      
      const isAdminResult = data || false;
      
      // Cache the result
      setPermissionCache(prev => ({
        ...prev,
        [cacheKey]: { value: isAdminResult, timestamp: now }
      }));
      
      return isAdminResult;
    } catch (error) {
      console.warn('Critical error in admin check:', error);
      
      // Emergency fallbacks
      const superuserResult = await isSuperUserByEmail(user.email);
      if (superuserResult) return true;
      
      return user.role === 'admin' || user.role === 'superadmin';
    }
  }, [user, isAuthenticated, isSuperUserByEmailSync, isSuperUserByEmail, permissionCache]);

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
    
    // Check superuser allowlist first (synchronous)
    if (isSuperUserByEmailSync(user.email) && (requiredRole === 'admin' || requiredRole === 'superadmin')) {
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

  return {
    isAdmin,
    isSuperUserByEmail,
    isSuperUserByEmailSync,
    canViewConsultantPanel: () => hasPermission('consultor'),
    canManageUsers: () => hasPermission('admin'),
    canAccessAdminPanel: () => hasPermission('admin'),
    canManageWorkspace: () => hasPermission('gerente'),
    hasPermission
  };
};