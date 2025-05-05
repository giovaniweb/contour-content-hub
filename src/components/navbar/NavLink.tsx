
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  icon, 
  label,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                  (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link to={to} onClick={onClick}>
      <div 
        className={cn(
          navigationMenuTriggerStyle(),
          "flex items-center gap-2",
          isActive ? "bg-accent text-accent-foreground" : ""
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};
