
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  HomeIcon,
  Video,
  FileText,
  Menu,
  X
} from "lucide-react";
import ProfileMenu from "./ProfileMenu";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-reelline-primary">ReelLine</span>
          </Link>
        </div>
      </header>
    );
  }

  const navLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: "Scripts",
      href: "/script-generator",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Media",
      href: "/media-library",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: <CalendarIcon className="h-5 w-5" />,
    }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-reelline-primary">ReelLine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-reelline-primary transition-colors"
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>

          {/* Profile Menu */}
          <div className="flex items-center space-x-4">
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
        <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
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
