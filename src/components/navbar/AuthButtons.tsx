
import React from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "../ProfileMenu";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  user: any | null;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isAuthenticated, user }) => {
  if (isAuthenticated && user) {
    return <ProfileMenu />;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Link 
        to="/register"
        className="text-sm font-medium hover:underline hidden md:block"
        aria-label="Criar nova conta"
      >
        Criar conta
      </Link>
      <Link 
        to="/" 
        className="bg-contourline-mediumBlue text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-contourline-darkBlue transition-colors"
        aria-label="Fazer login"
      >
        Entrar
      </Link>
    </div>
  );
};
