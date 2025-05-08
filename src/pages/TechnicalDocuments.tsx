
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TechnicalDocuments: React.FC = () => {
  console.log("TechnicalDocuments - Rendering artigos page");
  
  return (
    <Layout title="Documentos Técnicos">
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
    </Layout>
  );
};

export default TechnicalDocuments;
