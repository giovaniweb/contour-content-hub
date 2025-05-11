
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar: React.FC = () => {
  console.log("Calendar - Rendering agenda page");
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie sua agenda de conteúdo e acompanhe suas publicações.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;
