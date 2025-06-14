import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sidebar as SidebarContainer,
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
  Video,
  Calendar,
  Lightbulb,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Wand2,
  Heart,
  Palette,
  Image,
  BrainCircuit,
  Wrench,
  LayoutDashboard,
  File,
  Film,
  Brain,
  LinkIcon,
  TestTube,
  ArrowLeftRight,
  Trophy,
  Crown
} from 'lucide-react';
import { ROUTES } from '@/routes';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Debug: verificar se o usuário está sendo carregado corretamente
  console.log('🔍 Sidebar - Usuário atual:', user);
  console.log('🔍 Sidebar - Role do usuário:', user?.role);
  console.log('🔍 Sidebar - Nome do usuário:', user?.nome);

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: ROUTES.DASHBOARD },
    { icon: Crown, label: 'Mestre da Beleza', path: '/mestre-da-beleza' },
    { icon: BrainCircuit, label: 'Consultor MKT', path: ROUTES.MARKETING.CONSULTANT },
    { icon: Wand2, label: 'FLUIDAROTEIRISTA', path: ROUTES.CONTENT.FLUIDAROTEIRISTA },
    { icon: Video, label: 'Video', path: ROUTES.VIDEOS.ROOT },
    { icon: Image, label: 'Imagem', path: '/photos' },
    { icon: Palette, label: 'Artes', path: '/arts' },
    { icon: Calendar, label: 'Planejador', path: ROUTES.CONTENT.PLANNER },
    { icon: Wrench, label: 'Equipamentos', path: ROUTES.EQUIPMENTS.LIST },
  ];

  const contentMenuItems = [
    { icon: Lightbulb, label: 'Ideias', path: ROUTES.CONTENT.IDEAS },
    { icon: BarChart3, label: 'Estratégia', path: ROUTES.CONTENT.STRATEGY },
    { icon: Heart, label: 'Validador', path: ROUTES.CONTENT.SCRIPTS.VALIDATION },
  ];

  const gamificationMenuItems = [
    { icon: Trophy, label: 'Dashboard', path: '/gamification' },
    { icon: ArrowLeftRight, label: 'Antes & Depois', path: '/before-after' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Painel Admin', path: ROUTES.ADMIN.ROOT },
    { icon: Wrench, label: 'Equipamentos', path: ROUTES.ADMIN.EQUIPMENTS.ROOT },
    { icon: File, label: 'Conteúdo', path: ROUTES.ADMIN.CONTENT },
    { icon: Film, label: 'Vídeos', path: ROUTES.ADMIN_VIDEOS },
    { icon: Brain, label: 'IA do Sistema', path: ROUTES.ADMIN.AI },
    { icon: LinkIcon, label: 'Integrações', path: ROUTES.ADMIN.SYSTEM.INTELLIGENCE },
    { icon: Video, label: 'Config. Vimeo', path: ROUTES.ADMIN.VIMEO.SETTINGS },
    { icon: TestTube, label: 'Diagnóstico', path: ROUTES.ADMIN.SYSTEM.DIAGNOSTICS },
    { icon: Settings, label: ROUTES.WORKSPACE_SETTINGS },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Verificar se o usuário é admin
  const isUserAdmin = user?.role === 'admin';
  console.log('🔍 Sidebar - É admin?', isUserAdmin);

  return (
    <SidebarContainer className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm border-r border-white/20 flex flex-col">
      {/* Header */}
      <SidebarHeader>
        <motion.div
          className="flex items-center gap-3 cursor-pointer p-4"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Fluida</span>
        </motion.div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <motion.button
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-white/80 hover:text-white hover:bg-white/10",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                        isActive(item.path) && "bg-white/15 text-white shadow-lg shadow-purple-500/20"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </motion.button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="border-white/10 my-2" />

        {/* Content Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
            Conteúdo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <motion.button
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-white/80 hover:text-white hover:bg-white/10",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                        isActive(item.path) && "bg-white/15 text-white shadow-lg shadow-purple-500/20"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </motion.button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="border-white/10 my-2" />

        {/* Gamification Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
            🎯 Gamificação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gamificationMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <motion.button
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-white/80 hover:text-white hover:bg-white/10",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                        isActive(item.path) && "bg-white/15 text-white shadow-lg shadow-purple-500/20"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </motion.button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="border-white/10 my-2" />

        {/* Admin Menu */}
        {isUserAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <motion.button
                        onClick={() => navigate(item.path)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                          "text-white/80 hover:text-white hover:bg-white/10",
                          "focus:outline-none focus:ring-2 focus:ring-purple-500/50",
                          isActive(item.path) && "bg-white/15 text-white shadow-lg shadow-purple-500/20"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                      </motion.button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - corrigido para mostrar o nome do usuário */}
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
              {user?.role === 'admin' ? 'Administrador' : 'Online'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
