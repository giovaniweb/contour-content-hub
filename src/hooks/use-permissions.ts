
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

export function usePermissions() {
  const { user } = useAuth();
  
  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
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
  
  // Modified to check for various role hierarchies
  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false;
    
    // Superadmin tem todas as permissões
    if (user.role === 'superadmin') return true;
    
    switch (requiredRole) {
      case 'superadmin':
        return user.role === 'superadmin';
      case 'admin':
        return user.role === 'admin' || user.role === 'superadmin';
      case 'gerente':
        return user.role === 'gerente' || user.role === 'admin' || user.role === 'superadmin';
      case 'operador':
        return user.role === 'operador' || user.role === 'gerente' || user.role === 'admin' || user.role === 'superadmin';
      case 'consultor':
        return user.role === 'consultor' || user.role === 'superadmin';
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
  
  return {
    isSuperAdmin,
    isAdmin,
    isGerente,
    isOperator,
    isConsultor,
    hasPermission,
    canManageWorkspace,
    canManageUsers,
    canViewAnalytics,
    canCreateContent,
    canApproveContent
  };
}
