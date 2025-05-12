
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

export function usePermissions() {
  const { user } = useAuth();
  
  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  const isAdmin = () => {
    return user?.role === 'admin' || isSuperAdmin();
  };
  
  const isGerente = () => {
    return user?.role === 'gerente' || isAdmin();
  };
  
  const isOperator = () => {
    return user?.role === 'operador' || isGerente();
  };
  
  const isConsultor = () => {
    return user?.role === 'consultor';
  };
  
  const isCliente = () => {
    return user?.role === 'cliente';
  };
  
  // Helper to check if a user has a specific role or higher in the hierarchy
  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false;
    
    // Superadmin tem todas as permissões
    if (user.role === 'superadmin') return true;
    
    switch (requiredRole) {
      case 'superadmin':
        return user.role === 'superadmin';
      case 'admin':
        return ['admin', 'superadmin'].includes(user.role as UserRole);
      case 'gerente':
        return ['gerente', 'admin', 'superadmin'].includes(user.role as UserRole);
      case 'operador':
        return ['operador', 'gerente', 'admin', 'superadmin'].includes(user.role as UserRole);
      case 'consultor':
        return ['consultor', 'superadmin'].includes(user.role as UserRole);
      case 'cliente':
        return ['cliente', 'superadmin'].includes(user.role as UserRole);
      case 'editAllContent':
        return ['operador', 'gerente', 'admin', 'superadmin', 'editAllContent'].includes(user.role as UserRole);
      case 'manageClients':
        return ['gerente', 'admin', 'superadmin', 'manageClients'].includes(user.role as UserRole);
      case 'viewSales':
        return ['gerente', 'admin', 'superadmin', 'viewSales'].includes(user.role as UserRole);
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
