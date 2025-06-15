
// TopBar minimal: Logo (left), Notifications/Alerts, ProfileMenu (right)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Film, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsMenu from "../notifications/NotificationsMenu";
import { ProfileMenu } from "../ProfileMenu";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Remove mobile menu: topbar será estático e minimalista (sem navegacao principal universal)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between" aria-label="Topbar principal">
        {/* Logo */}
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

        {/* Profile menu and notifications */}
        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationsMenu />}
          {/* ProfileMenu já possui "Meus..." e menus pessoais dentro */}
          {isAuthenticated && <ProfileMenu />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
