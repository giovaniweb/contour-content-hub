
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";
import GlassContainer from "@/components/ui/GlassContainer";
import ContentLayout from "@/components/layout/ContentLayout";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-zinc-50 p-4">
      <GlassContainer className="max-w-md w-full py-12 px-8 text-center">
        <h1 className="text-8xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            asChild 
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Link to={ROUTES.HOME}>
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
          >
            <Link to={ROUTES.DASHBOARD}>
              Dashboard
            </Link>
          </Button>
        </div>
      </GlassContainer>
    </div>
  );
};

export default NotFound;
