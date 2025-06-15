
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar: React.FC = () => {
  console.log("Calendar - Rendering agenda page");
  
  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default Calendar;
