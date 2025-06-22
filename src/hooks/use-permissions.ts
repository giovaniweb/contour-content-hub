
import { useAuth } from '@/context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const canViewConsultantPanel = () => {
    return user?.role === 'admin' || user?.role === 'consultant';
  };

  const canManageUsers = () => {
    return user?.role === 'admin';
  };

  const canAccessAdminPanel = () => {
    return user?.role === 'admin';
  };

  return {
    isAdmin,
    canViewConsultantPanel,
    canManageUsers,
    canAccessAdminPanel
  };
};
