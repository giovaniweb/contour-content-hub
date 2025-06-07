
import React from 'react';
import { motion } from 'framer-motion';
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
  Home,
  FileText,
  Video,
  Calendar,
  Lightbulb,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Wand2,
  Heart,
  Palette
} from 'lucide-react';
import { ROUTES } from '@/routes';
import { useAuth } from '@/context/AuthContext';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: ROUTES.DASHBOARD },
    { icon: FileText, label: 'Roteiros', path: ROUTES.CONTENT.SCRIPTS.ROOT },
    { icon: Video, label: 'Vídeos', path: ROUTES.VIDEOS.ROOT },
    { icon: Calendar, label: 'Planejador', path: ROUTES.CONTENT.PLANNER },
    { icon: Lightbulb, label: 'Ideias', path: ROUTES.CONTENT.IDEAS },
    { icon: BarChart3, label: 'Estratégia', path: ROUTES.CONTENT.STRATEGY },
  ];

  const contentMenuItems = [
    { icon: Wand2, label: 'Gerador', path: ROUTES.CONTENT.SCRIPTS.GENERATOR },
    { icon: Heart, label: 'Validador', path: ROUTES.CONTENT.SCRIPTS.VALIDATION },
    { icon: Palette, label: 'Calendário', path: ROUTES.CONTENT.CALENDAR },
  ];

  const adminMenuItems = [
    { icon: Users, label: 'Admin', path: ROUTES.ADMIN.ROOT },
    { icon: Settings, label: 'Configurações', path: ROUTES.WORKSPACE_SETTINGS },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen aurora-glass border-r border-white/20 flex flex-col">
      {/* Header */}
      <SidebarHeader>
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-aurora-lavender to-aurora-teal">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Fluida</span>
        </motion.div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    icon={<item.icon />}
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Content Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Conteúdo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    icon={<item.icon />}
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Admin Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    icon={<item.icon />}
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aurora-soft-pink to-aurora-electric-blue flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email || 'Usuário'}
            </p>
            <p className="text-xs text-white/60">Online</p>
          </div>
        </div>
      </SidebarFooter>
    </div>
  );
};

export default AppSidebar;
