
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
  
  const hasPermission = (requiredRole: string) => {
    if (!user) return false;
    
    if (requiredRole === 'admin') {
      return isAdmin();
    } else if (requiredRole === 'operador') {
      return isOperator();
    } else if (requiredRole === 'vendedor') {
      return isSeller();
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
