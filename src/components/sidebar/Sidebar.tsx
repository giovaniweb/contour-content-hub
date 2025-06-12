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
import { SidebarClose, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarNav } from "@/components/ui/sidebar";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  description?: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  
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

  return (
    <SidebarContent className="bg-aurora-background text-slate-50 border-r border-slate-700/40">
      <SidebarHeader>
        <div className="font-bold text-2xl">
          Fluida<span className="text-primary">AI</span>
        </div>
        <p className="text-muted-foreground">
          Marketing & Growth
        </p>
      </SidebarHeader>
      <SidebarNav>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            path={item.path}
            active={location.pathname === item.path}
            description={item.description}
          />
        ))}
      </SidebarNav>
      <SidebarFooter>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start font-normal">
              Documentação
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-2">
            <SidebarItem label="Guia do usuário" path="/docs/user-guide" />
            <SidebarItem label="API Reference" path="/docs/api-reference" />
          </CollapsibleContent>
        </Collapsible>
      </SidebarFooter>
    </SidebarContent>
  );
};

export default Sidebar;
