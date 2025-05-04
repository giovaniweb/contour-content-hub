
import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isNew = false,
  onClick
}) => {
  return (
    <RouterNavLink to={to} onClick={onClick}>
      <NavigationMenuLink 
        className={cn(
          navigationMenuTriggerStyle(),
          isActive ? "bg-accent text-accent-foreground" : ""
        )}
      >
        {icon}
        <span>{label}</span>
        {isNew && (
          <span className="ml-1.5 px-1.5 py-0.5 text-[0.6rem] font-medium bg-blue-100 text-blue-800 rounded-full">Novo</span>
        )}
      </NavigationMenuLink>
    </RouterNavLink>
  );
};
