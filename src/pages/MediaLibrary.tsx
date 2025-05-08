
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MediaLibrary: React.FC = () => {
  console.log("MediaLibrary - Rendering media library page");
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bem-vindo à sua biblioteca de mídia.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MediaLibrary;
