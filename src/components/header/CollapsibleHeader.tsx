
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Bell, Search, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useScrollPosition } from '@/lib/interaction-utils';
import NotificationsMenu from '../notifications/NotificationsMenu';
import { useSidebar } from '@/components/ui/sidebar';

interface CollapsibleHeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  showBack = false,
  actions,
  transparent = false,
  className
}) => {
  const { isScrolled } = useScrollPosition();
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen } = useSidebar();
  const [titleOpacity, setTitleOpacity] = useState(1);
  
  // Adjust title opacity based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 30) {
        setTitleOpacity(1); // Full opacity at top
      } else if (scrollY < 100) {
        setTitleOpacity(1 - (scrollY - 30) / 70); // Fade out between 30px and 100px
      } else {
        setTitleOpacity(0); // Hidden after 100px scroll
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled && !transparent ? "bg-background/95 shadow-sm backdrop-blur-sm" : "bg-transparent",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          {showBack ? (
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          )}
          
          <div className="flex items-center">
            {title && (
              <h1 
                className={cn(
                  "text-xl font-semibold text-foreground transition-opacity duration-300",
                  isScrolled && "md:opacity-100 opacity-0"
                )}
              >
                {title}
              </h1>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {actions}
          
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          
          <NotificationsMenu />
        </div>
      </div>
    </header>
  );
};

export default CollapsibleHeader;
