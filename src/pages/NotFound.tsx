
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { ROUTES } from "@/routes";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <div className="text-center max-w-xl px-4">
          <h1 className="text-9xl font-light text-fluida-blue mb-6">404</h1>
          <p className="text-3xl font-light text-gray-700 mb-4">Página não encontrada</p>
          <p className="text-gray-500 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 bg-fluida-blue hover:bg-fluida-blue-dark">
              <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}>
                <Home className="h-5 w-5" />
                <span>Página Inicial</span>
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="gap-2 border-fluida-blue text-fluida-blue hover:bg-fluida-blue/10"
            >
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
