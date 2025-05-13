
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Video, FileText, Clock, BarChart3, Calendar } from 'lucide-react';
import GlassContainer from '@/components/ui/GlassContainer';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassContainer className="p-3">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-sm font-medium">Total de Vídeos</h3>
              <Video className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold">452</div>
              <p className="text-xs text-muted-foreground mt-1">
                +21 nos últimos 30 dias
              </p>
            </div>
          </GlassContainer>
          
          <GlassContainer className="p-3">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-sm font-medium">Visualizações</h3>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold">2,842</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% em relação ao mês anterior
              </p>
            </div>
          </GlassContainer>
          
          <GlassContainer className="p-3">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-sm font-medium">Artigos</h3>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold">38</div>
              <p className="text-xs text-muted-foreground mt-1">
                +4 nos últimos 30 dias
              </p>
            </div>
          </GlassContainer>
          
          <GlassContainer className="p-3">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-sm font-medium">Tempo de Visualização</h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold">872h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Média: 15min por video
              </p>
            </div>
          </GlassContainer>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassContainer className="col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Atividade Recente</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe as atividades mais recentes na plataforma.
              </p>
            </div>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-xl">
              <p className="text-muted-foreground text-center">
                Gráfico de atividades será exibido aqui
              </p>
            </div>
          </GlassContainer>
          
          <GlassContainer className="col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Próximas Publicações</h3>
              <p className="text-sm text-muted-foreground">
                Calendário de conteúdo agendado para publicação.
              </p>
            </div>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-xl">
              <div className="text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Calendário de publicações será exibido aqui
                </p>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
