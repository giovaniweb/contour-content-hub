
import React from 'react';
import { Card } from "@/components/ui/card";

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full h-[320px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Analisando seus dados...</p>
      </div>
    </Card>
  );
};

export default LoadingState;
