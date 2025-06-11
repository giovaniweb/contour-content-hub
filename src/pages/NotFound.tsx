
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-zinc-50 p-4">
      <div className="max-w-md w-full py-12 px-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
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
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Link>
          </Button>
          
          <Button 
            asChild 
            className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white"
          >
            <Link to="/dashboard">
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
