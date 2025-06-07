
import { useAuth } from "@/context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  const getUserRole = () => {
    return user?.user_metadata?.role || 'user';
  };

  const isAdmin = () => {
    return getUserRole() === 'admin';
  };

  const canManageWorkspace = () => {
    const role = getUserRole();
    return role === 'admin' || role === 'workspace_admin';
  };

  const canViewConsultantPanel = () => {
    const role = getUserRole();
    return role === 'admin' || role === 'consultant';
  };

  const canManageUsers = () => {
    return isAdmin();
  };

  const canAccessReports = () => {
    const role = getUserRole();
    return role === 'admin' || role === 'manager';
  };

  return {
    isAdmin,
    canManageWorkspace,
    canViewConsultantPanel,
    canManageUsers,
    canAccessReports,
    getUserRole,
  };
};
