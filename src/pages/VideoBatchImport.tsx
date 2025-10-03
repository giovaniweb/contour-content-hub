import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes';
import { ArrowRight, FileUp, FileCog } from 'lucide-react';

const VideoBatchImport: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Importação em Lote</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileUp className="h-10 w-10 text-blue-500 mb-2" />
              <CardTitle>Upload em Lote</CardTitle>
              <CardDescription>
                Envie múltiplos vídeos de uma só vez para o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Selecione e envie vários arquivos de vídeo simultaneamente para processamento.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate(ROUTES.ADMIN.VIDEOS.IMPORT)}>
                Iniciar Upload em Lote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileCog className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Gerenciar Vídeos</CardTitle>
              <CardDescription>
                Gerencie todos os vídeos importados no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize, edite metadados e gerencie seus vídeos em um único lugar.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.VIDEOS.STORAGE)}>
                Acessar Gerenciamento <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sobre a Importação em Lote</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A importação em lote permite gerenciar múltiplos vídeos de uma só vez, 
              atribuindo metadados e configurações em massa. Isso é útil para organizar 
              grandes acervos de vídeos e facilitar sua gestão futura.
            </p>
            <p className="text-muted-foreground mt-4">
              Ao importar vídeos em lote, você pode:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li>Categorizar vários vídeos de uma vez</li>
              <li>Associar vídeos a equipamentos específicos</li>
              <li>Definir permissões de acesso em massa</li>
              <li>Adicionar tags e descrições padronizadas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VideoBatchImport;
