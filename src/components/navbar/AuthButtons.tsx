
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  user: any;
  logout?: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  isAuthenticated, 
  user, 
  logout 
}) => {
  const userInitials = user?.name ? 
    user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
    user?.email?.substring(0, 2).toUpperCase() || "U";
  
  return isAuthenticated ? (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Idioma</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇧🇷</span> Português
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span> English
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇪🇸</span> Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full h-8 w-8 p-0" aria-label="Menu do usuário">
            <Avatar className="h-8 w-8 border-2 border-fluida-blue">
              <AvatarImage src={user?.avatar_url} alt={user?.name || user?.email} />
              <AvatarFallback className="bg-fluida-blue text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || user?.email}</p>
              {user?.email && (
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Idioma</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇧🇷</span> Português
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span> English
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="text-lg">🇪🇸</span> Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button asChild variant="outline">
        <Link to="/login">Entrar</Link>
      </Button>
      <Button asChild variant="default">
        <Link to="/signup">Criar conta</Link>
      </Button>
    </div>
  );
};
