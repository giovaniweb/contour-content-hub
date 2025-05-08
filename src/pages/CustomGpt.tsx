
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomGpt: React.FC = () => {
  console.log("CustomGpt - Rendering roteiros page");
  
  return (
    <Layout title="Gerador de Roteiros">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerador de Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Use esta ferramenta para criar roteiros personalizados para seus vídeos.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomGpt;
