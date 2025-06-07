
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

  const hasPermission = (permission: string) => {
    const role = getUserRole();
    
    // Define permission mappings
    const permissions: { [key: string]: string[] } = {
      'admin': ['admin'],
      'editAllContent': ['admin', 'operator'],
      'viewSales': ['admin', 'seller', 'manager'],
      'manageSales': ['admin', 'seller'],
      'viewConsultant': ['admin', 'consultant'],
      'manageWorkspace': ['admin', 'workspace_admin']
    };
    
    return permissions[permission]?.includes(role) || false;
  };

  return {
    isAdmin,
    canManageWorkspace,
    canViewConsultantPanel,
    canManageUsers,
    canAccessReports,
    getUserRole,
    hasPermission,
  };
};
