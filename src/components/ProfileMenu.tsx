
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut, User, Shield, Users, BrainCircuit } from "lucide-react";

const ProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { isAdmin, isOperator } = usePermissions();

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  const getUserRoleBadge = () => {
    if (isAdmin()) {
      return <Badge variant="outline" className="bg-contourline-darkBlue/10 border-contourline-darkBlue/20 text-contourline-darkBlue">Administrador</Badge>;
    }
    if (isOperator()) {
      return <Badge variant="outline" className="bg-contourline-mediumBlue/10 border-contourline-mediumBlue/20 text-contourline-mediumBlue">Operador</Badge>;
    }
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-contourline-lightBlue/30">
            <AvatarImage 
              src={user.profilePhotoUrl} 
              alt={user.name} 
              className="object-cover"
            />
            <AvatarFallback className="bg-contourline-mediumBlue text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {getUserRoleBadge() && <div className="mt-1">{getUserRoleBadge()}</div>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        
        {isAdmin() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Painel Admin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/integrations" className="flex items-center cursor-pointer">
                <BrainCircuit className="mr-2 h-4 w-4" />
                <span>Integrações</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {isOperator() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/operator" className="flex items-center cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                <span>Área do Operador</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
