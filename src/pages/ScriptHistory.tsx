import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ScriptHistory: React.FC = () => {
  console.log("ScriptHistory - Rendering script history page");
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Veja o histórico de roteiros que você já validou.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ScriptHistory;
