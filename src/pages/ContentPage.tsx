import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentPage: React.FC = () => {
  console.log("ContentPage - Rendering content page");
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie o conteúdo do seu site aqui.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ContentPage;
