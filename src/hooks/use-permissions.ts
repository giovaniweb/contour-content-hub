
import { useAuth } from "@/context/AuthContext";

type PermissionAction = 'viewAllUsers' | 'editAllContent' | 'accessAdminPanel' | 'manageRoles' | 'manageClients' | 'viewSales';

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
        return user.role === 'admin' || user.role === 'operador' || user.role === 'vendedor';
      case 'editAllContent':
        return user.role === 'admin';
      case 'accessAdminPanel':
        return user.role === 'admin';
      case 'manageRoles':
        return user.role === 'admin';
      case 'manageClients':
        return user.role === 'admin' || user.role === 'vendedor';
      case 'viewSales':
        return user.role === 'admin' || user.role === 'vendedor';
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
  
  /**
   * Verifica se o usuário é vendedor
   */
  const isSeller = (): boolean => {
    return user?.role === 'vendedor';
  };
  
  return {
    hasPermission,
    isAdmin,
    isOperator,
    isClient,
    isSeller
  };
};
