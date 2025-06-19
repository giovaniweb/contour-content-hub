
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForgotPassword: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Esqueceu a Senha</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Este é um placeholder para a página de recuperação de senha. Por favor, navegue para a página inicial.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button>Ir para Página Inicial</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
