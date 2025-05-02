
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  HomeIcon,
  Video,
  FileText,
  Menu,
  X,
  Database
} from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { usePermissions } from "@/hooks/use-permissions";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isAdmin, isOperator } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Verificar se a página atual é o Dashboard para não mostrar o menu tradicional
  const isDashboardPage = location.pathname === "/dashboard";

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-30 w-full bg-white border-b border-contourline-lightBlue/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-contourline-mediumBlue">ReelLine</span>
          </Link>
          <LanguageSelector />
        </div>
      </header>
    );
  }

  // Esconder Navbar completo no Dashboard onde temos a sidebar
  if (isDashboardPage) {
    return null;
  }

  const navLinks = [
    {
      title: t('dashboard'),
      href: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: t('scripts'),
      href: "/script-generator",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: t('media'),
      href: "/media-library",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: t('calendar'),
      href: "/calendar",
      icon: <CalendarIcon className="h-5 w-5" />,
    }
  ];
  
  // Adicionar link para cadastro de conteúdo apenas se o usuário for admin ou operador
  if (isAdmin() || isOperator()) {
    navLinks.push({
      title: "Cadastrar",
      href: "/admin/content",
      icon: <Database className="h-5 w-5" />,
    });
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-contourline-lightBlue/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-contourline-mediumBlue">ReelLine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-1 text-contourline-darkBlue hover:text-contourline-mediumBlue transition-colors"
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>

          {/* Profile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <ProfileMenu />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-contourline-lightBlue/20 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-contourline-lightBlue/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
