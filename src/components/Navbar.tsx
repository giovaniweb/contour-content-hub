
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import ProfileMenu from "./ProfileMenu";
import {
  Home,
  FileText,
  Film,
  CalendarDays,
  Menu,
  X,
  CheckCircle,
  BookOpen
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Navbar: React.FC = () => {
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

  const DrawerNavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground ${isActive ? 'bg-secondary text-accent-foreground font-medium' : 'text-foreground'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span className="mr-3 text-contourline-mediumBlue">{icon}</span>
        {label}
      </Link>
    );
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
        {isAuthenticated && user && (
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavLink to="/dashboard">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/dashboard" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Início</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/custom-gpt">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/custom-gpt" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Roteiros</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/validate-script">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/validate-script" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Validador</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/documents">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/documents" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Artigos Científicos</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/media">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/media" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <Film className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Mídia</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/equipment-details">
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === "/equipment-details" ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Equipamentos</span>
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* Menu de perfil e botão para menu mobile */}
        <div className="flex items-center gap-2">
          {/* Menu mobile (hambúrguer) */}
          <div className="md:hidden">
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 w-9 p-0 rounded-full"
                  aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="text-left">
                <DrawerHeader className="border-b pb-3">
                  <DrawerTitle className="flex items-center">
                    <Film className="h-5 w-5 text-contourline-mediumBlue mr-2" aria-hidden="true" />
                    Menu Fluida
                  </DrawerTitle>
                  <DrawerDescription>Navegue pelo aplicativo</DrawerDescription>
                </DrawerHeader>
                
                <div className="space-y-1 px-2 py-4">
                  {isAuthenticated && (
                    <>
                      <DrawerNavLink to="/dashboard" icon={<Home className="h-5 w-5" />} label="Inicio" />
                      <DrawerNavLink to="/custom-gpt" icon={<FileText className="h-5 w-5" />} label="Roteiros Fluida" />
                      <DrawerNavLink to="/validate-script" icon={<CheckCircle className="h-5 w-5" />} label="Validador de Roteiros" />
                      <DrawerNavLink to="/documents" icon={<BookOpen className="h-5 w-5" />} label="Artigos Científicos" />
                      <DrawerNavLink to="/media" icon={<Film className="h-5 w-5" />} label="Mídia" />
                      <DrawerNavLink to="/calendar" icon={<CalendarDays className="h-5 w-5" />} label="Agenda" />
                      <DrawerNavLink to="/equipment-details" icon={<CalendarDays className="h-5 w-5" />} label="Equipamentos" />
                    </>
                  )}
                  
                  {!isAuthenticated && (
                    <>
                      <DrawerNavLink to="/" icon={<Home className="h-5 w-5" />} label="Início" />
                      <DrawerNavLink to="/register" icon={<FileText className="h-5 w-5" />} label="Criar conta" />
                    </>
                  )}
                </div>
                
                <DrawerFooter className="pt-2 border-t">
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-4 w-4 mr-2" aria-hidden="true" />
                      Fechar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Menu de perfil */}
          {isAuthenticated && user ? (
            <ProfileMenu />
          ) : (
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
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
