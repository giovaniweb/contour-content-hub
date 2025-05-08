
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Library } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";

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
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-contourline-lightGray/20">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-contourline-mediumBlue mb-6">404</h1>
          <p className="text-2xl text-gray-700 mb-4">Oops! Página não encontrada</p>
          <p className="text-gray-500 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to={isAuthenticated ? "/dashboard" : "/"}>
                <Home className="h-5 w-5" />
                <span>Página Inicial</span>
              </Link>
            </Button>
            {isAuthenticated && (
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/media">
                  <Library className="h-5 w-5" />
                  <span>Biblioteca de Mídia</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
