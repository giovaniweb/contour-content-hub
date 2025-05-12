
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lightbulb, Calendar, BarChart } from 'lucide-react';

const ContentStrategy = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-4xl font-light">Estratégia de Conteúdo</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Conteúdos</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Análise</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral da Estratégia</CardTitle>
              <CardDescription>
                Veja um resumo da sua estratégia de conteúdo atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conteúdos Planejados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-light">24</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conteúdos Publicados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-light">16</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Engajamento Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-light">8.5k</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Principais Tópicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Inovação em Saúde</span>
                      <span className="text-sm text-muted-foreground">8 conteúdos</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '80%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Tecnologias Médicas</span>
                      <span className="text-sm text-muted-foreground">6 conteúdos</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '60%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Tratamentos Avançados</span>
                      <span className="text-sm text-muted-foreground">5 conteúdos</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdos</CardTitle>
              <CardDescription>
                Gerencie todos os seus conteúdos estratégicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Você ainda não tem conteúdos registrados. 
                Comece criando seu primeiro conteúdo estratégico!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Conteúdo</CardTitle>
              <CardDescription>
                Planeje e visualize sua estratégia de conteúdo no tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 p-4">
                {[...Array(31)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square border rounded-md p-1 text-xs ${
                      [5, 12, 18, 25].includes(i) 
                        ? 'border-primary/40 bg-primary/5' 
                        : 'border-muted'
                    }`}
                  >
                    <div className="text-center">{i + 1}</div>
                    {[5, 12, 18, 25].includes(i) && (
                      <div className="h-1 w-full bg-primary rounded-full mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>
                Acompanhe o desempenho da sua estratégia de conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Os dados analíticos serão exibidos aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentStrategy;
