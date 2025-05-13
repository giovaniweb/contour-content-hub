
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-8xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-2xl font-medium text-gray-800 mb-6">Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
          <Link to={ROUTES.HOME}>Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
