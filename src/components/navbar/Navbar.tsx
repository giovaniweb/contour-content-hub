
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainNavigation } from "./MainNavigation";
import { MobileNavMenu } from "./MobileNavMenu";
import { AuthButtons } from "./AuthButtons";
import NotificationsMenu from "../notifications/NotificationsMenu";
import { ProfileMenu } from "../ProfileMenu";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setTheme } = useTheme();

  // Detect scroll to apply visual effect to navbar
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
        {/* Logo and title */}
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

        {/* Main links - visible on larger screens */}
        <div className="hidden md:flex items-center">
          <MainNavigation isAuthenticated={isAuthenticated} />
        </div>

        {/* Profile menu and mobile menu button */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          {isAuthenticated && <NotificationsMenu />}

          {/* Mobile menu (hamburger) */}
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
              onLogout={handleLogout}
            />
          </div>

          {/* Auth menu */}
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <AuthButtons isAuthenticated={isAuthenticated} user={user} logout={handleLogout} />
          )}
        </div>
      </nav>
    </header>
  );
};

// Add default export
export default Navbar;
