
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileUp, FileCog } from 'lucide-react';

const VideoBatchImport: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Cadastro de Vídeos</h1>
        
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
              <Button className="w-full" onClick={() => navigate('/admin/videos')}>
                Iniciar Upload em Lote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileCog className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle>Gerenciar Vídeos</CardTitle>
              <CardDescription>
                Gerencie todos os vídeos cadastrados no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize, edite metadados e gerencie seus vídeos em um único lugar.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/admin/videos')}>
                Acessar Gerenciamento <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sobre o Cadastro de Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O sistema de cadastro de vídeos permite gerenciar todo o acervo de vídeos da plataforma, 
              organizando-os por categorias, equipamentos e metadados para facilitar a busca e utilização.
            </p>
            <p className="text-muted-foreground mt-4">
              Principais funcionalidades:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
              <li>Upload individual e em lote de vídeos</li>
              <li>Categorização automática por equipamentos</li>
              <li>Geração automática de thumbnails</li>
              <li>Sistema de tags e metadados</li>
              <li>Controle de acesso e permissões</li>
              <li>Análise de performance dos vídeos</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VideoBatchImport;
