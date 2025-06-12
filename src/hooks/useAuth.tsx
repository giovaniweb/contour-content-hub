
import { useAuth as useAuthContext } from '@/context/MockAuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
