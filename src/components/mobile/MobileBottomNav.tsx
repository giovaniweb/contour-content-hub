
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Kanban, BookOpen, Settings, Lightbulb } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, isActive }) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex flex-1 flex-col items-center justify-center space-y-1 px-2 py-1",
        isActive ? "text-fluida-blue" : "text-muted-foreground"
      )}
      aria-label={label}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-fluida-blue")} />
      <span className="text-[10px]">{label}</span>
      {isActive && (
        <div className="absolute top-0 h-1 w-10 rounded-full bg-fluida-blue" />
      )}
    </Link>
  );
};

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Kanban, label: 'Planner', path: '/content-planner' },
    { icon: Lightbulb, label: 'Ideas', path: '/content-ideas' },
    { icon: BookOpen, label: 'Resources', path: '/articles' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];
  
  // Only show on mobile devices
  if (window.innerWidth > 768) return null;
  
  return (
    <>
      <div className="h-16 md:hidden" /> {/* Spacer */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-md ios-safe-bottom md:hidden",
        className
      )}>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={currentPath === item.path || currentPath.startsWith(`${item.path}/`)}
          />
        ))}
      </nav>
    </>
  );
};

export default MobileBottomNav;
