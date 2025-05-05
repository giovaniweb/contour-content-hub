
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-contourline-lightGray/20">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-contourline-mediumBlue mb-6">404</h1>
        <p className="text-2xl text-gray-700 mb-4">Oops! Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <Home className="h-5 w-5" />
            <span>Voltar para o início</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
