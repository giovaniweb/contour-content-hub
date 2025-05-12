
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { ensureUserProfile } from "@/services/auth/userProfile";

export function usePermissions() {
  const { user } = useAuth();
  const profile = user ? ensureUserProfile(user) : null;
  
  const isSuperAdmin = () => {
    return profile?.role === 'superadmin';
  };
  
  const isAdmin = () => {
    return profile?.role === 'admin' || isSuperAdmin();
  };
  
  const isGerente = () => {
    return profile?.role === 'gerente' || isAdmin();
  };
  
  const isOperator = () => {
    return profile?.role === 'operador' || isGerente();
  };
  
  const isConsultor = () => {
    return profile?.role === 'consultor';
  };
  
  const isCliente = () => {
    return profile?.role === 'cliente';
  };
  
  // Helper to check if a user has a specific role or higher in the hierarchy
  const hasPermission = (requiredRole: UserRole) => {
    if (!profile) return false;
    
    // Superadmin tem todas as permissões
    if (profile.role === 'superadmin') return true;
    
    switch (requiredRole) {
      case 'superadmin':
        return profile.role === 'superadmin';
      case 'admin':
        return ['admin', 'superadmin'].includes(profile.role);
      case 'gerente':
        return ['gerente', 'admin', 'superadmin'].includes(profile.role);
      case 'operador':
        return ['operador', 'gerente', 'admin', 'superadmin'].includes(profile.role);
      case 'consultor':
        return ['consultor', 'superadmin'].includes(profile.role);
      case 'cliente':
        return ['cliente', 'superadmin'].includes(profile.role);
      case 'editAllContent':
        return ['operador', 'gerente', 'admin', 'superadmin', 'editAllContent'].includes(profile.role);
      case 'manageClients':
        return ['gerente', 'admin', 'superadmin', 'manageClients'].includes(profile.role);
      case 'viewSales':
        return ['gerente', 'admin', 'superadmin', 'viewSales'].includes(profile.role);
      default:
        return false;
    }
  };
  
  // Permissões específicas por funcionalidade
  const canManageWorkspace = () => {
    return isAdmin();
  };
  
  const canManageUsers = () => {
    return isAdmin();
  };
  
  const canViewAnalytics = () => {
    return isGerente() || isConsultor();
  };
  
  const canCreateContent = () => {
    return isOperator() || isGerente() || isAdmin();
  };
  
  const canApproveContent = () => {
    return isGerente() || isAdmin();
  };
  
  const canViewConsultantPanel = () => {
    return isConsultor() || isSuperAdmin();
  };
  
  return {
    isSuperAdmin,
    isAdmin,
    isGerente,
    isOperator,
    isConsultor,
    isCliente,
    hasPermission,
    canManageWorkspace,
    canManageUsers,
    canViewAnalytics,
    canCreateContent,
    canApproveContent,
    canViewConsultantPanel
  };
}
