
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/MockAuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from './index';
import { 
  Home, 
  BrainCircuit, 
  Settings, 
  LogOut,
  FileText,
  Video,
  Image,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Consultor Marketing",
    url: "/marketing-consultant",
    icon: BrainCircuit,
  },
  {
    title: "Histórico Diagnósticos",
    url: "/diagnostic-history",
    icon: FileText,
  },
  {
    title: "Vídeos",
    url: "/videos",
    icon: Video,
  },
  {
    title: "Mídia",
    url: "/media",
    icon: Image,
  },
  {
    title: "Planejador",
    url: "/content/planner",
    icon: Calendar,
  },
  {
    title: "Relatórios",
    url: "/marketing/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar className="bg-aurora-background border-r border-white/10">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-aurora-electric-purple rounded-lg flex items-center justify-center">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-semibold">FLUIDA</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url}
                      className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2 space-y-2">
          {user && (
            <div className="text-white/60 text-sm px-2">
              Olá, {user.nome || user.email}
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
