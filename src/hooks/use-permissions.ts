
import { useAuth } from '@/context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();
  
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };
  
  const canViewConsultantPanel = () => {
    return user?.role === 'consultant' || isAdmin();
  };
  
  const hasPermission = (role: string) => {
    if (!user) return false;
    if (isAdmin()) return true;
    return user.role === role;
  };
  
  return {
    isAdmin,
    canViewConsultantPanel,
    hasPermission
  };
};
