
// We need to create this file if it exists but we need to modify it to use Fluida colors
// Assuming this exists as it's imported in Navbar.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
            <Link to="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Configurações</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline">
        <Link to="/login">Entrar</Link>
      </Button>
      <Button asChild variant="default">
        <Link to="/register">Criar conta</Link>
      </Button>
    </div>
  );
};
