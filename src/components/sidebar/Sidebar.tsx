
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Contact2,
  Settings,
  Users,
  Wand2,
  LucideIcon
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar as SidebarContainer,
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  description?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Visão geral da sua conta'
    },
    {
      label: 'Consultor IA',
      icon: FileText,
      path: '/marketing-consultant',
      description: 'Diagnóstico de marketing'
    },
    {
      label: 'Roteirista IA',
      icon: Wand2,
      path: '/script-generator',
      description: 'Gere roteiros com IA'
    },
    {
      label: 'FLUIDAROTEIRISTA',
      icon: Wand2,
      path: '/fluidaroteirista',
      description: 'Roteiros criativos com IA'
    },
    {
      label: 'Histórico',
      icon: FileText,
      path: '/diagnostic-history',
      description: 'Seus diagnósticos salvos'
    },
    {
      label: 'Equipamentos',
      icon: Contact2,
      path: '/equipments',
      description: 'Gerenciar seus equipamentos'
    },
    {
      label: 'Usuários',
      icon: Users,
      path: '/users',
      description: 'Gerenciar usuários'
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
      description: 'Configurações da conta'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarContainer className="bg-aurora-background text-slate-50 border-r border-slate-700/40">
      <SidebarHeader>
        <div className="font-bold text-2xl">
          Fluida<span className="text-primary">AI</span>
        </div>
        <p className="text-muted-foreground">
          Marketing & Growth
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left",
                        "hover:bg-white/10 transition-colors",
                        location.pathname === item.path && "bg-white/15 text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-slate-400">{item.description}</div>
                        )}
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
              Documentação
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => handleNavigation('/docs/user-guide')}
              >
                Guia do usuário
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => handleNavigation('/docs/api-reference')}
              >
                API Reference
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
