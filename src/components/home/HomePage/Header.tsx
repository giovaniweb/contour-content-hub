
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="py-4 border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
      <div className="container flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Fluida
        </h1>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Criar conta
              </Button>
            </>
          )}
          {isAuthenticated && (
            <Button 
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
