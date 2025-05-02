import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/theme-provider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  History,
  Library,
  CalendarDays,
  Settings,
  LogOut,
  Moon,
  Sun,
  FileVideo,
  Sparkles,
  FileSearch
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
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label";

interface SubmenuProps {
  label: string;
  items: {
    label: string;
    href: string;
  }[];
}

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();

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
      <Link to={to} className={`group flex w-full items-center rounded-md border px-3 py-2 text-sm outline-none transition-colors hover:bg-secondary focus:bg-secondary focus:text-accent-foreground ${isActive ? 'bg-secondary text-accent-foreground' : 'text-muted-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>
        {icon}
        {label}
      </Link>
    );
  };

  // Extract user display info with safety checks
  const getUserDisplayName = () => {
    if (!user) return "U";
    // @ts-ignore - We're handling potential undefined values
    return user.full_name || user.email || "U"; 
  };
  
  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo e título */}
        <div className="flex items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
            <h1 className="text-lg font-semibold flex items-center">
              <FileVideo className="mr-2 h-6 w-6 text-blue-500" />
              <span className="hidden md:block">Fluida</span>
            </h1>
          </Link>
        </div>

        {/* Links principais - visíveis em telas maiores */}
        <div className="hidden md:flex items-center space-x-1">
          {isAuthenticated && user && (
            <>
              <NavLink to="/dashboard" className={({isActive}) => 
                isActive ? "text-primary font-medium" : "hover:text-primary"
              }>
                <div className="flex items-center px-3 py-2">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </div>
              </NavLink>
              <NavLink to="/script-history" className={({isActive}) => 
                isActive ? "text-primary font-medium" : "hover:text-primary"
              }>
                <div className="flex items-center px-3 py-2">
                  <History className="h-4 w-4 mr-1" />
                  Histórico
                </div>
              </NavLink>
              <NavLink to="/equipment-details" className={({isActive}) => 
                isActive ? "text-primary font-medium" : "hover:text-primary"
              }>
                <div className="flex items-center px-3 py-2">
                  <FileSearch className="h-4 w-4 mr-1" />
                  Equipamentos
                </div>
              </NavLink>
              <NavLink to="/media-library">
                <Library className="h-4 w-4 mr-1" />
                Mídia
              </NavLink>
              <NavLink to="/calendar">
                <CalendarDays className="h-4 w-4 mr-1" />
                Agenda
              </NavLink>
              <NavLink to="/custom-gpt">
                <Sparkles className="h-4 w-4 mr-1" />
                Fluida Personalizada
              </NavLink>
            </>
          )}
        </div>

        {/* Menu mobile (hambúrguer) */}
        <div className="md:hidden">
          <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="text-left">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>Navegue pelo Fluida</DrawerDescription>
              </DrawerHeader>
              <div className="space-y-1 px-2 py-3">
                {isAuthenticated && (
                  <>
                    <DrawerNavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4 mr-2" />} label="Dashboard" />
                    <DrawerNavLink to="/script-history" icon={<History className="h-4 w-4 mr-2" />} label="Histórico" />
                    <DrawerNavLink to="/media-library" icon={<Library className="h-4 w-4 mr-2" />} label="Mídia" />
                    <DrawerNavLink to="/calendar" icon={<CalendarDays className="h-4 w-4 mr-2" />} label="Agenda" />
                    <DrawerNavLink to="/custom-gpt" icon={<Sparkles className="h-4 w-4 mr-2" />} label="Fluida Personalizada" />
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <DrawerNavLink to="/" icon={<LayoutDashboard className="h-4 w-4 mr-2" />} label="Início" />
                    <DrawerNavLink to="/register" icon={<FileText className="h-4 w-4 mr-2" />} label="Criar conta" />
                  </>
                )}
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline" onClick={() => setIsMobileMenuOpen(false)}>Fechar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Menu de perfil */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Use safe access with optional chaining */}
                  <AvatarImage 
                    src={user && 'avatar_url' in user ? user.avatar_url as string : ""} 
                    alt={getUserDisplayName()} 
                  />
                  <AvatarFallback>{getUserInitial()}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Abrir menu de perfil</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/register" className="text-sm font-medium hover:underline">Criar conta</Link>
            <Link to="/" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Entrar</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
