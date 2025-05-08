
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface CollapsibleHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  actions?: React.ReactNode;
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  showBack = false,
  transparent = false,
  actions,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-200 h-16",
        scrolled || !transparent
          ? "border-b bg-background/95 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {!open && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {title && (
            <h1 className="font-medium text-lg truncate">{title}</h1>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default CollapsibleHeader;
