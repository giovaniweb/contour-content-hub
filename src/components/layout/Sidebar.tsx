
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
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-dark-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      </div>
      
      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <SidebarComponent className="bg-transparent border-r border-white/10 relative z-10">
        <SidebarHeader className="border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            {open && (
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 opacity-50 blur-md" />
                </motion.div>
                <div>
                  <div className="font-bold text-2xl text-white mb-1">
                    Fluida
                  </div>
                  <div className="text-xs text-white/60 font-medium">
                    Plataforma de Conteúdo
                  </div>
                </div>
              </motion.div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
              onClick={() => setOpen(!open)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4 overflow-y-auto scrollbar-hide">
          {/* Display all sidebar groups from our data */}
          {sidebarData.map((group, groupIndex) => (
            <SidebarGroup key={group.name} className="mb-8">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-semibold text-white/50 uppercase tracking-widest mb-4 px-3")}>
                {group.name}
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                {group.links.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: (groupIndex * 0.1) + (itemIndex * 0.05),
                      ease: "easeOut"
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                          "text-white/70 hover:text-white",
                          isActive(item.path) 
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white shadow-lg backdrop-blur-sm border border-white/10" 
                            : "hover:bg-white/10 hover:backdrop-blur-sm",
                          item.highlight && "relative"
                        )}
                      >
                        <Link to={item.path}>
                          {/* Gradient background for active items */}
                          {isActive(item.path) && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          {/* Icon with glow effect */}
                          <div className={cn(
                            "relative flex-shrink-0 transition-all duration-300",
                            isActive(item.path) && "drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]"
                          )}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          
                          {open && (
                            <>
                              <span className="flex-1 relative z-10">{item.name}</span>
                              {item.highlight && (
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"
                                  animate={{ 
                                    scale: [1, 1.3, 1], 
                                    opacity: [0.7, 1, 0.7] 
                                  }}
                                  transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}

                {/* Only add Create Video button to the Videos group */}
                {group.name === "Vídeos" && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: (groupIndex * 0.1) + (group.links.length * 0.05),
                      ease: "easeOut" 
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(ROUTES.VIDEOS.CREATE)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                          "text-cyan-300 hover:text-cyan-200",
                          isActive(ROUTES.VIDEOS.CREATE) 
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 shadow-lg backdrop-blur-sm border border-cyan-400/20" 
                            : "hover:bg-cyan-500/10 hover:backdrop-blur-sm"
                        )}
                      >
                        <Link to={ROUTES.VIDEOS.CREATE}>
                          <div className="relative flex-shrink-0 transition-all duration-300">
                            <PlusCircle className="h-5 w-5" />
                          </div>
                          {open && <span className="flex-1 relative z-10">Criar Vídeo</span>}
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
            <SidebarGroup className="mt-8 pt-6 border-t border-white/10">
              <SidebarGroupLabel className={cn(!open && "sr-only", "text-xs font-semibold text-orange-300/70 uppercase tracking-widest mb-4 px-3")}>
                Administração
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                {adminItems.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: itemIndex * 0.05,
                      ease: "easeOut" 
                    }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.path)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                          "text-orange-200/70 hover:text-orange-200",
                          isActive(item.path) 
                            ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-200 shadow-lg backdrop-blur-sm border border-orange-400/20" 
                            : "hover:bg-orange-500/10 hover:backdrop-blur-sm"
                        )}
                      >
                        <Link to={item.path}>
                          <div className="relative flex-shrink-0 transition-all duration-300">
                            <item.icon className="h-5 w-5" />
                          </div>
                          {open && <span className="flex-1 relative z-10">{item.name}</span>}
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
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to={ROUTES.PROFILE} 
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="flex-1">Perfil</span>
              </Link>
              <Link 
                to="/help" 
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="flex-1">Ajuda</span>
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Link 
                to={ROUTES.PROFILE} 
                className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link 
                to="/help" 
                className="p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <HelpCircle className="h-5 w-5" />
              </Link>
            </div>
          )}
        </SidebarFooter>
      </SidebarComponent>
    </div>
  );
}
