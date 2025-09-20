
// TopBar minimal: Logo (left), Notifications/Alerts, ProfileMenu (right)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Film, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsMenu from "../notifications/NotificationsMenu";
import { ProfileMenu } from "../ProfileMenu";
import { cn } from "@/lib/utils";
import FluidaLogo from "./FluidaLogo";
import { NavLink } from "react-router-dom";
import AdminDropdownMenu from "./AdminDropdownMenu";
import { usePermissions } from "@/hooks/use-permissions";

// Component to handle admin menu with intelligent fallback
const AdminMenuWithFallback = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isCheckingDb, setIsCheckingDb] = React.useState(false);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        setShowMenu(false);
        return;
      }
      
      setIsCheckingDb(true);
      try {
        // Force database check if menu should be visible
        const adminStatus = await isAdmin(true);
        setShowMenu(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setShowMenu(false);
      } finally {
        setIsCheckingDb(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated) return null;
  if (isCheckingDb) {
    return (
      <Button variant="ghost" size="icon" className="text-white opacity-50" disabled>
        <Settings className="h-5 w-5 animate-pulse" />
      </Button>
    );
  }
  
  return showMenu ? <AdminDropdownMenu /> : null;
};

// Mock institucional links
const INSTITUCIONAL_LINKS = [
  { label: "O que é?", to: "/institucional/o-que-e" },
  { label: "Contato", to: "/institucional/contato" },
  { label: "Suporte", to: "/institucional/suporte" },
];

// Links para videomakers
const VIDEOMAKER_LINKS = [
  { label: "Buscar Videomakers", to: "/videomaker/busca" },
  { label: "Cadastrar-se", to: "/videomaker/cadastro" },
];

const SIDEBAR_WIDTH = 104; // mesma largura do Sidebar

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin } = usePermissions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);

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

  // Para simular a logo customizável, pode vir de configuração backend futuramente:
  const logoUrl = undefined; // Troque para URL real para testar! Ex: "/logo-demo.png"

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full border-b transition-all duration-300",
        // Glass effect with aurora colors
        "bg-gradient-to-r from-aurora-space-black/20 via-aurora-deep-purple/30 to-aurora-space-black/20",
        "backdrop-blur-xl border-aurora-electric-purple/20",
        scrolled && "shadow-2xl shadow-aurora-electric-purple/10"
      )}
      style={{ 
        left: (isAuthenticated && !isMobile) ? SIDEBAR_WIDTH : 0,
        right: 0,
        width: (isAuthenticated && !isMobile) ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%'
      }}
    >
      {/* Aurora glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-electric-purple/5 via-aurora-neon-blue/5 to-aurora-emerald/5 animate-aurora-flow"></div>
      
      <nav className="relative w-full px-4 flex h-16 items-center justify-between" aria-label="Topbar principal">
        {/* LOGO */}
        <div className="flex items-center gap-2 min-w-[40px]">
          <NavLink to="/">
            <FluidaLogo logoUrl={logoUrl} size={36} />
          </NavLink>
        </div>
        
        {/* Menus institucionais - visíveis para todos */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {INSTITUCIONAL_LINKS.map((item) => (
            <NavLink
              to={item.to}
              key={item.to}
              className="text-white/80 hover:text-white transition-all duration-300 font-medium text-base hover:text-shadow-aurora-glow"
              style={{ whiteSpace: 'nowrap' }}
            >
              {item.label}
            </NavLink>
          ))}
          
          {/* Separador */}
          <div className="w-px h-4 bg-white/20"></div>
          
          {/* Links de Videomaker */}
          {VIDEOMAKER_LINKS.map((item) => (
            <NavLink
              to={item.to}
              key={item.to}
              className="text-white/80 hover:text-white transition-all duration-300 font-medium text-base hover:text-shadow-aurora-glow"
              style={{ whiteSpace: 'nowrap' }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        
        {/* Profile & Notifications */}
        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationsMenu />}
          <AdminMenuWithFallback />
          {isAuthenticated && <ProfileMenu />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
