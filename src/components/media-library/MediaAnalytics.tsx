
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MediaAnalytics: React.FC = () => {
  return (
    <div className="pt-8 border-t">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Análises</h3>
        <Badge variant="outline">De 2 de abr a 2 de mai</Badge>
      </div>
      <div className="h-48 bg-slate-50 rounded-lg mb-4 flex items-center justify-center">
        <p className="text-muted-foreground">Gráfico de análises (demonstrativo)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-xl font-semibold">4.871</p>
              </div>
              <Badge variant="outline" className="text-xs">-11% em relação a 1 mês atrás</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Impressões</p>
                <p className="text-xl font-semibold">32,2 mil</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações únicas</p>
                <p className="text-xl font-semibold">545</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaAnalytics;
