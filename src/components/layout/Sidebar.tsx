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
  const { user } = useAuth();

  // UNIVERSAIS: retirar menus pessoais e focar só em funcionalidades universais
  const universalMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Crown, label: 'Mestre da Beleza', path: '/mestre-da-beleza' },
    { icon: BrainCircuit, label: 'Consultor MKT', path: '/marketing-consultant' },
    { icon: Video, label: 'Vídeos', path: '/videos' },
    { icon: Image, label: 'Fotos', path: '/photos' },
    { icon: Palette, label: 'Artes', path: '/arts' },
    { icon: Wrench, label: 'Equipamentos', path: '/equipments' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarContainer className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm border-r border-white/20 flex flex-col">
      {/* Header */}
      <SidebarHeader>
        <motion.div
          className="flex items-center gap-3 cursor-pointer p-4"
          onClick={() => navigate('/dashboard')}
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
        {/* Universal Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4">
            Universal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {universalMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <motion.button
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-white/80 hover:text-white hover:bg-white/10",
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
      </SidebarContent>
      {/* Footer remove nome/role para minimalismo, pode restaurar se quiser */}
    </SidebarContainer>
  );
};

export default Sidebar;
