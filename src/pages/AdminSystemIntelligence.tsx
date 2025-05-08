
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSystemIntelligence: React.FC = () => {
  return (
    <Layout title="Inteligência Artificial do Sistema">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">IA do Sistema</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure os modelos de inteligência artificial utilizados no sistema.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Treinamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gerencie os dados de treinamento para os modelos de IA.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSystemIntelligence;
