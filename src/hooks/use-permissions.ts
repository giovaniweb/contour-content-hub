
import { useAuth } from "@/context/AuthContext";

type PermissionAction = 'viewAllUsers' | 'editAllContent' | 'accessAdminPanel' | 'manageRoles';

/**
 * Hook para verificar permissões do usuário baseado em seu role
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  /**
   * Verifica se o usuário possui uma determinada permissão
   */
  const hasPermission = (action: PermissionAction): boolean => {
    if (!user) return false;
    
    switch (action) {
      case 'viewAllUsers':
        return user.role === 'admin' || user.role === 'operador';
      case 'editAllContent':
        return user.role === 'admin';
      case 'accessAdminPanel':
        return user.role === 'admin';
      case 'manageRoles':
        return user.role === 'admin';
      default:
        return false;
    }
  };
  
  /**
   * Verifica se o usuário é admin
   */
  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };
  
  /**
   * Verifica se o usuário é operador
   */
  const isOperator = (): boolean => {
    return user?.role === 'operador';
  };
  
  /**
   * Verifica se o usuário é cliente (usuário comum)
   */
  const isClient = (): boolean => {
    return user?.role === 'cliente';
  };
  
  return {
    hasPermission,
    isAdmin,
    isOperator,
    isClient
  };
};
