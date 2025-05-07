
import { useAuth } from "@/context/AuthContext";

export function usePermissions() {
  const { user } = useAuth();
  
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  return {
    isAdmin
  };
}
