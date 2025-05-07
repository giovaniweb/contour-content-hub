
import { useAuth } from "@/context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();
  
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  const isOperator = () => {
    return user?.role === 'operador';
  };
  
  const isSeller = () => {
    return user?.role === 'vendedor';
  };
  
  // Modified to return true for 'admin' and 'operador'
  const hasPermission = (requiredRole: string) => {
    if (!user) return false;
    
    if (requiredRole === 'admin') {
      return isAdmin();
    } else if (requiredRole === 'operador') {
      return isAdmin() || isOperator(); // Admin also has operator permissions
    } else if (requiredRole === 'vendedor') {
      return isAdmin() || isSeller(); // Admin also has seller permissions
    } else if (requiredRole === 'editAllContent') {
      return isAdmin() || isOperator(); // Both admin and operador have this permission
    }
    
    return false;
  };
  
  return {
    isAdmin,
    isOperator,
    isSeller,
    hasPermission
  };
}
