import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/use-permissions';
import { DEFAULT_USER_PERMISSIONS } from '@/utils/featureMapping';
import '@/utils/debug'; // Import debug utilities

export type AppFeature = 
  | 'mestre_beleza'
  | 'consultor_mkt' 
  | 'fluida_roteirista'
  | 'videos'
  | 'fotos'
  | 'artes'
  | 'artigos_cientificos'
  | 'academia'
  | 'equipamentos'
  | 'fotos_antes_depois'
  | 'reports'
  | 'planner'
  | 'ideas';

export type FeatureStatus = 'blocked' | 'coming_soon' | 'beta' | 'released';

interface FeaturePermission {
  feature: AppFeature;
  enabled: boolean; // Deprecated - mantido para compatibilidade
  status: FeatureStatus;
  expires_at?: string;
  granted_at?: string;
}

interface FeatureNotification {
  id: string;
  feature: AppFeature;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}

interface UseFeatureAccessReturn {
  hasAccess: (feature: AppFeature) => boolean;
  getFeatureStatus: (feature: AppFeature) => FeatureStatus | null;
  isLoading: boolean;
  permissions: FeaturePermission[];
  notifications: FeatureNotification[];
  hasNewNotifications: boolean;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  refreshPermissions: () => Promise<void>;
  isNewFeature: (feature: AppFeature) => boolean;
}

const NOTIFICATION_CACHE_KEY = 'feature_notifications_cache';
const PERMISSIONS_CACHE_KEY = 'feature_permissions_cache';

export const useFeatureAccess = (): UseFeatureAccessReturn => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();
  const [permissions, setPermissions] = useState<FeaturePermission[]>([]);
  const [notifications, setNotifications] = useState<FeatureNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminFlag, setAdminFlag] = useState(false);

  const loadFromCache = useCallback(() => {
    try {
      const cachedPermissions = localStorage.getItem(PERMISSIONS_CACHE_KEY);
      const cachedNotifications = localStorage.getItem(NOTIFICATION_CACHE_KEY);
      
      if (cachedPermissions) {
        setPermissions(JSON.parse(cachedPermissions));
      }
      if (cachedNotifications) {
        setNotifications(JSON.parse(cachedNotifications));
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  }, []);

  const saveToCache = useCallback((perms: FeaturePermission[], notifs: FeatureNotification[]) => {
    try {
      localStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify(perms));
      localStorage.setItem(NOTIFICATION_CACHE_KEY, JSON.stringify(notifs));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    console.log('🔍 [useFeatureAccess] Iniciando fetch de permissões para usuário:', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    try {
      const { data, error } = await supabase
        .from('user_feature_permissions')
        .select('feature, enabled, status, expires_at, granted_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const perms = data || [];
      
      console.log('📊 [useFeatureAccess] Permissões carregadas do banco:', {
        count: perms.length,
        permissions: perms.map(p => ({
          feature: p.feature,
          enabled: p.enabled,
          expires: p.expires_at
        }))
      });
      
      // If user has no permissions, initialize defaults
      if (perms.length === 0) {
        const { initializeUserPermissions } = await import('@/utils/initializeUserPermissions');
        await initializeUserPermissions(user.id);
        // Refetch after initialization
        const { data: newData } = await supabase
          .from('user_feature_permissions')
          .select('feature, enabled, status, expires_at, granted_at')
          .eq('user_id', user.id);
        setPermissions(newData || []);
      } else {
        setPermissions(perms);
      }
      
      // Also fetch notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('feature_notifications')
        .select('id, feature, title, message, is_read, created_at')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (notificationError) throw notificationError;

      const notifs = notificationData || [];
      setNotifications(notifs);
      
      saveToCache(perms.length === 0 ? [] : perms, notifs);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, saveToCache]);

  const refreshPermissions = useCallback(async () => {
    await fetchPermissions();
  }, [fetchPermissions]);

  const getFeatureStatus = useCallback((feature: AppFeature): FeatureStatus | null => {
    const permission = permissions.find(p => p.feature === feature);
    return permission?.status || null;
  }, [permissions]);

  const hasAccess = useCallback((feature: AppFeature): boolean => {
    // Admin has FULL override - acessa tudo sempre
    if (adminFlag) {
      console.log('👑 [useFeatureAccess] Usuário é admin, acesso total para:', feature);
      return true;
    }

    const permission = permissions.find(p => p.feature === feature);
    console.log('🔍 [useFeatureAccess] Verificando acesso para feature:', {
      feature,
      permission: permission ? {
        status: permission.status,
        enabled: permission.enabled,
        expires_at: permission.expires_at
      } : 'NÃO ENCONTRADA'
    });
    
    // FALLBACK INTELIGENTE: Se permissão não encontrada, verificar defaults
    if (!permission) {
      const isDefaultFeature = DEFAULT_USER_PERMISSIONS.includes(feature);
      console.log(
        isDefaultFeature 
          ? `✅ [useFeatureAccess] Permissão não encontrada, mas é feature default. Acesso liberado: ${feature}`
          : `❌ [useFeatureAccess] Permissão não encontrada e não é feature default: ${feature}`
      );
      return isDefaultFeature;
    }
    
    // Lógica baseada em status
    const status = permission.status;
    
    // BLOCKED → ninguém acessa (exceto admin já tratado acima)
    if (status === 'blocked') {
      console.log('🔒 [useFeatureAccess] Feature bloqueada:', feature);
      return false;
    }
    
    // COMING_SOON → ninguém acessa (exceto admin já tratado acima)
    if (status === 'coming_soon') {
      console.log('⏳ [useFeatureAccess] Feature em breve:', feature);
      return false;
    }
    
    // BETA → todos acessam (com warning no UI)
    if (status === 'beta') {
      console.log('🧪 [useFeatureAccess] Feature em BETA, acesso liberado:', feature);
      return true;
    }
    
    // RELEASED → todos acessam normalmente
    if (status === 'released') {
      // Verificar expiração se houver
      if (permission.expires_at) {
        const expiryDate = new Date(permission.expires_at);
        if (expiryDate < new Date()) {
          console.log('⏰ [useFeatureAccess] Feature expirada:', feature);
          return false;
        }
      }
      console.log('✅ [useFeatureAccess] Feature liberada, acesso permitido:', feature);
      return true;
    }
    
    console.log('❓ [useFeatureAccess] Status desconhecido:', status);
    return false;
  }, [permissions, adminFlag]);

  const isNewFeature = useCallback((feature: AppFeature): boolean => {
    const unreadNotification = notifications.find(n => 
      n.feature === feature && 
      !n.is_read &&
      new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    return !!unreadNotification;
  }, [notifications]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('feature_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const hasNewNotifications = notifications.some(n => !n.is_read);

  // Resolve admin status asynchronously
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        setAdminFlag(false);
        return;
      }
      
      try {
        const isUserAdmin = await isAdmin();
        setAdminFlag(isUserAdmin);
        console.log('👑 [useFeatureAccess] Admin status resolved:', { 
          userId: user.id, 
          email: user.email, 
          isAdmin: isUserAdmin 
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdminFlag(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user, isAdmin]);

  useEffect(() => {
    loadFromCache();
    fetchPermissions();
  }, [loadFromCache, fetchPermissions]);

  // Set up real-time subscription for permissions updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('feature-permissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_feature_permissions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchPermissions();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchPermissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, fetchPermissions]);

  return {
    hasAccess,
    getFeatureStatus,
    isLoading,
    permissions,
    notifications,
    hasNewNotifications,
    markNotificationAsRead,
    refreshPermissions,
    isNewFeature
  };
};