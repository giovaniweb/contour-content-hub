
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import CustomGptForm from '@/components/CustomGptForm';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CustomGpt: React.FC = () => {
  useEffect(() => {
    document.title = "GPT Personalizado | Reelline";
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Sparkles className="h-8 w-8 mr-2 text-blue-500" />
          <h1 className="text-2xl font-bold">GPT Personalizado</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Gere roteiros, big ideas e stories para equipamentos estéticos usando seu prompt personalizado.
        </p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            A aplicação está mostrando os equipamentos disponíveis no sistema.
            Se você não visualizar todos os 12 equipamentos esperados, verifique se eles foram
            corretamente cadastrados no banco de dados.
          </AlertDescription>
        </Alert>
        
        <CustomGptForm />
      </div>
    </Layout>
  );
};

export default CustomGpt;
