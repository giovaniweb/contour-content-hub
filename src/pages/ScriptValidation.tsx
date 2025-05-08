
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScriptValidation: React.FC = () => {
  console.log("ScriptValidation - Rendering script validation page");
  
  return (
    <Layout title="Validador de Roteiros">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Validador de Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Valide seus roteiros antes de produzir seus vídeos.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ScriptValidation;
