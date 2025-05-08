
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Power, Video } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user } = useUser();
  const { logout } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-background border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="mr-auto font-semibold">
          Marketing Scripts AI
        </Link>

        <div className="navigation-items">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Início
          </Link>
          
          <Link to="/video-storage" className="nav-item">
            <Video className="h-5 w-5" />
            <span>Biblioteca de Vídeos</span>
          </Link>
          
          <Link to="/video-swipe" className="nav-item">
            <Video className="h-5 w-5" />
            <span>Descobrir Vídeos</span>
          </Link>
          
          <Link to="/media" className="nav-item">
            <Video className="h-5 w-5" />
            <span>Biblioteca de Mídia</span>
          </Link>
          
          <Link to="/technical-documents" className="nav-item">
            <Video className="h-5 w-5" />
            <span>Documentos Técnicos</span>
          </Link>
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.email || ""} alt={user.email || ""} />
                  <AvatarFallback>{user.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email || "Usuário"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <Power className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
