
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, FileText, Film, Settings, ListTodo } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout title="Página Inicial">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Bem-vindo ao Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Acesse as funcionalidades principais abaixo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                Roteiros
              </CardTitle>
              <CardDescription>Crie e gerencie roteiros personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/custom-gpt">Acessar Roteiros</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Film className="mr-2 h-5 w-5 text-purple-500" />
                Mídia
              </CardTitle>
              <CardDescription>Biblioteca de arquivos de mídia</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/media">Acessar Mídia</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListTodo className="mr-2 h-5 w-5 text-green-500" />
                Estratégia de Conteúdo
              </CardTitle>
              <CardDescription>Planejar estratégias de conteúdo</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/content-strategy">Acessar Estratégias</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-amber-500" />
                Equipamentos
              </CardTitle>
              <CardDescription>Gerenciar equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin/equipments">Gerenciar Equipamentos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-red-500" />
                Agenda
              </CardTitle>
              <CardDescription>Calendário e agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/calendar">Acessar Agenda</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
