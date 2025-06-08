
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from '@/routes';
import { motion } from 'framer-motion';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  Menu,
  User,
  HelpCircle,
  PlusCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { sidebarData, adminItems } from "../sidebar/SidebarData";

export default function Sidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Check if the current path is active
  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD && (location.pathname === '/' || location.pathname === ROUTES.DASHBOARD)) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen border-r border-white/10 flex flex-col relative overflow-hidden bg-transparent">
      {/* Animated aurora effects for sidebar */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-0 w-24 h-24 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-0 w-20 h-20 rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.15, 0.08],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)',
            filter: 'blur(25px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.12, 0.05],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <SidebarComponent className="bg-transparent border-none relative z-10">
        <SidebarHeader className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            {open && (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div className="font-semibold text-xl text-white">
                  Fluida
                </div>
              </motion.div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white hover:bg-white/10"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4 overflow-y-auto">
          {/* Display all sidebar groups from our data */}
          {sidebarData.map((group, groupIndex) => (
            <SidebarGroup key={group.name} className="mb-6">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-medium text-gray-400 uppercase tracking-wider mb-3")}>
                {group.name}
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {group.links.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                          "text-gray-300 hover:text-white hover:bg-white/10",
                          isActive(item.path) && "bg-white/15 text-white",
                          item.highlight && "relative"
                        )}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                          {item.highlight && open && (
                            <motion.span 
                              className="w-2 h-2 rounded-full bg-blue-500"
                              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}

                {/* Only add Create Video button to the Videos group */}
                {group.name === "Vídeos" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (groupIndex * 0.1) + (group.links.length * 0.05) }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(ROUTES.VIDEOS.CREATE)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                          "text-blue-400 hover:text-blue-300 hover:bg-white/10",
                          isActive(ROUTES.VIDEOS.CREATE) && "bg-white/15 text-blue-300"
                        )}
                      >
                        <Link to={ROUTES.VIDEOS.CREATE}>
                          <PlusCircle className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">Criar Vídeo</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}
          
          {/* Admin menu */}
          {isAdmin && (
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-medium text-gray-400 uppercase tracking-wider mb-3")}>
                Administração
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                          "text-gray-300 hover:text-white hover:bg-white/10",
                          isActive(item.path) && "bg-white/15 text-white"
                        )}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        
        <SidebarFooter className="border-t border-white/10 p-4">
          {open ? (
            <motion.div 
              className="space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={ROUTES.PROFILE} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">Perfil</span>
              </Link>
              <Link to="/help" className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">Ajuda</span>
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Link to={ROUTES.PROFILE} className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <User className="h-5 w-5" />
              </Link>
              <Link to="/help" className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                <HelpCircle className="h-5 w-5" />
              </Link>
            </div>
          )}
        </SidebarFooter>
      </SidebarComponent>
    </div>
  );
}
