
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TechnicalDocuments: React.FC = () => {
  console.log("TechnicalDocuments - Rendering artigos page");
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentos Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você encontra artigos técnicos e documentação relevante.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TechnicalDocuments;
