
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScriptValidation: React.FC = () => {
  console.log("ScriptValidation - Rendering script validation page");
  
  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default ScriptValidation;
