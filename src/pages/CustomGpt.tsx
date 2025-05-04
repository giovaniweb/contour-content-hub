
import React from 'react';
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CustomGptForm from "@/components/CustomGptForm";

const CustomGpt: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Criação de Conteúdo Personalizado</h1>
        
        <Tabs defaultValue="simple">
          <TabsList className="mb-6">
            <TabsTrigger value="simple">Gerador Simples</TabsTrigger>
            <TabsTrigger value="advanced">Modo Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simple">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerador de Conteúdo</h2>
              <p className="text-muted-foreground mb-6">
                Gere roteiros, big ideas e stories personalizados para seus equipamentos
              </p>
              
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
