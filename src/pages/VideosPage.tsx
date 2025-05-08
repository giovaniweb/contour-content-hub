
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VideosPage: React.FC = () => {
  console.log("VideosPage - Rendering videos page");
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bem-vindo à sua biblioteca de vídeos.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VideosPage;
