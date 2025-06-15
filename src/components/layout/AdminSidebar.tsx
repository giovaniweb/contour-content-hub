
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Wrench, 
  File, 
  Film, 
  Brain, 
  LinkIcon,
  TestTube, 
  Settings 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Painel Admin', path: ROUTES.ADMIN.ROOT },
  { icon: Wrench, label: 'Equipamentos', path: ROUTES.ADMIN.EQUIPMENTS.ROOT },
  { icon: File, label: 'Conteúdo', path: ROUTES.ADMIN.CONTENT },
  { icon: Film, label: 'Vídeos', path: ROUTES.ADMIN_VIDEOS },
  { icon: Brain, label: 'IA do Sistema', path: ROUTES.ADMIN.AI },
  { icon: LinkIcon, label: 'Integrações', path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE },
  { icon: TestTube, label: 'Diagnóstico', path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS },
  { icon: Settings, label: 'Configurações do Workspace', path: ROUTES.WORKSPACE_SETTINGS },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm border-r border-white/20 flex flex-col">
      <SidebarHeader>
        <div
          className="flex items-center gap-3 cursor-pointer p-4"
          onClick={() => navigate(ROUTES.ADMIN.ROOT)}
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Fluida • Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
            Administração
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-white/80 hover:text-white hover:bg-white/10",
                        isActive(item.path) && "bg-white/15 text-white shadow-lg shadow-purple-500/20"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2 mx-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.nome?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.nome || user?.email || 'Usuário'}
            </p>
            <p className="text-xs text-white/60">
              Administrador
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
