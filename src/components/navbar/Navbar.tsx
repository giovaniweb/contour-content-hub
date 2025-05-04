
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainNavigation } from "./MainNavigation";
import { MobileNavMenu } from "./MobileNavMenu";
import { AuthButtons } from "./AuthButtons";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setTheme } = useTheme();

  // Detecta rolagem para aplicar efeito visual na navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deslogar",
        description: "Não foi possível desconectar. Tente novamente.",
      });
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-200",
        scrolled 
          ? "bg-background/95 backdrop-blur-sm shadow-sm" 
          : "bg-background"
      )}
    >
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between" aria-label="Navegação principal">
        {/* Logo e título */}
        <div className="flex items-center">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center" 
            aria-label="Ir para página inicial Fluida"
          >
            <h1 className="text-lg font-semibold flex items-center">
              <Film className="mr-2 h-6 w-6 text-contourline-mediumBlue" aria-hidden="true" />
              <span className="hidden md:block">Fluida</span>
            </h1>
          </Link>
        </div>

        {/* Links principais - visíveis em telas maiores */}
        <div className="hidden md:flex items-center">
          <MainNavigation isAuthenticated={isAuthenticated} />
        </div>

        {/* Menu de perfil e botão para menu mobile */}
        <div className="flex items-center gap-2">
          {/* Menu mobile (hambúrguer) */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 rounded-full"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
            <MobileNavMenu 
              isOpen={isMobileMenuOpen} 
              setIsOpen={setIsMobileMenuOpen} 
              isAuthenticated={isAuthenticated} 
            />
          </div>

          {/* Menu de autenticação */}
          <AuthButtons isAuthenticated={isAuthenticated} user={user} />
        </div>
      </nav>
    </header>
  );
};
