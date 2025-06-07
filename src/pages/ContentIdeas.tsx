
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const ContentIdeas: React.FC = () => {
  return (
    <Layout title="Validador de Ideias">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Validador de Ideias</h1>
            <p className="text-muted-foreground">
              Valide suas ideias de conteúdo com inteligência artificial
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O validador de ideias estará disponível em breve. Esta ferramenta permitirá
              que você analise e valide suas ideias de conteúdo antes de criá-las.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ContentIdeas;
