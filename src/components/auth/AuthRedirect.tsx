
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/MockAuthContext';
import { ROUTES } from '@/routes';

interface AuthRedirectProps {
  to?: string;
  onRedirect?: () => void;
}

// Component that handles redirecting users after auth operations
const AuthRedirect: React.FC<AuthRedirectProps> = ({ 
  to = ROUTES.DASHBOARD,
  onRedirect 
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(to, { replace: true });
    if (onRedirect) {
      onRedirect();
    }
  }, [navigate, to, onRedirect]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default AuthRedirect;
