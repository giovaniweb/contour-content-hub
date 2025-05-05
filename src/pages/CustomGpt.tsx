
import React from 'react';
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CustomGptForm from "@/components/CustomGptForm";
import { FileText, Sparkles, MessageSquare } from "lucide-react";

const CustomGpt: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Criação de Conteúdo Personalizado</h1>
        
        <div className="mb-8 p-4 bg-muted rounded-md border border-border">
          <h2 className="text-lg font-semibold mb-2">Objetivos de Marketing</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3 bg-background rounded-md border">
              <p className="font-medium">🟡 Atrair Atenção</p>
              <p className="text-sm text-muted-foreground">Criar curiosidade, interromper o scroll, gerar clique</p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="font-medium">🟢 Criar Conexão</p>
              <p className="text-sm text-muted-foreground">Gerar empatia, identificação, mostrar "por que você"</p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="font-medium">🔴 Fazer Comprar</p>
              <p className="text-sm text-muted-foreground">Destacar valor, diferencial, benefício, quebrar objeções</p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="font-medium">🔁 Reativar Interesse</p>
              <p className="text-sm text-muted-foreground">Resgatar contatos frios, leads antigos, pacientes inativos</p>
            </div>
            <div className="p-3 bg-background rounded-md border">
              <p className="font-medium">✅ Fechar Agora</p>
              <p className="text-sm text-muted-foreground">Ação imediata, urgência, chamada para conversão direta</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="simple">
          <TabsList className="mb-6">
            <TabsTrigger value="simple">Gerador Simples</TabsTrigger>
            <TabsTrigger value="advanced">Modo Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerador Rápido</h2>
              <p className="text-muted-foreground mb-6">
                Gere roteiros, big ideas e stories personalizados para seus equipamentos com apenas um clique
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Roteiro para Vídeo</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Crie roteiros estruturados para vídeos educativos e persuasivos
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Big Idea</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Desenvolva conceitos criativos poderosos para suas campanhas
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-medium text-lg mb-2">Stories</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Crie conteúdo atraente para stories com instruções de gravação
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <CustomGptForm mode="simple" />
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerador Avançado</h2>
              <p className="text-muted-foreground mb-6">
                Opções avançadas para personalização completa do seu conteúdo
              </p>
              
              <CustomGptForm mode="advanced" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomGpt;
