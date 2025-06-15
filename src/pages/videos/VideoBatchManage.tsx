import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileEdit, Trash2, Video, Filter, SortAsc } from 'lucide-react';

const VideoBatchManage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gerenciar Vídeos em Lote</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              Ordenar
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
            <TabsTrigger value="all">Todos os Vídeos</TabsTrigger>
            <TabsTrigger value="flagged">Marcados</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="bg-muted/20 pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    Gerenciamento em Lote
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">42 vídeos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div>
                      <h3 className="font-medium">Como utilizar a Fluida</h3>
                      <p className="text-sm text-muted-foreground">Adicionado em 12/05/2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div>
                      <h3 className="font-medium">Tutorial de Marketing Digital</h3>
                      <p className="text-sm text-muted-foreground">Adicionado em 10/05/2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div>
                      <h3 className="font-medium">Estratégias para Instagram</h3>
                      <p className="text-sm text-muted-foreground">Adicionado em 05/05/2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline">Selecionar Todos</Button>
                <div className="space-x-2">
                  <Button variant="outline">Categorizar</Button>
                  <Button>Aplicar Mudanças</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="flagged" className="space-y-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum vídeo marcado.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="published" className="space-y-4">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum vídeo publicado ainda.</p>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Operações em Lote</CardTitle>
            <CardDescription>
              Realize operações em múltiplos vídeos simultaneamente para uma gestão mais eficiente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Categorizar</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Atribua categorias a múltiplos vídeos ao mesmo tempo.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Categorizar</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Definir Metadados</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Aplique tags e descrições padronizadas em lote.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Metadados</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Exportar Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Exporte informações de múltiplos vídeos para análise.
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Exportar</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VideoBatchManage;
